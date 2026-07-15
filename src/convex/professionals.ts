import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import type { Doc } from "./_generated/dataModel";
import { ROLES } from "./schema";
import type { QueryCtx } from "./_generated/server";

const idDocumentTypeValidator = v.union(
  v.literal("aadhar"),
  v.literal("pan"),
  v.literal("driving_license"),
);

export async function toProfessional(ctx: QueryCtx, p: Doc<"professionals">) {
  const user = await ctx.db.get(p.userId);
  return {
    id: p._id,
    name: user?.name ?? p.name,
    avatar: user?.image ?? p.avatar,
    rating: p.rating,
    reviewCount: p.reviewCount,
    completedJobs: p.completedJobs,
    specialties: p.specialties,
    bio: p.bio,
    approved: p.approved ?? false,
    experienceYears: p.experienceYears ?? 0,
  };
}

export const listBySpecialty = query({
  args: { categorySlug: v.string() },
  handler: async (ctx, args) => {
    const docs = await ctx.db.query("professionals").collect();
    const filtered = docs.filter(
      (p) => (p.approved ?? false) && p.specialties.includes(args.categorySlug),
    );
    return await Promise.all(filtered.map((p) => toProfessional(ctx, p)));
  },
});

export const myProfile = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return null;
    const doc = await ctx.db
      .query("professionals")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();
    return doc ? await toProfessional(ctx, doc) : null;
  },
});

export const generateIdUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Not authenticated");
    return await ctx.storage.generateUploadUrl();
  },
});

export const backfillNames = mutation({
  args: {},
  handler: async (ctx) => {
    for (const p of await ctx.db.query("professionals").collect()) {
      const user = await ctx.db.get(p.userId);
      if (user?.name && p.name !== user.name) {
        await ctx.db.patch(p._id, { name: user.name });
      }
    }
  },
});

export const registerAsProfessional = mutation({
  args: {
    fullName: v.string(), // <-- new
    specialties: v.array(v.string()),
    bio: v.optional(v.string()),
    experienceYears: v.number(),
    idDocumentType: idDocumentTypeValidator,
    idDocumentStorageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("professionals")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();
    if (existing !== null)
      throw new Error("Already registered as a professional");

    const user = await ctx.db.get(userId);
    if (!user) throw new Error("User not found");

    if (!user.name) {
      await ctx.db.patch(userId, { name: args.fullName }); // <-- new
    }

    const professionalId = await ctx.db.insert("professionals", {
      userId,
      name: user.name ?? args.fullName,
      avatar:
        user.image ??
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`,
      rating: 5,
      reviewCount: 0,
      completedJobs: 0,
      specialties: args.specialties,
      bio: args.bio,
      experienceYears: args.experienceYears,
      idDocumentType: args.idDocumentType,
      idDocumentStorageId: args.idDocumentStorageId,
      approved: false,
    });

    await ctx.db.patch(userId, { role: ROLES.PROFESSIONAL });

    return professionalId;
  },
});
