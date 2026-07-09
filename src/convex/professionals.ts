import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import type { Doc } from "./_generated/dataModel";
import { ROLES } from "./schema";

export function toProfessional(p: Doc<"professionals">) {
  return {
    id: p._id,
    name: p.name,
    avatar: p.avatar,
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
    return docs
      .filter((p) => (p.approved ?? false) && p.specialties.includes(args.categorySlug))
      .map(toProfessional);
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
    return doc ? toProfessional(doc) : null;
  },
});

export const registerAsProfessional = mutation({
  args: {
    specialties: v.array(v.string()),
    bio: v.optional(v.string()),
    experienceYears: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("professionals")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();
    if (existing !== null) throw new Error("Already registered as a professional");

    const user = await ctx.db.get(userId);
    if (!user) throw new Error("User not found");

    const professionalId = await ctx.db.insert("professionals", {
      userId,
      name: user.name ?? "Professional",
      avatar:
        user.image ??
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`,
      rating: 5,
      reviewCount: 0,
      completedJobs: 0,
      specialties: args.specialties,
      bio: args.bio,
      experienceYears: args.experienceYears,
      approved: false,
    });

    await ctx.db.patch(userId, { role: ROLES.PROFESSIONAL });

    return professionalId;
  },
});
