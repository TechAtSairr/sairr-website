import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { subject, text, html } = body;

    if (!subject || !text) {
      return NextResponse.json(
        { success: false, error: "Subject and text are required" },
        { status: 400 },
      );
    }

    const user = process.env.GMAIL_USER?.trim();
    const rawPass = process.env.GMAIL_APP_PASSWORD?.trim();
    const pass = rawPass?.replace(/[-\s]/g, "");
    const to =
      body.to ||
      process.env.LEAD_ALERT_EMAIL_TO?.trim() ||
      "marketing@sairr.in, tanmay@sairr.in";

    if (!user || !pass) {
      console.warn(
        "[send-email-alert] GMAIL_USER or GMAIL_APP_PASSWORD not configured. Skipping email.",
      );
      // Return 200 so missing env vars during local dev don't block user flow
      return NextResponse.json({
        success: true,
        skipped: true,
        message: "Email credentials not configured",
      });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
    });

    await transporter.sendMail({
      from: `"Sairr Website" <${user}>`,
      to,
      subject,
      text,
      html: html || undefined,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("send-email-alert error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to send email",
      },
      { status: 500 },
    );
  }
}

