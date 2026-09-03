import { NextResponse } from "next/server";
import { sendBookingEmails, getSmtpConfig } from "@/lib/email-service";
import type { Booking } from "@/types/booking";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const booking: Booking = body.booking || body;

    if (!booking || !booking.email) {
      return NextResponse.json(
        { success: false, error: "Valid booking object with guest email is required" },
        { status: 400 }
      );
    }

    const result = await sendBookingEmails(booking);

    return NextResponse.json({
      success: result.success,
      guestSent: result.guestSent,
      adminSent: result.adminSent,
      error: result.error,
      guestMessageId: result.guestMessageId,
      adminMessageId: result.adminMessageId,
    });
  } catch (error: any) {
    console.error("Booking email dispatch failed:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to send booking emails" },
      { status: 500 }
    );
  }
}

export async function GET() {
  const config = await getSmtpConfig();
  return NextResponse.json({
    configured: Boolean(config),
    smtpUser: config ? `${config.user.slice(0, 4)}***@${config.user.split("@")[1] || "gmail.com"}` : null,
    adminEmail: config ? config.adminEmail : null,
  });
}
