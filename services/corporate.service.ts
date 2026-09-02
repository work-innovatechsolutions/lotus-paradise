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

export interface CorporateLeadData {
  id: string;
  company: string;
  contactPerson: string;
  email: string;
  phone: string;
  employeesCount: number;
  preferredDates: string;
  budgetRange: string;
  requirements?: string;
  status: "NEW" | "PROPOSAL_SENT" | "CLOSED_WON";
  createdAt: string;
}

const CORP_STORAGE_KEY = "lp_corporate_leads_v1";

const DEFAULT_LEADS: CorporateLeadData[] = [
  {
    id: "corp-1",
    company: "TechNova Analytics",
    contactPerson: "Rahul Sengupta",
    email: "rahul@technova.io",
    phone: "+91 98765 43210",
    employeesCount: 16,
    preferredDates: "Oct 12 - Oct 15, 2026",
    budgetRange: "₹2.5L - ₹3L",
    requirements: "Strategy offsite, bonfire night, guided birding hike, audio-visual setup.",
    status: "NEW",
    createdAt: new Date().toISOString(),
  },
];

function getCachedLeads(): CorporateLeadData[] {
  if (typeof window === "undefined") return DEFAULT_LEADS;
  try {
    const raw = IdbStorage.safeLocalGet(CORP_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return DEFAULT_LEADS;
}

function updateCache(items: CorporateLeadData[]) {
  if (typeof window === "undefined") return;
  try {
    IdbStorage.safeLocalSet(CORP_STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event("lp_corporate_leads_updated"));
  } catch {}
}

export const CorporateService = {
  async getAllLeads(): Promise<CorporateLeadData[]> {
    const cached = getCachedLeads();

    try {
      const colRef = collection(db, "corporateLeads");
      const fetchPromise = getDocs(query(colRef, orderBy("createdAt", "desc")));
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Firestore timeout")), 2500)
      );

      const snapshot = (await Promise.race([fetchPromise, timeoutPromise])) as any;
      if (snapshot && !snapshot.empty) {
        const firestoreData = snapshot.docs.map((docSnap: any) => ({
          id: docSnap.id,
          ...docSnap.data(),
        })) as CorporateLeadData[];

        updateCache(firestoreData);
        return firestoreData;
      }
    } catch (err) {
      console.warn("Firestore corporateLeads fetch error:", err);
    }

    return cached;
  },

  async createLead(data: Omit<CorporateLeadData, "id" | "status" | "createdAt">): Promise<CorporateLeadData> {
    const created: CorporateLeadData = {
      ...data,
      id: `corp-${Date.now()}`,
      status: "NEW",
      createdAt: new Date().toISOString(),
    };

    const cached = getCachedLeads();
    const updated = [created, ...cached];
    updateCache(updated);

    (async () => {
      try {
        await setDoc(doc(db, "corporateLeads", created.id), created);
      } catch (err) {
        console.warn("Firestore createLead sync:", err);
      }
    })();

    await NotificationService.createNotification({
      title: `New B2B Corporate Offsite Inquiry from ${created.company}`,
      type: "CORPORATE_LEAD",
      read: false,
      detailsUrl: "/admin/corporate-leads",
    });

    return created;
  },

  async updateLeadStatus(id: string, status: "NEW" | "PROPOSAL_SENT" | "CLOSED_WON"): Promise<CorporateLeadData> {
    const cached = getCachedLeads();
    const target = cached.find((l) => l.id === id);
    if (!target) throw new Error("Lead not found");

    target.status = status;
    const nextList = cached.map((l) => (l.id === id ? { ...l, status } : l));
    updateCache(nextList);

    (async () => {
      try {
        await setDoc(doc(db, "corporateLeads", id), { status }, { merge: true });
      } catch (err) {
        console.warn("Firestore updateLeadStatus sync:", err);
      }
    })();

    return target;
  },
};
