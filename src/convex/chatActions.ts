"use node";

import Anthropic from "@anthropic-ai/sdk";
import { v } from "convex/values";
import { action } from "./_generated/server";
import { api, internal } from "./_generated/api";

const SYSTEM_PROMPT = `You are the customer support assistant for Dukaan Konnect, a home services booking platform. Customers can browse categories (cleaning, plumbing, electrical, salon & spa, carpentry, painting, appliance repair, pest control), book a professional for a service, track bookings on their Orders page, and manage saved addresses in their Profile. Professionals can register from their Profile page ("Become a Service Professional") and manage job requests from their dashboard.

Help users understand how to use the app: finding and booking services, what happens after booking (status goes pending -> confirmed -> in_progress -> completed), managing addresses, and becoming a professional. You cannot look up a specific user's private account or order data yourself — if they ask about a specific booking, tell them to check their Orders page, and for anything you can't resolve, tell them to contact human support. Keep answers short, friendly, and specific to Dukaan Konnect.`;

export const sendMessage = action({
  args: { content: v.string() },
  handler: async (ctx, args) => {
    const trimmed = args.content.trim();
    if (!trimmed) throw new Error("Message cannot be empty");

    const user = await ctx.runQuery(api.users.currentUser);
    if (!user) throw new Error("Not authenticated");

    await ctx.runMutation(internal.chat.insertMessage, {
      userId: user._id,
      role: "user",
      content: trimmed,
    });

    const history = await ctx.runQuery(api.chat.listMine, {});

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not configured");
    const anthropic = new Anthropic({ apiKey });

    let reply: string;
    try {
      const response = await anthropic.messages.create({
        model: "claude-opus-4-8",
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: history.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      });

      if (response.stop_reason === "refusal") {
        reply = "I'm not able to help with that. Please contact human support.";
      } else {
        const textBlock = response.content.find((b) => b.type === "text");
        reply =
          textBlock && textBlock.type === "text"
            ? textBlock.text
            : "Sorry, I couldn't generate a response. Please try again.";
      }
    } catch (error) {
      reply =
        "Sorry, I'm having trouble responding right now. Please try again in a moment.";
      console.error("Anthropic API error:", error);
    }

    await ctx.runMutation(internal.chat.insertMessage, {
      userId: user._id,
      role: "assistant",
      content: reply,
    });
  },
});
