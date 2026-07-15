import { Email } from "@convex-dev/auth/providers/Email";
import type { GenericActionCtxWithAuthConfig } from "@convex-dev/auth/server";
import { RandomReader, generateRandomString } from "@oslojs/crypto/random";
import { makeFunctionReference } from "convex/server";
import type { DataModel } from "../_generated/dataModel";

const sendOtpEmailRef = makeFunctionReference<
  "action",
  { email: string; token: string },
  void
>("auth/sendOtpEmail:send");

export const emailOtp = Email({
  id: "email-otp",
  maxAge: 60 * 15,
  async generateVerificationToken() {
    const random: RandomReader = {
      read(bytes: Uint8Array) {
        crypto.getRandomValues(bytes);
      },
    };
    const alphabet = "0123456789";
    return generateRandomString(random, alphabet, 6);
  },
  async sendVerificationRequest(
    { identifier: email, token }: { identifier: string; token: string },
    ctx?: GenericActionCtxWithAuthConfig<DataModel>,
  ) {
    await ctx!.runAction(sendOtpEmailRef, { email, token });
  },
});
