import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { internalMutation, query } from "./_generated/server";

export const listMine = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return [];
    const docs = await ctx.db
      .query("chatMessages")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    return docs
      .map((d) => ({
        id: d._id,
        role: d.role,
        content: d.content,
        createdAt: d.createdAt,
      }))
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  },
});

export const insertMessage = internalMutation({
  args: {
    userId: v.id("users"),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("chatMessages", {
      ...args,
      createdAt: new Date().toISOString(),
    });
  },
});
