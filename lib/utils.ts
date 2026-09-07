import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string | Date): string {
  const date = typeof dateString === "string" ? new Date(dateString) : dateString;
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function generateBookingNumber(): string {
  const prefix = "LPH";
  const randomDigits = Math.floor(100000 + Math.random() * 900000);
  return `${prefix}-${randomDigits}`;
}

export function generateCorporateLeadNumber(): string {
  const prefix = "CORP";
  const randomDigits = Math.floor(100000 + Math.random() * 900000);
  return `${prefix}-${randomDigits}`;
}

export function normalizeCorporateLeadId(id?: string | null): string {
  if (!id) return generateCorporateLeadNumber();
  const s = String(id).trim();
  if (/^CORP-\d{6}$/i.test(s)) return s.toUpperCase();
  if (s.toLowerCase().startsWith("corp-")) {
    const rest = s.slice(5).replace(/[^a-zA-Z0-9]/g, "");
    return `CORP-${rest}`.toUpperCase();
  }
  // Deterministic 6-digit numeric reference for raw Firestore IDs (e.g. "yLxynfARoxUJx39NgjD8")
  let hash = 0;
  for (let i = 0; i < s.length; i++) {
    hash = ((hash << 5) - hash) + s.charCodeAt(i);
    hash |= 0;
  }
  const code = Math.abs(hash).toString().slice(0, 6).padStart(6, "7");
  return `CORP-${code}`;
}
