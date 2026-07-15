import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation, query, QueryCtx, MutationCtx } from "./_generated/server";
import { toService } from "./services";
import { toProfessional } from "./professionals";

async function getMyProfessional(ctx: QueryCtx | MutationCtx) {
  const userId = await getAuthUserId(ctx);
  if (userId === null) return null;
  return await ctx.db
    .query("professionals")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .unique();
}

export const myServices = query({
  args: {},
  handler: async (ctx) => {
    const professional = await getMyProfessional(ctx);
    if (!professional) return [];

    const rows = await ctx.db
      .query("professionalServices")
      .withIndex("by_professional", (q) => q.eq("professionalId", professional._id))
      .collect();

    return (
      await Promise.all(
        rows.map(async (row) => {
          const service = await ctx.db.get(row.serviceId);
          if (!service) return null;
          return {
            id: row._id,
            service: toService(service),
            price: row.price,
          };
        }),
      )
    ).filter((r): r is NonNullable<typeof r> => r !== null);
  },
});

export const addOrUpdate = mutation({
  args: { serviceId: v.id("services"), price: v.number() },
  handler: async (ctx, args) => {
    const professional = await getMyProfessional(ctx);
    if (!professional) throw new Error("Not registered as a professional");
    if (args.price <= 0) throw new Error("Price must be greater than 0");

    const existing = await ctx.db
      .query("professionalServices")
      .withIndex("by_professional", (q) => q.eq("professionalId", professional._id))
      .filter((q) => q.eq(q.field("serviceId"), args.serviceId))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, { price: args.price });
      return existing._id;
    }

    return await ctx.db.insert("professionalServices", {
      professionalId: professional._id,
      serviceId: args.serviceId,
      price: args.price,
    });
  },
});

export const remove = mutation({
  args: { professionalServiceId: v.id("professionalServices") },
  handler: async (ctx, args) => {
    const professional = await getMyProfessional(ctx);
    if (!professional) throw new Error("Not registered as a professional");

    const row = await ctx.db.get(args.professionalServiceId);
    if (!row || row.professionalId !== professional._id) {
      throw new Error("Not found");
    }
    await ctx.db.delete(args.professionalServiceId);
  },
});

export const listForService = query({
  args: { serviceId: v.id("services") },
  handler: async (ctx, args) => {
    const rows = await ctx.db
      .query("professionalServices")
      .withIndex("by_service", (q) => q.eq("serviceId", args.serviceId))
      .collect();

    return (
      await Promise.all(
        rows.map(async (row) => {
          const professional = await ctx.db.get(row.professionalId);
          if (!professional || !(professional.approved ?? false)) return null;
          return {
            professional: toProfessional(ctx, professional),
            price: row.price,
          };
        }),
      )
    ).filter((r): r is NonNullable<typeof r> => r !== null);
  },
});
