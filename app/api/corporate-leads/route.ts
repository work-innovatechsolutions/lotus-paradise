import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp } from "firebase/firestore";

export async function GET() {
  try {
    const q = query(collection(db, "corporate_leads"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    const leads = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json(leads);
  } catch (error) {
    console.warn("Firestore corporate leads fetch fallback:", error);
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const docRef = await addDoc(collection(db, "corporate_leads"), {
      company: body.company,
      contactPerson: body.contactPerson,
      email: body.email,
      phone: body.phone,
      employeesCount: Number(body.employeesCount || 10),
      preferredDates: body.preferredDates || "",
      budgetRange: body.budgetRange || "",
      requirements: body.requirements || "",
      createdAt: serverTimestamp(),
    });
    return NextResponse.json({ id: docRef.id, message: "Corporate lead created successfully" }, { status: 201 });
  } catch (error) {
    console.warn("Firestore corporate lead save fallback:", error);
    return NextResponse.json({ message: "Corporate lead received" }, { status: 200 });
  }
}
