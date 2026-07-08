"use node";

import crypto from "node:crypto";
import { v } from "convex/values";
import { makeFunctionReference } from "convex/server";
import { action } from "./_generated/server";
import type { Id } from "./_generated/dataModel";
import type { toService } from "./services";

interface RazorpayOrder {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
}

const getServiceByIdRef = makeFunctionReference<
  "query",
  { id: Id<"services"> },
  ReturnType<typeof toService> | null
>("services:getById");

const createBookingRef = makeFunctionReference<
  "mutation",
  {
    serviceId: Id<"services">;
    professionalId?: Id<"professionals">;
    date: string;
    time: string;
    address: string;
    notes?: string;
    paymentOrderId?: string;
    paymentId?: string;
  },
  Id<"bookings">
>("bookings:create");

function getRazorpayCredentials() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    throw new Error("Razorpay is not configured");
  }
  return { keyId, keySecret };
}

export const createOrder = action({
  args: { serviceId: v.id("services") },
  handler: async (ctx, args): Promise<RazorpayOrder> => {
    const service = await ctx.runQuery(getServiceByIdRef, {
      id: args.serviceId,
    });
    if (!service) throw new Error("Service not found");

    const { keyId, keySecret } = getRazorpayCredentials();
    const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");

    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: Math.round(service.price * 100),
        currency: "INR",
        receipt: `svc_${args.serviceId}_${Date.now()}`,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Razorpay order creation failed: ${text}`);
    }

    const order = await response.json();
    return {
      orderId: order.id as string,
      amount: order.amount as number,
      currency: order.currency as string,
      keyId,
    };
  },
});

export const verifyAndBook = action({
  args: {
    razorpayOrderId: v.string(),
    razorpayPaymentId: v.string(),
    razorpaySignature: v.string(),
    serviceId: v.id("services"),
    professionalId: v.optional(v.id("professionals")),
    date: v.string(),
    time: v.string(),
    address: v.string(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<Id<"bookings">> => {
    const { keySecret } = getRazorpayCredentials();

    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(`${args.razorpayOrderId}|${args.razorpayPaymentId}`)
      .digest("hex");

    const expected = Buffer.from(expectedSignature);
    const actual = Buffer.from(args.razorpaySignature);
    const isValid =
      expected.length === actual.length &&
      crypto.timingSafeEqual(expected, actual);

    if (!isValid) {
      throw new Error("Payment verification failed");
    }

    return await ctx.runMutation(createBookingRef, {
      serviceId: args.serviceId,
      professionalId: args.professionalId,
      date: args.date,
      time: args.time,
      address: args.address,
      notes: args.notes,
      paymentOrderId: args.razorpayOrderId,
      paymentId: args.razorpayPaymentId,
    });
  },
});
