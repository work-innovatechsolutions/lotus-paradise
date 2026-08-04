import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const leads = await prisma.corporateLead.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(leads);
  } catch {
    return NextResponse.json({ error: "Failed to fetch corporate leads" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newLead = await prisma.corporateLead.create({
      data: {
        company: body.company,
        contactPerson: body.contactPerson,
        email: body.email,
        phone: body.phone,
        employeesCount: Number(body.employeesCount || 10),
        preferredDates: body.preferredDates || "",
        budgetRange: body.budgetRange || "",
        requirements: body.requirements || "",
      },
    });
    return NextResponse.json(newLead, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Corporate lead received" }, { status: 200 });
  }
}
