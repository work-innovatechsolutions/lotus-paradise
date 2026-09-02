import { EXPERIENCES } from "@/lib/data";
import type { ExperienceData } from "@/lib/data";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { IdbStorage } from "@/lib/idb-storage";

const EXPERIENCES_STORAGE_KEY = "lp_experiences_v1";

const DEFAULT_EXPERIENCES: ExperienceData[] = [...EXPERIENCES];

function getCachedExperiences(): ExperienceData[] {
  if (typeof window === "undefined") return DEFAULT_EXPERIENCES;
  try {
    const raw = IdbStorage.safeLocalGet(EXPERIENCES_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return DEFAULT_EXPERIENCES;
}

function updateCache(items: ExperienceData[]) {
  if (typeof window === "undefined") return;
  try {
    IdbStorage.safeLocalSet(EXPERIENCES_STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event("lp_experiences_updated"));
  } catch {}
}

export const ExperienceService = {
  async getAllExperiences(): Promise<ExperienceData[]> {
    const cached = getCachedExperiences();

    try {
      const colRef = collection(db, "experiences");
      const fetchPromise = getDocs(colRef);
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Firestore timeout")), 2500)
      );

      const snapshot = (await Promise.race([fetchPromise, timeoutPromise])) as any;
      if (snapshot && !snapshot.empty) {
        const firestoreData = snapshot.docs.map((docSnap: any) => ({
          id: docSnap.id,
          ...docSnap.data(),
        })) as ExperienceData[];

        updateCache(firestoreData);
        return firestoreData;
      }
    } catch (err) {
      console.warn("Firestore experiences fetch error:", err);
    }

    return cached;
  },

  async getFeaturedExperiences(): Promise<ExperienceData[]> {
    const all = await this.getAllExperiences();
    return all.filter((e) => e.featured !== false);
  },

  async toggleFeatured(id: string): Promise<ExperienceData> {
    const cached = getCachedExperiences();
    const target = cached.find((e) => e.id === id);
    if (!target) throw new Error("Experience not found");

    const updated = { ...target, featured: !target.featured };
    const nextList = cached.map((e) => (e.id === id ? updated : e));
    updateCache(nextList);

    (async () => {
      try {
        await setDoc(doc(db, "experiences", id), { featured: updated.featured }, { merge: true });
      } catch (err) {
        console.warn("Firestore toggleFeatured sync:", err);
      }
    })();

    return updated;
  },

  async updateExperience(id: string, data: Partial<ExperienceData>): Promise<ExperienceData> {
    const cached = getCachedExperiences();
    const target = cached.find((e) => e.id === id);
    if (!target) throw new Error("Experience not found");

    const updated = { ...target, ...data };
    const nextList = cached.map((e) => (e.id === id ? updated : e));
    updateCache(nextList);

    (async () => {
      try {
        await setDoc(doc(db, "experiences", id), updated, { merge: true });
      } catch (err) {
        console.warn("Firestore updateExperience sync:", err);
      }
    })();

    return updated;
  },

  async createExperience(data: Omit<ExperienceData, "id">): Promise<ExperienceData> {
    const newId = `exp-${Date.now()}`;
    const newExp: ExperienceData = {
      ...data,
      id: newId,
      slug: data.slug || data.title.toLowerCase().replace(/\s+/g, "-"),
    };

    const cached = getCachedExperiences();
    const nextList = [...cached, newExp];
    updateCache(nextList);

    (async () => {
      try {
        await setDoc(doc(db, "experiences", newId), newExp);
      } catch (err) {
        console.warn("Firestore createExperience sync:", err);
      }
    })();

    return newExp;
  },

  async deleteExperience(id: string): Promise<void> {
    const cached = getCachedExperiences();
    const nextList = cached.filter((e) => e.id !== id);
    updateCache(nextList);

    (async () => {
      try {
        await deleteDoc(doc(db, "experiences", id));
      } catch (err) {
        console.warn("Firestore deleteExperience sync:", err);
      }
    })();
  },
};
