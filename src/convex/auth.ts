import { convexAuth } from "@convex-dev/auth/server";
import { Anonymous } from "@convex-dev/auth/providers/Anonymous";
import { emailOtp } from "./auth/emailOtp";
import { ROLES } from "./schema";

const ADMIN_EMAIL = "divyanshsinghds89@gmail.com";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [emailOtp, Anonymous],
  callbacks: {
    async createOrUpdateUser(ctx, args) {
      const email = args.profile.email as string | undefined;
      const name = args.profile.name as string | undefined;

      // Reuse existing row if this identity already has one
      if (args.existingUserId) {
        const patch: Record<string, unknown> = {};
        if (email) {
          patch.email = email;
          if (email === ADMIN_EMAIL) patch.role = ROLES.ADMIN;
        }
        if (name) patch.name = name;
        if (Object.keys(patch).length > 0) {
          await ctx.db.patch(args.existingUserId, patch);
        }
        return args.existingUserId;
      }

      // New user
      const role = email === ADMIN_EMAIL ? ROLES.ADMIN : ROLES.USER;
      return await ctx.db.insert("users", {
        email,
        name,
        role,
      });
    },
  },
});