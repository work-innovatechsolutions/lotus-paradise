import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp } from "firebase/firestore";

export async function GET() {
  try {
    const q = query(collection(db, "enquiries"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    const enquiries = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json(enquiries);
  } catch (error) {
    console.warn("Firestore enquiries fetch fallback:", error);
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const docRef = await addDoc(collection(db, "enquiries"), {
      name: body.name,
      email: body.email,
      phone: body.phone,
      subject: body.subject || "General Inquiry",
      message: body.message,
      createdAt: serverTimestamp(),
    });
    return NextResponse.json({ id: docRef.id, message: "Enquiry submitted successfully" }, { status: 201 });
  } catch (error) {
    console.warn("Firestore enquiry save fallback:", error);
    return NextResponse.json({ message: "Enquiry received" }, { status: 200 });
  }
}
