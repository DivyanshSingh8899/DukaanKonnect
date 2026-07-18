"use node";

import nodemailer from "nodemailer";
import { v } from "convex/values";
import { internalAction } from "../_generated/server";

export const send = internalAction({
  args: { email: v.string(), token: v.string() },
  handler: async (_ctx, args): Promise<void> => {
    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT ?? 587);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASSWORD;

    if (!host || !user || !pass) {
      throw new Error(
        "Email sign-in is not configured. Set SMTP_HOST, SMTP_USER, and SMTP_PASSWORD.",
      );
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
      subject: `${args.token} is your Dukaan Konnect verification code`,
      text: `Welcome to Dukaan Konnect — trusted home services at your doorstep.\n\nYour verification code is ${args.token}. It expires in 15 minutes.\n\nNeed help? Reach us anytime at support.dukaankonnect@gmail.com.`,
      html: `
        <div style="font-family: -apple-system, Helvetica, Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
          <h2 style="color: #3949ab; margin-bottom: 4px;">Dukaan Konnect</h2>
          <p style="color: #444;">Welcome to Dukaan Konnect — trusted home services at your doorstep.</p>
          <p style="color: #444;">Your verification code is:</p>
          <p style="font-size: 32px; font-weight: bold; letter-spacing: 10px; color: #111;">${args.token}</p>
          <p style="color: #888; font-size: 13px;">This code expires in 15 minutes. If you didn't request this, you can safely ignore this email.</p>
          <p style="color: #888; font-size: 13px; margin-top: 16px;">Need help? Reach us anytime at <a href="mailto:support.dukaankonnect@gmail.com" style="color: #3949ab;">support.dukaankonnect@gmail.com</a>.</p>
        </div>
      `,
    });
  },
});
