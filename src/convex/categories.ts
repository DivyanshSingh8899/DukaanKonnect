import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAdmin } from "./adminAuth";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const docs = await ctx.db.query("categories").collect();
    return docs.map((c) => ({
      id: c._id,
      name: c.name,
      slug: c.slug,
      icon: c.icon,
      description: c.description,
      serviceCount: c.serviceCount,
    }));
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    icon: v.string(),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const existing = await ctx.db
      .query("categories")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
    if (existing) throw new Error("A category with this slug already exists");
    return await ctx.db.insert("categories", { ...args, serviceCount: 0 });
  },
});

export const update = mutation({
  args: {
    categoryId: v.id("categories"),
    name: v.optional(v.string()),
    icon: v.optional(v.string()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const { categoryId, ...updates } = args;
    await ctx.db.patch(categoryId, updates);
  },
});

export const remove = mutation({
  args: { categoryId: v.id("categories") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const inUse = await ctx.db
      .query("services")
      .withIndex("by_category", (q) => q.eq("categoryId", args.categoryId))
      .first();
    if (inUse) throw new Error("Cannot delete a category that still has services");
    await ctx.db.delete(args.categoryId);
  },
});
