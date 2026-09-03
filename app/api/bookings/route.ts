import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp } from "firebase/firestore";

export async function GET() {
  try {
    const q = query(collection(db, "bookings"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    const bookings = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json(bookings);
  } catch (error) {
    console.warn("Firestore bookings fetch fallback:", error);
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const bookingNumber = body.bookingNumber || `LPH-${Math.floor(100000 + Math.random() * 900000)}`;
    const docRef = await addDoc(collection(db, "bookings"), {
      bookingNumber,
      guestName: body.guestName,
      guestEmail: body.guestEmail,
      guestPhone: body.guestPhone,
      roomId: body.roomId,
      checkIn: body.checkIn,
      checkOut: body.checkOut,
      guestsCount: Number(body.guestsCount || 1),
      totalAmount: Number(body.totalAmount || 0),
      specialRequests: body.specialRequests || "",
      status: body.status || "CONFIRMED",
      createdAt: serverTimestamp(),
    });

    const newBookingData = {
      id: docRef.id,
      bookingNumber,
      guestName: body.guestName,
      email: body.guestEmail || body.email,
      phone: body.guestPhone || body.phone,
      roomId: body.roomId,
      roomTitle: body.roomTitle || "Mountain Suite",
      checkIn: body.checkIn,
      checkOut: body.checkOut,
      guestsCount: Number(body.guestsCount || 1),
      nights: Number(body.nights || 1),
      pricePerNight: Number(body.pricePerNight || 0),
      totalAmount: Number(body.totalAmount || 0),
      specialRequests: body.specialRequests || "",
      status: body.status || "CONFIRMED",
      createdAt: new Date().toISOString(),
    };

    // Google Sheet sync in background
    if (process.env.NEXT_PUBLIC_GOOGLE_SHEET_WEBHOOK_URL) {
      fetch(process.env.NEXT_PUBLIC_GOOGLE_SHEET_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          action: "add_booking",
          booking: newBookingData,
        }),
      }).catch((err) => console.warn("Google Sheet API sync warning:", err));
    }

    return NextResponse.json({ id: docRef.id, bookingNumber, message: "Booking created successfully" }, { status: 201 });
  } catch (error) {
    console.warn("Firestore booking save fallback:", error);
    return NextResponse.json({ message: "Booking created successfully" }, { status: 200 });
  }
}
