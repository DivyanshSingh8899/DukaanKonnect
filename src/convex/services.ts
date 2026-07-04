import { v } from "convex/values";
import { query } from "./_generated/server";
import type { Doc } from "./_generated/dataModel";

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
