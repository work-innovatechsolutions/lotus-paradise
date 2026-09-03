import { NextResponse } from "next/server";
import { testSmtp, type SmtpConfig } from "@/lib/email-service";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const config: SmtpConfig = {
      user: body.user,
      pass: body.pass,
      adminEmail: body.adminEmail || body.user,
      fromName: body.fromName || "The Cometas Himalayan Retreat",
      host: body.host || "smtp.gmail.com",
      port: Number(body.port || 465),
      secure: body.secure !== false,
    };

    if (!config.user || !config.pass) {
      return NextResponse.json(
        { success: false, message: "Gmail User and App Password are required" },
        { status: 400 }
      );
    }

    // Optional: save to Firestore if saveToDb is requested
    if (body.saveToDb) {
      try {
        const db = getAdminDb();
        await db.collection("siteSettings").doc("smtp").set(
          {
            user: config.user,
            pass: config.pass,
            adminEmail: config.adminEmail,
            fromName: config.fromName,
            host: config.host,
            port: config.port,
            secure: config.secure,
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        );
      } catch (err) {
        console.warn("Could not persist SMTP settings to Firestore:", err);
      }
    }

    const result = await testSmtp(config, body.testRecipient);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to test SMTP" },
      { status: 500 }
    );
  }
}
