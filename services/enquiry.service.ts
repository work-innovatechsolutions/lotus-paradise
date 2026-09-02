import { NotificationService } from "./notification.service";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { IdbStorage } from "@/lib/idb-storage";

export interface EnquiryData {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject?: string;
  message: string;
  status: "UNREAD" | "READ" | "REPLIED";
  assignedTo?: string;
  reply?: string;
  repliedAt?: string;
  createdAt: string;
}

const ENQUIRY_STORAGE_KEY = "lp_enquiries_v1";

const DEFAULT_ENQUIRIES: EnquiryData[] = [
  {
    id: "enq-1",
    name: "Siddharth Roy",
    email: "siddharth@example.com",
    phone: "+91 98301 99887",
    subject: "Latpanchar Hornbill Tour Package",
    message: "Hello, we are a group of 4 photographers visiting in October. Do you arrange local cab pickup from NJP station?",
    status: "UNREAD",
    createdAt: new Date().toISOString(),
  },
];

function getCachedEnquiries(): EnquiryData[] {
  if (typeof window === "undefined") return DEFAULT_ENQUIRIES;
  try {
    const raw = IdbStorage.safeLocalGet(ENQUIRY_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return DEFAULT_ENQUIRIES;
}

function updateCache(items: EnquiryData[]) {
  if (typeof window === "undefined") return;
  try {
    IdbStorage.safeLocalSet(ENQUIRY_STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event("lp_enquiries_updated"));
  } catch {}
}

export const EnquiryService = {
  async getAllEnquiries(): Promise<EnquiryData[]> {
    const cached = getCachedEnquiries();

    try {
      const colRef = collection(db, "enquiries");
      const fetchPromise = getDocs(query(colRef, orderBy("createdAt", "desc")));
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Firestore timeout")), 2500)
      );

      const snapshot = (await Promise.race([fetchPromise, timeoutPromise])) as any;
      if (snapshot && !snapshot.empty) {
        const firestoreData = snapshot.docs.map((docSnap: any) => ({
          id: docSnap.id,
          ...docSnap.data(),
        })) as EnquiryData[];

        updateCache(firestoreData);
        return firestoreData;
      }
    } catch (err) {
      console.warn("Firestore enquiries fetch error:", err);
    }

    return cached;
  },

  async createEnquiry(data: Omit<EnquiryData, "id" | "status" | "createdAt">): Promise<EnquiryData> {
    const newEnq: EnquiryData = {
      ...data,
      id: `enq-${Date.now()}`,
      status: "UNREAD",
      createdAt: new Date().toISOString(),
    };

    const cached = getCachedEnquiries();
    const updated = [newEnq, ...cached];
    updateCache(updated);

    (async () => {
      try {
        await setDoc(doc(db, "enquiries", newEnq.id), newEnq);
      } catch (err) {
        console.warn("Firestore createEnquiry sync:", err);
      }
    })();

    await NotificationService.createNotification({
      title: `New Guest Enquiry from ${newEnq.name}`,
      type: "ENQUIRY",
      read: false,
      detailsUrl: "/admin/enquiries",
    });

    return newEnq;
  },

  async markAsRead(id: string): Promise<void> {
    const cached = getCachedEnquiries();
    const updated = cached.map((e) => (e.id === id ? { ...e, status: "READ" as const } : e));
    updateCache(updated);

    (async () => {
      try {
        await setDoc(doc(db, "enquiries", id), { status: "READ" }, { merge: true });
      } catch (err) {
        console.warn("Firestore markAsRead sync:", err);
      }
    })();
  },

  async replyToEnquiry(id: string, replyMessage: string, assignedTo = "Manager"): Promise<EnquiryData> {
    const cached = getCachedEnquiries();
    const target = cached.find((e) => e.id === id);
    if (!target) throw new Error("Enquiry not found");

    const updated: EnquiryData = {
      ...target,
      status: "REPLIED",
      reply: replyMessage,
      assignedTo,
      repliedAt: new Date().toISOString(),
    };

    const nextList = cached.map((e) => (e.id === id ? updated : e));
    updateCache(nextList);

    (async () => {
      try {
        await setDoc(doc(db, "enquiries", id), updated, { merge: true });
      } catch (err) {
        console.warn("Firestore replyToEnquiry sync:", err);
      }
    })();

    return updated;
  },

  async deleteEnquiry(id: string): Promise<void> {
    const cached = getCachedEnquiries();
    const updated = cached.filter((e) => e.id !== id);
    updateCache(updated);

    (async () => {
      try {
        await deleteDoc(doc(db, "enquiries", id));
      } catch (err) {
        console.warn("Firestore deleteEnquiry sync:", err);
      }
    })();
  },
};
