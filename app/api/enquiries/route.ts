import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const enquiries = await prisma.enquiry.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(enquiries);
  } catch {
    return NextResponse.json({ error: "Failed to fetch enquiries" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newEnquiry = await prisma.enquiry.create({
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone,
        subject: body.subject || "General Inquiry",
        message: body.message,
      },
    });
    return NextResponse.json(newEnquiry, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Enquiry received" }, { status: 200 });
  }
}
