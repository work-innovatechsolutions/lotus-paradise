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

async function getSavedWebhookUrl(): Promise<string | null> {
  // 1. Env variable
  const envUrl = process.env.NEXT_PUBLIC_GOOGLE_SHEET_WEBHOOK_URL || process.env.GOOGLE_SHEET_WEBHOOK_URL;
  if (envUrl && envUrl.startsWith("https://script.google.com")) {
    return envUrl;
  }

  // 2. Firestore settings
  try {
    const db = getDb();
    const docSnap = await db.collection("settings").doc("general").get();
    if (docSnap.exists) {
      const data = docSnap.data();
      if (data?.googleSheetWebhookUrl && data.googleSheetWebhookUrl.startsWith("https://script.google.com")) {
        return data.googleSheetWebhookUrl;
      }
    }
  } catch (err) {
    console.warn("Error fetching webhook URL from Firestore settings:", err);
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

    const payload = body.action ? body : { action: "add_booking", booking: body.booking || body };

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
