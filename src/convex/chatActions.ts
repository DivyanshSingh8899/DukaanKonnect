import { v } from "convex/values";
import { makeFunctionReference } from "convex/server";
import { action } from "./_generated/server";
import type { Doc, Id } from "./_generated/dataModel";

const currentUserRef = makeFunctionReference<"query", Record<string, never>, Doc<"users"> | null>(
  "users:currentUser",
);
const insertMessageRef = makeFunctionReference<
  "mutation",
  { userId: Id<"users">; role: "user" | "assistant"; content: string },
  void
>("chat:insertMessage");

const FAQ_RULES: { keywords: string[]; reply: string }[] = [
  {
    keywords: ["book", "booking", "hire", "schedule"],
    reply:
      "To book a service: browse a category from the Home or Services page, pick a service, choose a professional and time slot, then confirm. You can track it afterward on your Orders page.",
  },
  {
    keywords: ["order", "track", "status", "where is my"],
    reply:
      "You can track your bookings on the Orders page. Each booking moves through pending → confirmed → in_progress → completed.",
  },
  {
    keywords: ["cancel", "refund"],
    reply:
      "To cancel or ask about a refund for a specific booking, please open it from your Orders page. For anything the app can't resolve, contact human support.",
  },
  {
    keywords: ["address", "location"],
    reply:
      "You can add, edit, or remove saved addresses from your Profile page.",
  },
  {
    keywords: ["professional", "provider", "become", "join", "work with"],
    reply:
      "To become a service professional, go to your Profile page and select \"Become a Service Professional.\" Once approved, you can manage job requests from your professional dashboard.",
  },
  {
    keywords: ["pay", "payment", "price", "cost"],
    reply:
      "Pricing is shown on each service before you book, and payment is collected securely at checkout via Razorpay.",
  },
  {
    keywords: ["hi", "hello", "hey"],
    reply: "Hi! I'm the Dukaan Konnect assistant. Ask me about booking a service, tracking an order, or becoming a professional.",
  },
];

const FALLBACK_REPLY =
  "I'm not able to help with that specific question. Please check your Orders or Profile page, or contact human support for further help.";

function pickReply(message: string): string {
  const lower = message.toLowerCase();
  for (const rule of FAQ_RULES) {
    if (rule.keywords.some((k) => lower.includes(k))) {
      return rule.reply;
    }
  }
  return FALLBACK_REPLY;
}

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

    await ctx.runMutation(insertMessageRef, {
      userId: user._id,
      role: "assistant",
      content: pickReply(trimmed),
    });
  },
});
