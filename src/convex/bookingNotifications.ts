"use node";

import nodemailer from "nodemailer";
import { v } from "convex/values";
import { internalAction } from "./_generated/server";

const STATUS_CONTENT: Record<string, { subject: string; heading: string; body: string }> = {
  confirmed: {
    subject: "Your Dukaan Konnect booking is confirmed",
    heading: "Booking Confirmed",
    body: "Good news — your professional has accepted your booking and will arrive at the scheduled time.",
  },
  in_progress: {
    subject: "Your Dukaan Konnect service has started",
    heading: "Service In Progress",
    body: "Your professional has started work on your service.",
  },
  completed: {
    subject: "Your Dukaan Konnect service is complete",
    heading: "Service Completed",
    body: "Your service has been marked complete. Thank you for using Dukaan Konnect!",
  },
  cancelled: {
    subject: "Your Dukaan Konnect booking was cancelled",
    heading: "Booking Cancelled",
    body: "Your booking has been cancelled. If this wasn't expected, please contact support.",
  },
};

export const sendStatusEmail = internalAction({
  args: {
    email: v.string(),
    serviceName: v.string(),
    date: v.string(),
    time: v.string(),
    status: v.string(),
  },
  handler: async (_ctx, args): Promise<void> => {
    const info = STATUS_CONTENT[args.status];
    if (!info) return;

    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT ?? 587);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASSWORD;
    if (!host || !user || !pass) {
      console.error("Skipping booking status email: SMTP is not configured");
      return;
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });

    await transporter.sendMail({
      from: process.env.SMTP_FROM || `Dukaan Konnect <${user}>`,
      to: args.email,
      subject: info.subject,
      text: `${info.heading}\n\n${info.body}\n\nService: ${args.serviceName}\nScheduled: ${args.date} at ${args.time}\n\nView full details on your Orders page.`,
      html: `
        <div style="font-family: -apple-system, Helvetica, Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
          <h2 style="color: #3949ab; margin-bottom: 4px;">Dukaan Konnect</h2>
          <p style="font-size: 18px; font-weight: 600; color: #111; margin-bottom: 4px;">${info.heading}</p>
          <p style="color: #444;">${info.body}</p>
          <div style="background: #f5f6fa; border-radius: 8px; padding: 16px; margin: 16px 0;">
            <p style="margin: 0 0 4px; color: #444;"><strong>Service:</strong> ${args.serviceName}</p>
            <p style="margin: 0; color: #444;"><strong>Scheduled:</strong> ${args.date} at ${args.time}</p>
          </div>
          <p style="color: #888; font-size: 13px;">View full details anytime on your Orders page.</p>
        </div>
      `,
    });
  },
});
