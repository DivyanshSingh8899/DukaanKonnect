import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { orderStatusValidator } from "./schema";
import { toService } from "./services";
import { toProfessional } from "./professionals";
import { requireAdmin } from "./adminAuth";

export const stats = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);

    const bookings = await ctx.db.query("bookings").collect();
    const professionals = await ctx.db.query("professionals").collect();
    const completed = bookings.filter((b) => b.status === "completed");
    const revenue = completed.reduce((sum, b) => sum + b.totalAmount, 0);

    return {
      totalBookings: bookings.length,
      pendingBookings: bookings.filter((b) => b.status === "pending").length,
      completedBookings: completed.length,
      totalProfessionals: professionals.length,
      approvedProfessionals: professionals.filter((p) => p.approved).length,
      pendingProfessionals: professionals.filter((p) => !p.approved).length,
      revenue,
    };
  },
});

export const listProfessionals = query({
  args: { approved: v.optional(v.boolean()) },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const docs = await ctx.db.query("professionals").collect();
    const filtered =
      args.approved === undefined
        ? docs
        : docs.filter((p) => (p.approved ?? false) === args.approved);

    return await Promise.all(
      filtered.map(async (p) => {
        const user = await ctx.db.get(p.userId);
        const idDocumentUrl = p.idDocumentStorageId
          ? await ctx.storage.getUrl(p.idDocumentStorageId)
          : null;
        return {
          ...toProfessional(ctx, p),
          email: user?.email ?? "",
          idDocumentType: p.idDocumentType ?? null,
          idDocumentUrl,
        };
      }),
    );
  },
});

export const setProfessionalApproval = mutation({
  args: { professionalId: v.id("professionals"), approved: v.boolean() },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.patch(args.professionalId, { approved: args.approved });
  },
});

export const assignProfessional = mutation({
  args: {
    bookingId: v.id("bookings"),
    professionalId: v.optional(v.id("professionals")),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const booking = await ctx.db.get(args.bookingId);
    if (!booking) throw new Error("Booking not found");

    if (args.professionalId) {
      const professional = await ctx.db.get(args.professionalId);
      if (!professional) throw new Error("Professional not found");
      if (!(professional.approved ?? false)) {
        throw new Error("Cannot assign an unapproved professional");
      }
    }

    await ctx.db.patch(args.bookingId, { professionalId: args.professionalId });
  },
});

export const listAllBookings = query({
  args: { status: v.optional(orderStatusValidator) },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const docs = await ctx.db.query("bookings").collect();
    const filtered = args.status
      ? docs.filter((b) => b.status === args.status)
      : docs;

    const resolved = (
      await Promise.all(
        filtered.map(async (b) => {
          const service = await ctx.db.get(b.serviceId);
          if (!service) return null;
          const customer = await ctx.db.get(b.userId);
          const professional = b.professionalId
            ? await ctx.db.get(b.professionalId)
            : null;
          return {
            id: b._id,
            service: toService(service),
            professional: professional ? toProfessional(ctx, professional) : null,
            customerName: customer?.name ?? "Unknown",
            customerEmail: customer?.email ?? "",
            date: b.date,
            time: b.time,
            status: b.status,
            totalAmount: b.totalAmount,
            address: b.address,
            createdAt: b.createdAt,
          };
        }),
      )
    ).filter((b): b is NonNullable<typeof b> => b !== null);

    return resolved.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },
});
