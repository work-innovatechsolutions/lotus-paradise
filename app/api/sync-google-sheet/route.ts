import { NextResponse } from "next/server";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

function getDb() {
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

// In-memory idempotency cache to prevent duplicate sheet row appends within 30 seconds
const recentSyncCache = new Map<string, number>();

function isDuplicateSync(key: string): boolean {
  const now = Date.now();
  const lastSync = recentSyncCache.get(key);
  if (lastSync && now - lastSync < 30000) {
    return true;
  }
  recentSyncCache.set(key, now);
  if (recentSyncCache.size > 500) {
    for (const [k, ts] of recentSyncCache.entries()) {
      if (now - ts > 60000) recentSyncCache.delete(k);
    }
  }
  return false;
}

async function getSavedWebhookUrl(): Promise<string | null> {
  // 1. Primary: Firestore siteSettings/general (where admin panel saves updated URLs)
  try {
    const db = getDb();

    const primarySnap = await db.collection("siteSettings").doc("general").get();
    if (primarySnap.exists) {
      const data = primarySnap.data();
      if (data?.googleSheetWebhookUrl && data.googleSheetWebhookUrl.startsWith("https://script.google.com")) {
        return data.googleSheetWebhookUrl;
      }
    }

    // Legacy fallback: settings/general
    const legacySnap = await db.collection("settings").doc("general").get();
    if (legacySnap.exists) {
      const data = legacySnap.data();
      if (data?.googleSheetWebhookUrl && data.googleSheetWebhookUrl.startsWith("https://script.google.com")) {
        return data.googleSheetWebhookUrl;
      }
    }
  } catch (err) {
    console.warn("Error fetching webhook URL from Firestore settings:", err);
  }

  // 2. Fallback to env variable
  const envUrl = process.env.NEXT_PUBLIC_GOOGLE_SHEET_WEBHOOK_URL || process.env.GOOGLE_SHEET_WEBHOOK_URL;
  if (envUrl && envUrl.startsWith("https://script.google.com")) {
    return envUrl;
  }

  return null;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const targetUrl = body.webhookUrl || (await getSavedWebhookUrl());

    if (!targetUrl || !targetUrl.startsWith("https://script.google.com")) {
      return NextResponse.json(
        {
          success: false,
          error: "Google Sheets Webhook URL is not configured. Please paste your Google Apps Script Web App URL in Admin Settings or .env.",
        },
        { status: 400 }
      );
    }

    let payload = body;
    if (!body.action) {
      if (body.lead || (body.company && !body.roomTitle)) {
        payload = { action: "add_corporate_lead", lead: body.lead || body };
      } else {
        payload = { action: "add_booking", booking: body.booking || body };
      }
    }

    // Idempotency check: prevent duplicate webhooks for the same booking ID within 30s
    const dedupeId =
      payload.booking?.bookingNumber ||
      payload.booking?.id ||
      payload.lead?.leadRef ||
      payload.lead?.id;

    if (dedupeId && (payload.action === "add_booking" || payload.action === "add_corporate_lead")) {
      const syncKey = `${payload.action}:${dedupeId}`;
      if (isDuplicateSync(syncKey)) {
        console.log(`ℹ️ [GoogleSheetSync] Prevented duplicate sheet sync for ${syncKey}`);
        return NextResponse.json({
          success: true,
          message: `Already synced (duplicate prevented for ${dedupeId})`,
          deduplicated: true,
        });
      }
    }

    // Server-side fetch to Google Apps Script - No CORS issues, automatically follows 302 redirects
    const response = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify(payload),
      redirect: "follow",
    });

    const responseText = await response.text();
    let responseData: any = {};
    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = { message: responseText };
    }

    return NextResponse.json({
      success: true,
      message: "Synced to Google Sheet successfully",
      data: responseData,
    });
  } catch (error: any) {
    console.error("Server Google Sheet sync failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to communicate with Google Sheets webhook",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  const url = await getSavedWebhookUrl();
  return NextResponse.json({
    configured: Boolean(url),
    url: url ? `${url.slice(0, 35)}...` : null,
  });
}
