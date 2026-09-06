import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp, setDoc, doc } from "firebase/firestore";
import { sendCorporateInquiryEmails } from "@/lib/email-service";

export async function GET() {
  try {
    let q = query(collection(db, "corporate_leads"), orderBy("createdAt", "desc"));
    let snap = await getDocs(q);
    if (snap.empty) {
      q = query(collection(db, "corporateLeads"), orderBy("createdAt", "desc"));
      snap = await getDocs(q);
    }
    const leads = snap.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
    return NextResponse.json(leads);
  } catch (error) {
    console.warn("Firestore corporate leads fetch fallback:", error);
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.company || !body.contactPerson || !body.email || !body.phone) {
      return NextResponse.json(
        { success: false, error: "Company, contact person, email, and phone are required." },
        { status: 400 }
      );
    }

    const leadData = {
      company: body.company,
      contactPerson: body.contactPerson,
      email: body.email,
      phone: body.phone,
      employeesCount: Number(body.employeesCount || 10),
      preferredDates: body.preferredDates || "",
      startDate: body.startDate || "",
      endDate: body.endDate || "",
      nights: Number(body.nights || 0),
      budgetRange: body.budgetRange || "₹2L - ₹3L",
      requirements: body.requirements || "",
      status: "NEW",
      createdAt: serverTimestamp(),
      createdAtIso: new Date().toISOString(),
    };

    // 1. Save to primary corporate_leads collection
    const docRef = await addDoc(collection(db, "corporate_leads"), leadData);

    // Also mirror to corporateLeads for admin compatibility
    try {
      await setDoc(doc(db, "corporateLeads", docRef.id), {
        ...leadData,
        id: docRef.id,
      });
    } catch (mirrorErr) {
      console.warn("Mirroring corporate lead warning:", mirrorErr);
    }

    // 2. Dispatch Automated Confirmation & Host Alert Emails
    let emailResult = { success: false, guestSent: false, adminSent: false };
    try {
      emailResult = await sendCorporateInquiryEmails({
        id: docRef.id,
        company: body.company,
        contactPerson: body.contactPerson,
        email: body.email,
        phone: body.phone,
        employeesCount: body.employeesCount || 10,
        preferredDates: body.preferredDates || "",
        startDate: body.startDate,
        endDate: body.endDate,
        nights: body.nights,
        budgetRange: body.budgetRange,
        requirements: body.requirements,
      });
    } catch (emailErr: any) {
      console.error("Corporate email automation error:", emailErr?.message || emailErr);
    }

    // 3. Sync to Google Sheets (Corporate Leads tab)
    let sheetSynced = false;
    const webhookUrl = process.env.NEXT_PUBLIC_GOOGLE_SHEET_WEBHOOK_URL || process.env.GOOGLE_SHEET_WEBHOOK_URL;
    if (webhookUrl && webhookUrl.startsWith("https://script.google.com")) {
      try {
        await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify({
            action: "add_corporate_lead",
            lead: {
              id: docRef.id,
              company: body.company,
              contactPerson: body.contactPerson,
              email: body.email,
              phone: body.phone,
              employeesCount: body.employeesCount || 10,
              preferredDates: body.preferredDates || "",
              nights: body.nights || "",
              budgetRange: body.budgetRange || "₹2L - ₹3L",
              status: "NEW",
              requirements: body.requirements || "None",
              createdAt: new Date().toLocaleString("en-IN"),
            },
          }),
          redirect: "follow",
        });
        sheetSynced = true;
      } catch (sheetErr) {
        console.warn("Google Sheet corporate sync warning:", sheetErr);
      }
    }

    return NextResponse.json(
      {
        success: true,
        id: docRef.id,
        message: "Corporate lead created successfully",
        emailSent: emailResult.success,
        emailDetails: emailResult,
        sheetSynced,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Firestore corporate lead save fallback:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Corporate lead received with error" },
      { status: 500 }
    );
  }
}

