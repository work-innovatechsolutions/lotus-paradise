import nodemailer from "nodemailer";
import type { Booking } from "@/types/booking";
import { getGuestConfirmationEmailHtml, getAdminAlertEmailHtml } from "./email-templates";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

export interface SmtpConfig {
  user: string;
  pass: string;
  adminEmail: string;
  fromName?: string;
  host?: string;
  port?: number;
  secure?: boolean;
}

function getAdminDb() {
  if (!getApps().length) {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID || "lotus-paradise",
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
    });
  }
  return getFirestore();
}

/**
 * Resolves SMTP configuration from Firestore settings or environment variables
 */
export async function getSmtpConfig(): Promise<SmtpConfig | null> {
  // 1. Try Firestore siteSettings/smtp first
  try {
    const db = getAdminDb();
    const docSnap = await db.collection("siteSettings").doc("smtp").get();
    if (docSnap.exists) {
      const data = docSnap.data();
      if (data?.user && data?.pass) {
        return {
          user: data.user,
          pass: data.pass,
          adminEmail: data.adminEmail || process.env.ADMIN_EMAIL || data.user,
          fromName: data.fromName || process.env.SMTP_FROM_NAME || "The Cometas Himalayan Retreat",
          host: data.host || "smtp.gmail.com",
          port: Number(data.port || 465),
          secure: data.secure !== undefined ? Boolean(data.secure) : true,
        };
      }
    }
  } catch (err) {
    console.warn("Firestore SMTP config read warning:", err);
  }

  // 2. Fall back to environment variables
  const user = process.env.GMAIL_USER || process.env.SMTP_USER;
  const pass = process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASS;
  const adminEmail = process.env.ADMIN_EMAIL || user || "stay@lotusparadisehomestay.com";
  const fromName = process.env.SMTP_FROM_NAME || "The Cometas Himalayan Retreat";

  if (user && pass) {
    return {
      user,
      pass,
      adminEmail,
      fromName,
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT || 465),
      secure: process.env.SMTP_SECURE !== "false",
    };
  }

  return null;
}

/**
 * Creates Nodemailer Transporter
 */
export function createSmtpTransporter(config: SmtpConfig) {
  return nodemailer.createTransport({
    host: config.host || "smtp.gmail.com",
    port: config.port || 465,
    secure: config.secure !== false, // true for 465, false for other ports
    auth: {
      user: config.user,
      pass: config.pass.replace(/\s+/g, ""), // clean up any copied spaces in app password
    },
  });
}

/**
 * Sends both Guest confirmation and Admin notification emails for a booking
 */
export async function sendBookingEmails(booking: Booking, customConfig?: SmtpConfig): Promise<{
  success: boolean;
  guestSent: boolean;
  adminSent: boolean;
  error?: string;
  guestMessageId?: string;
  adminMessageId?: string;
}> {
  const config = customConfig || (await getSmtpConfig());

  if (!config) {
    console.warn("Gmail SMTP is not configured. Set GMAIL_USER and GMAIL_APP_PASSWORD in .env or Admin Settings.");
    return {
      success: false,
      guestSent: false,
      adminSent: false,
      error: "Gmail SMTP credentials not configured. Please add Gmail User and App Password in Admin Settings.",
    };
  }

  const transporter = createSmtpTransporter(config);
  const fromAddress = `"${config.fromName || "The Cometas Himalayan Retreat"}" <${config.user}>`;

  let guestSent = false;
  let adminSent = false;
  let guestMessageId: string | undefined;
  let adminMessageId: string | undefined;

  // 1. Send Guest Confirmation Email
  if (booking.email && booking.email.includes("@")) {
    try {
      const guestHtml = getGuestConfirmationEmailHtml(booking);
      const info = await transporter.sendMail({
        from: fromAddress,
        to: booking.email,
        subject: `Booking Confirmed: Your Himalayan Stay at The Cometas (${booking.bookingNumber})`,
        html: guestHtml,
      });
      guestSent = true;
      guestMessageId = info.messageId;
      console.log(`✅ Guest confirmation email sent to ${booking.email} (ID: ${info.messageId})`);
    } catch (err: any) {
      console.error(`❌ Failed to send guest email to ${booking.email}:`, err.message);
    }
  }

  // 2. Send Admin Notification Email
  const adminTarget = config.adminEmail || config.user;
  if (adminTarget && adminTarget.includes("@")) {
    try {
      const adminHtml = getAdminAlertEmailHtml(booking);
      const info = await transporter.sendMail({
        from: fromAddress,
        to: adminTarget,
        subject: `⚡ New Booking: ${booking.guestName} (${booking.bookingNumber}) - ₹${booking.totalAmount}`,
        html: adminHtml,
      });
      adminSent = true;
      adminMessageId = info.messageId;
      console.log(`✅ Admin notification email sent to ${adminTarget} (ID: ${info.messageId})`);
    } catch (err: any) {
      console.error(`❌ Failed to send admin email to ${adminTarget}:`, err.message);
    }
  }

  return {
    success: guestSent || adminSent,
    guestSent,
    adminSent,
    guestMessageId,
    adminMessageId,
  };
}

/**
 * Verifies SMTP connection and sends a test email
 */
export async function testSmtp(config: SmtpConfig, testRecipient?: string): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const transporter = createSmtpTransporter(config);
    await transporter.verify();

    const target = testRecipient || config.adminEmail || config.user;
    if (target) {
      await transporter.sendMail({
        from: `"${config.fromName || "The Cometas Retreat"}" <${config.user}>`,
        to: target,
        subject: "✓ Gmail SMTP Automation Verified - The Cometas Homestay",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 25px; border: 1px solid #C89D45; border-radius: 16px; background-color: #FAF8F5;">
            <h2 style="color: #2C2473; margin-top: 0;">✓ Gmail SMTP Connected!</h2>
            <p style="font-size: 14px; color: #4A5568; line-height: 1.6;">
              Your automated booking confirmation email service is successfully configured and active.
            </p>
            <div style="background-color: #E8F5E9; border-radius: 8px; padding: 12px; font-size: 12px; color: #2E7D32; font-weight: bold;">
              All future guest reservations will automatically send confirmation receipts to guests and alert emails to host.
            </div>
            <p style="font-size: 11px; color: #A0AEC0; margin-top: 20px;">
              Sent from The Cometas Homestay Booking Engine · Latpanchar
            </p>
          </div>
        `,
      });
    }

    return {
      success: true,
      message: `Connection successful! A test confirmation email has been dispatched to ${target}.`,
    };
  } catch (err: any) {
    return {
      success: false,
      message: `SMTP Connection failed: ${err.message}`,
    };
  }
}
