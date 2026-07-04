import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation, query, MutationCtx } from "./_generated/server";
import type { Doc, Id } from "./_generated/dataModel";

function toAddress(a: Doc<"addresses">) {
  return {
    id: a._id,
    label: a.label,
    address: a.address,
    city: a.city,
    state: a.state,
    pincode: a.pincode,
    isDefault: a.isDefault,
  };
}

async function requireOwnedAddress(
  ctx: MutationCtx,
  userId: Id<"users">,
  addressId: Id<"addresses">,
) {
  const doc = await ctx.db.get(addressId);
  if (!doc || doc.userId !== userId) throw new Error("Address not found");
  return doc;
}

export const listMine = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return [];
    const docs = await ctx.db
      .query("addresses")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    return docs.map(toAddress);
  },
});

export const add = mutation({
  args: {
    label: v.string(),
    address: v.string(),
    city: v.string(),
    state: v.string(),
    pincode: v.string(),
    isDefault: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Not authenticated");

    if (args.isDefault) {
      const existing = await ctx.db
        .query("addresses")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .collect();
      for (const addr of existing) {
        if (addr.isDefault) await ctx.db.patch(addr._id, { isDefault: false });
      }
    }

    return await ctx.db.insert("addresses", {
      userId,
      label: args.label,
      address: args.address,
      city: args.city,
      state: args.state,
      pincode: args.pincode,
      isDefault: args.isDefault ?? false,
    });
  },
});

export const update = mutation({
  args: {
    addressId: v.id("addresses"),
    label: v.optional(v.string()),
    address: v.optional(v.string()),
    city: v.optional(v.string()),
    state: v.optional(v.string()),
    pincode: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Not authenticated");
    const { addressId, ...updates } = args;
    await requireOwnedAddress(ctx, userId, addressId);
    await ctx.db.patch(addressId, updates);
  },
});

export const remove = mutation({
  args: { addressId: v.id("addresses") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Not authenticated");
    await requireOwnedAddress(ctx, userId, args.addressId);
    await ctx.db.delete(args.addressId);
  },
});

export const setDefault = mutation({
  args: { addressId: v.id("addresses") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Not authenticated");
    await requireOwnedAddress(ctx, userId, args.addressId);

    const existing = await ctx.db
      .query("addresses")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    for (const addr of existing) {
      await ctx.db.patch(addr._id, { isDefault: addr._id === args.addressId });
    }
  },
});
