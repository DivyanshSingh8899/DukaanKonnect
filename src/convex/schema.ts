import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

// default user roles. can add / remove based on the project as needed
export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  MEMBER: "member",
  PROFESSIONAL: "professional",
} as const;

export const roleValidator = v.union(
  v.literal(ROLES.ADMIN),
  v.literal(ROLES.USER),
  v.literal(ROLES.MEMBER),
  v.literal(ROLES.PROFESSIONAL),
);
export type Role = Infer<typeof roleValidator>;

export const orderStatusValidator = v.union(
  v.literal("pending"),
  v.literal("confirmed"),
  v.literal("in_progress"),
  v.literal("completed"),
  v.literal("cancelled"),
);
export type OrderStatusValue = Infer<typeof orderStatusValidator>;

const schema = defineSchema(
  {
    // default auth tables using convex auth.
    ...authTables, // do not remove or modify

    // the users table is the default users table that is brought in by the authTables
    users: defineTable({
      name: v.optional(v.string()), // name of the user. do not remove
      image: v.optional(v.string()), // image of the user. do not remove
      email: v.optional(v.string()), // email of the user. do not remove
      emailVerificationTime: v.optional(v.number()), // email verification time. do not remove
      isAnonymous: v.optional(v.boolean()), // is the user anonymous. do not remove

      role: v.optional(roleValidator), // role of the user. do not remove
      phone: v.optional(v.string()),
      address: v.optional(v.string()),
    }).index("email", ["email"]), // index for the email. do not remove or modify

    categories: defineTable({
      name: v.string(),
      slug: v.string(),
      icon: v.string(),
      description: v.string(),
      serviceCount: v.number(),
    }).index("by_slug", ["slug"]),

    services: defineTable({
      name: v.string(),
      slug: v.string(),
      categoryId: v.id("categories"),
      categoryName: v.string(),
      categorySlug: v.string(),
      description: v.string(),
      price: v.number(),
      duration: v.number(),
      rating: v.number(),
      reviewCount: v.number(),
      image: v.string(),
      featured: v.boolean(),
      tags: v.array(v.string()),
    })
      .index("by_slug", ["slug"])
      .index("by_category", ["categoryId"])
      .index("by_featured", ["featured"]),

    professionals: defineTable({
      userId: v.id("users"),
      name: v.string(),
      avatar: v.string(),
      rating: v.number(),
      reviewCount: v.number(),
      completedJobs: v.number(),
      specialties: v.array(v.string()),
      bio: v.optional(v.string()),
      approved: v.optional(v.boolean()),
      experienceYears: v.optional(v.number()),
    }).index("by_user", ["userId"]),

    addresses: defineTable({
      userId: v.id("users"),
      label: v.string(),
      address: v.string(),
      city: v.string(),
      state: v.string(),
      pincode: v.string(),
      isDefault: v.boolean(),
    }).index("by_user", ["userId"]),

    bookings: defineTable({
      userId: v.id("users"),
      serviceId: v.id("services"),
      professionalId: v.optional(v.id("professionals")),
      date: v.string(),
      time: v.string(),
      status: orderStatusValidator,
      totalAmount: v.number(),
      address: v.string(),
      notes: v.optional(v.string()),
      createdAt: v.string(),
      paymentOrderId: v.optional(v.string()),
      paymentId: v.optional(v.string()),
      paymentStatus: v.optional(
        v.union(v.literal("paid"), v.literal("unpaid")),
      ),
    })
      .index("by_user", ["userId"])
      .index("by_professional", ["professionalId"])
      .index("by_status", ["status"]),

    chatMessages: defineTable({
      userId: v.id("users"),
      role: v.union(v.literal("user"), v.literal("assistant")),
      content: v.string(),
      createdAt: v.string(),
    }).index("by_user", ["userId"]),
  },
  {
    schemaValidation: false,
  },
);

export default schema;
