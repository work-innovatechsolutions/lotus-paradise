import { NextResponse } from "next/server";
import { getSmtpConfig, createSmtpTransporter } from "@/lib/email-service";
import { db } from "@/lib/firebase";
import { doc, updateDoc, collection, getDocs, query, where } from "firebase/firestore";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, email, company, contactPerson, preferredDates, employeesCount } = body;

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "A valid client email is required." },
        { status: 400 }
      );
    }

    const config = await getSmtpConfig();
    if (!config) {
      return NextResponse.json(
        { success: false, error: "Gmail SMTP is not configured." },
        { status: 500 }
      );
    }

    const transporter = createSmtpTransporter(config);
    const fromAddress = `"${config.fromName || "The Cometas Corporate Retreats"}" <${config.user}>`;

    const proposalHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #F8F6F0; margin: 0; padding: 20px; }
    .card { max-width: 600px; margin: 0 auto; background: #FFFFFF; border-radius: 20px; border: 1px solid #C89D45; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.08); }
    .head { background: linear-gradient(135deg, #15103A, #2C2473); color: #FFF; padding: 30px; text-align: center; }
    .content { padding: 30px; color: #2D3748; line-height: 1.6; font-size: 14px; }
    .pill { display: inline-block; background: #C62828; color: #FFF; font-size: 11px; font-weight: bold; text-transform: uppercase; padding: 4px 12px; border-radius: 20px; margin-bottom: 8px; }
    .quote-box { background: #FAF7F0; border-left: 4px solid #C89D45; border-radius: 0 12px 12px 0; padding: 16px; margin: 20px 0; }
    .btn { display: inline-block; background: #25D366; color: #FFF !important; font-weight: bold; text-decoration: none; padding: 12px 24px; border-radius: 24px; margin-top: 15px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="head">
      <div class="pill">Exclusive B2B Proposal</div>
      <h2 style="margin: 0; font-family: Georgia, serif; font-size: 24px; color: #FFFFFF;">The Cometas Himalayan Offsite Proposal</h2>
      <p style="color: #E2E8F0; font-size: 12px; margin: 4px 0 0 0;">Prepared specifically for ${company || "Your Team"}</p>
    </div>
    <div class="content">
      <p>Dear <strong>${contactPerson || "Team"}</strong>,</p>
      <p>Following up on your retreat request, we are pleased to share our curated corporate package breakdown for your team offsite in <strong>Latpanchar (4,500 ft)</strong>.</p>
      
      <div class="quote-box">
        <strong>📋 Proposed Itinerary & Inclusions:</strong><br>
        • <strong>Dates:</strong> ${preferredDates || "Custom dates as discussed"}<br>
        • <strong>Team Size:</strong> ${employeesCount || 15} Members (Exclusive Homestay Booking)<br>
        • <strong>Accommodation:</strong> Luxury Pine-View Rooms with Balconies<br>
        • <strong>Dining:</strong> 4 Gourmet Organic Meals Daily (Farm-fresh Nepali & Bengali feasts + Barbecue Night)<br>
        • <strong>Facilities:</strong> Optical Fiber Internet, Projector, Ergonomic Lounge, Starlit Bonfire Setup<br>
        • <strong>Activities:</strong> Guided Nature Ridge Walk & Rufous-necked Hornbill Sanctuary Trail
      </div>

      <p>Our Corporate Concierge is at your disposal to customize meal preferences, arrange Bolero / Scorpio cab transfers from Bagdogra Airport (IXB) / NJP, or modify dates.</p>

      <div style="text-align: center; margin: 25px 0;">
        <a href="https://wa.me/918900087810?text=Hello%20The%20Cometas,%20we%20reviewed%20the%20proposal%20for%20${encodeURIComponent(company || '')}%20and%20would%20like%20to%20proceed." class="btn">
          💬 Confirm Proposal on WhatsApp
        </a>
      </div>

      <p style="font-size: 12px; color: #718096; border-top: 1px solid #E2E8F0; padding-top: 15px; margin-top: 25px;">
        Warm regards,<br>
        <strong>Sushanta &amp; The Cometas Team</strong><br>
        Latpanchar, Kurseong, Darjeeling · +91 98320 12345
      </p>
    </div>
  </div>
</body>
</html>
    `;

    await transporter.sendMail({
      from: fromAddress,
      to: email.trim(),
      replyTo: config.adminEmail || config.user,
      subject: `Exclusive Corporate Offsite Proposal for ${company || "Your Team"} - The Cometas Himalayan Retreat`,
      html: proposalHtml,
    });

    // Update Firestore status if id provided
    if (id && !id.startsWith("corp-1") && !id.startsWith("corp-2")) {
      try {
        await updateDoc(doc(db, "corporate_leads", id), { status: "PROPOSAL_SENT" });
      } catch {}
      try {
        await updateDoc(doc(db, "corporateLeads", id), { status: "PROPOSAL_SENT" });
      } catch {}
    }

    return NextResponse.json({
      success: true,
      message: `Proposal successfully sent to ${email}!`,
    });
  } catch (error: any) {
    console.error("Failed to send proposal email:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to send proposal" },
      { status: 500 }
    );
  }
}
