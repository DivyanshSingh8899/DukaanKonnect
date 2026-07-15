"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";
import Razorpay from "razorpay";
import crypto from "crypto";

function getRazorpay() {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;
  if (!key_id || !key_secret) {
    throw new Error(
      "Razorpay keys are not set. Run: npx convex env set RAZORPAY_KEY_ID ... and RAZORPAY_KEY_SECRET ..."
    );
  }
  return new Razorpay({ key_id, key_secret });
}

export const createRazorpayOrder = action({
  args: { amount: v.number() },
  handler: async (_ctx, { amount }) => {
    if (amount <= 0) throw new Error("Invalid amount");
    const razorpay = getRazorpay();

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    });

    return {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    };
  },
});

export const verifyPayment = action({
  args: {
    razorpayOrderId: v.string(),
    razorpayPaymentId: v.string(),
    razorpaySignature: v.string(),
  },
  handler: async (_ctx, args) => {
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) throw new Error("RAZORPAY_KEY_SECRET is not set");

    const expected = crypto
      .createHmac("sha256", secret)
      .update(`${args.razorpayOrderId}|${args.razorpayPaymentId}`)
      .digest("hex");

    const valid = crypto.timingSafeEqual(
      Buffer.from(expected),
      Buffer.from(args.razorpaySignature)
    );

    if (!valid) throw new Error("Payment verification failed");
    return { verified: true, paymentId: args.razorpayPaymentId };
  },
});