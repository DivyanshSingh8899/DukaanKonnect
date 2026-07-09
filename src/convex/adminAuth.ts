import { getAuthUserId } from "@convex-dev/auth/server";
import { ROLES } from "./schema";
import type { QueryCtx } from "./_generated/server";

export async function requireAdmin(ctx: QueryCtx) {
  const userId = await getAuthUserId(ctx);
  if (userId === null) throw new Error("Not authenticated");
  const user = await ctx.db.get(userId);
  if (!user || user.role !== ROLES.ADMIN) throw new Error("Not authorized");
  return userId;
}
