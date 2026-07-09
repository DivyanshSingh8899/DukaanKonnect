import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { orderStatusValidator } from "./schema";
import { toService } from "./services";
import { toProfessional } from "./professionals";

export const create = mutation({
  args: {
    serviceId: v.id("services"),
    professionalId: v.optional(v.id("professionals")),
    date: v.string(),
    time: v.string(),
    address: v.string(),
    notes: v.optional(v.string()),
    paymentOrderId: v.optional(v.string()),
    paymentId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Not authenticated");

    const service = await ctx.db.get(args.serviceId);
    if (!service) throw new Error("Service not found");

    return await ctx.db.insert("bookings", {
      userId,
      serviceId: args.serviceId,
      professionalId: args.professionalId,
      date: args.date,
      time: args.time,
      status: "pending",
      totalAmount: service.price,
      address: args.address,
      notes: args.notes,
      createdAt: new Date().toISOString(),
      paymentOrderId: args.paymentOrderId,
      paymentId: args.paymentId,
      paymentStatus: args.paymentId ? "paid" : "unpaid",
    });
  },
});

export const getBookedSlots = query({
  args: { categorySlug: v.string(), date: v.string() },
  handler: async (ctx, args) => {
    const professionals = await ctx.db.query("professionals").collect();
    const matching = professionals.filter((p) =>
      p.specialties.includes(args.categorySlug),
    );
    if (matching.length === 0) return [];

    const bookingsOnDate = await ctx.db
      .query("bookings")
      .filter((q) => q.eq(q.field("date"), args.date))
      .collect();

    const bookedProfessionalsByTime = new Map<string, Set<string>>();
    for (const b of bookingsOnDate) {
      if (!b.professionalId) continue;
      if (b.status !== "pending" && b.status !== "confirmed" && b.status !== "in_progress") continue;
      if (!matching.some((m) => m._id === b.professionalId)) continue;
      if (!bookedProfessionalsByTime.has(b.time)) {
        bookedProfessionalsByTime.set(b.time, new Set());
      }
      bookedProfessionalsByTime.get(b.time)!.add(b.professionalId);
    }

    const fullyBooked: string[] = [];
    for (const [time, profIds] of bookedProfessionalsByTime.entries()) {
      if (profIds.size >= matching.length) fullyBooked.push(time);
    }
    return fullyBooked;
  },
});

export const listMine = query({
  args: { status: v.optional(orderStatusValidator) },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return [];

    const docs = await ctx.db
      .query("bookings")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    const filtered = args.status
      ? docs.filter((b) => b.status === args.status)
      : docs;

    const resolved = (
      await Promise.all(
        filtered.map(async (b) => {
          const service = await ctx.db.get(b.serviceId);
          if (!service) return null;
          const professional = b.professionalId
            ? await ctx.db.get(b.professionalId)
            : null;
          return {
            id: b._id,
            service: toService(service),
            professional: professional ? toProfessional(professional) : null,
            date: b.date,
            time: b.time,
            status: b.status,
            totalAmount: b.totalAmount,
            address: b.address,
            notes: b.notes,
            createdAt: b.createdAt,
          };
        }),
      )
    ).filter((b): b is NonNullable<typeof b> => b !== null);

    return resolved.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },
});

export const listForProfessional = query({
  args: { status: v.optional(orderStatusValidator) },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return [];

    const myProfessional = await ctx.db
      .query("professionals")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();
    if (!myProfessional) return [];

    const assigned = await ctx.db
      .query("bookings")
      .withIndex("by_professional", (q) =>
        q.eq("professionalId", myProfessional._id),
      )
      .collect();

    const candidates = assigned;

    if ((myProfessional.approved ?? false) && (!args.status || args.status === "pending")) {
      const pending = await ctx.db
        .query("bookings")
        .withIndex("by_status", (q) => q.eq("status", "pending"))
        .collect();
      for (const b of pending) {
        if (b.professionalId) continue;
        const service = await ctx.db.get(b.serviceId);
        if (service && myProfessional.specialties.includes(service.categorySlug)) {
          candidates.push(b);
        }
      }
    }

    const filtered = args.status
      ? candidates.filter((b) => b.status === args.status)
      : candidates;

    const resolved = (
      await Promise.all(
        filtered.map(async (b) => {
          const service = await ctx.db.get(b.serviceId);
          if (!service) return null;
          const customer = await ctx.db.get(b.userId);
          return {
            id: b._id,
            service: toService(service),
            customerName: customer?.name ?? "Customer",
            customerPhone: customer?.phone ?? "",
            date: b.date,
            time: b.time,
            status: b.status,
            totalAmount: b.totalAmount,
            address: b.address,
            notes: b.notes,
            createdAt: b.createdAt,
            isAssignedToMe: b.professionalId === myProfessional._id,
          };
        }),
      )
    ).filter((b): b is NonNullable<typeof b> => b !== null);

    return resolved.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },
});

export const updateStatus = mutation({
  args: {
    bookingId: v.id("bookings"),
    status: orderStatusValidator,
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Not authenticated");

    const booking = await ctx.db.get(args.bookingId);
    if (!booking) throw new Error("Booking not found");

    // Customer cancelling their own booking.
    if (booking.userId === userId) {
      if (
        args.status === "cancelled" &&
        (booking.status === "pending" || booking.status === "confirmed")
      ) {
        await ctx.db.patch(args.bookingId, { status: "cancelled" });
        return;
      }
      throw new Error("Invalid status transition");
    }

    const myProfessional = await ctx.db
      .query("professionals")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();
    if (!myProfessional) throw new Error("Not authorized");

    const isMine = booking.professionalId === myProfessional._id;

    if (
      args.status === "confirmed" &&
      booking.status === "pending" &&
      (isMine || booking.professionalId === undefined)
    ) {
      if (!isMine && !(myProfessional.approved ?? false)) {
        throw new Error("Your professional account is pending approval");
      }
      const service = await ctx.db.get(booking.serviceId);
      if (
        !isMine &&
        !(service && myProfessional.specialties.includes(service.categorySlug))
      ) {
        throw new Error("Not authorized for this service category");
      }
      await ctx.db.patch(args.bookingId, {
        professionalId: myProfessional._id,
        status: "confirmed",
      });
      return;
    }

    if (!isMine) throw new Error("Not authorized");

    if (
      args.status === "cancelled" &&
      (booking.status === "pending" || booking.status === "confirmed")
    ) {
      await ctx.db.patch(args.bookingId, { status: "cancelled" });
      return;
    }

    if (args.status === "in_progress" && booking.status === "confirmed") {
      await ctx.db.patch(args.bookingId, { status: "in_progress" });
      return;
    }

    if (args.status === "completed" && booking.status === "in_progress") {
      await ctx.db.patch(args.bookingId, { status: "completed" });
      await ctx.db.patch(myProfessional._id, {
        completedJobs: myProfessional.completedJobs + 1,
      });
      return;
    }

    throw new Error("Invalid status transition");
  },
});
