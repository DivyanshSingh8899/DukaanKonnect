import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import type { Doc } from "./_generated/dataModel";
import { requireAdmin } from "./adminAuth";

export function toService(s: Doc<"services">) {
  return {
    id: s._id,
    name: s.name,
    slug: s.slug,
    categoryId: s.categoryId,
    categoryName: s.categoryName,
    categorySlug: s.categorySlug,
    description: s.description,
    price: s.price,
    duration: s.duration,
    rating: s.rating,
    reviewCount: s.reviewCount,
    image: s.image,
    featured: s.featured,
    tags: s.tags,
  };
}

export const list = query({
  args: {},
  handler: async (ctx) => {
    const docs = await ctx.db.query("services").collect();
    return docs.map(toService);
  },
});

export const listFeatured = query({
  args: {},
  handler: async (ctx) => {
    const docs = await ctx.db
      .query("services")
      .withIndex("by_featured", (q) => q.eq("featured", true))
      .collect();
    return docs.map(toService);
  },
});

export const getById = query({
  args: { id: v.id("services") },
  handler: async (ctx, args) => {
    const doc = await ctx.db.get(args.id);
    return doc ? toService(doc) : null;
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const doc = await ctx.db
      .query("services")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
    return doc ? toService(doc) : null;
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    categoryId: v.id("categories"),
    description: v.string(),
    price: v.number(),
    duration: v.number(),
    image: v.string(),
    featured: v.boolean(),
    tags: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const existing = await ctx.db
      .query("services")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
    if (existing) throw new Error("A service with this slug already exists");

    const category = await ctx.db.get(args.categoryId);
    if (!category) throw new Error("Category not found");

    const { categoryId, ...rest } = args;
    const serviceId = await ctx.db.insert("services", {
      ...rest,
      categoryId,
      categoryName: category.name,
      categorySlug: category.slug,
      rating: 5,
      reviewCount: 0,
    });

    await ctx.db.patch(categoryId, { serviceCount: category.serviceCount + 1 });
    return serviceId;
  },
});

export const update = mutation({
  args: {
    serviceId: v.id("services"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    price: v.optional(v.number()),
    duration: v.optional(v.number()),
    image: v.optional(v.string()),
    featured: v.optional(v.boolean()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const { serviceId, ...updates } = args;
    await ctx.db.patch(serviceId, updates);
  },
});

export const remove = mutation({
  args: { serviceId: v.id("services") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const service = await ctx.db.get(args.serviceId);
    if (!service) return;
    const category = await ctx.db.get(service.categoryId);
    if (category) {
      await ctx.db.patch(category._id, {
        serviceCount: Math.max(0, category.serviceCount - 1),
      });
    }
    await ctx.db.delete(args.serviceId);
  },
});
