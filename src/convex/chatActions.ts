import { v } from "convex/values";
import { makeFunctionReference } from "convex/server";
import { action } from "./_generated/server";
import type { Doc, Id } from "./_generated/dataModel";

const currentUserRef = makeFunctionReference<"query", Record<string, never>, Doc<"users"> | null>(
  "users:currentUser",
);
const listMineRef = makeFunctionReference<
  "query",
  Record<string, never>,
  { id: string; role: "user" | "assistant"; content: string; createdAt: string }[]
>("chat:listMine");
const insertMessageRef = makeFunctionReference<
  "mutation",
  { userId: Id<"users">; role: "user" | "assistant"; content: string },
  void
>("chat:insertMessage");

const SYSTEM_PROMPT = `You are the customer support assistant for Dukaan Konnect, a home services booking platform. Customers can browse categories (cleaning, plumbing, electrical, salon & spa, carpentry, painting, appliance repair, pest control), book a professional for a service, track bookings on their Orders page, and manage saved addresses in their Profile. Professionals can register from their Profile page ("Become a Service Professional") and manage job requests from their dashboard.

Help users understand how to use the app: finding and booking services, what happens after booking (status goes pending -> confirmed -> in_progress -> completed), managing addresses, and becoming a professional. You cannot look up a specific user's private account or order data yourself — if they ask about a specific booking, tell them to check their Orders page, and for anything you can't resolve, tell them to contact human support. Keep answers short, friendly, and specific to Dukaan Konnect.

Only state facts about Dukaan Konnect that are explicitly given to you here — never invent steps, screens, or requirements that were not described above. In particular: sign-in is passwordless, via a 6-digit email verification code only — there is no password to create or enter, ever. Do not mention passwords, "registration forms", phone/OTP-based signup, ID verification for customers, or any other detail not stated in this prompt. If you are unsure whether something is accurate, say so and point the user to human support rather than guessing.`;

const FALLBACK_REPLY =
  "Sorry, I'm having trouble responding right now. Please try again in a moment.";

export const sendMessage = action({
  args: { content: v.string() },
  handler: async (ctx, args): Promise<void> => {
    const trimmed = args.content.trim();
    if (!trimmed) throw new Error("Message cannot be empty");

    const user = await ctx.runQuery(currentUserRef, {});
    if (!user) throw new Error("Not authenticated");

    await ctx.runMutation(insertMessageRef, {
      userId: user._id,
      role: "user",
      content: trimmed,
    });

    const history = await ctx.runQuery(listMineRef, {});

    const apiKey = process.env.SARVAM_API_KEY;
    if (!apiKey) throw new Error("SARVAM_API_KEY is not configured");

    let reply: string;
    try {
      const res = await fetch("https://api.sarvam.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-subscription-key": apiKey,
        },
        body: JSON.stringify({
          model: "sarvam-30b",
          max_tokens: 2048,
          reasoning_effort: "low",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...history.map((m) => ({ role: m.role, content: m.content })),
          ],
        }),
      });

      if (!res.ok) {
        throw new Error(`Sarvam API error: ${res.status} ${await res.text()}`);
      }

      const data = await res.json();
      const content = data?.choices?.[0]?.message?.content;
      reply =
        typeof content === "string" && content.length > 0
          ? content
          : "Sorry, I couldn't generate a response. Please try again.";
    } catch (error) {
      reply = FALLBACK_REPLY;
      console.error("Sarvam API error:", error);
    }

    await ctx.runMutation(insertMessageRef, {
      userId: user._id,
      role: "assistant",
      content: reply,
    });
  },
});
