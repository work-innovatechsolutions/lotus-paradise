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

async function getStoredExperiences(): Promise<ExperienceData[]> {
  if (typeof window === "undefined") return DEFAULT_EXPERIENCES;
  try {
    const idbData = await IdbStorage.get<ExperienceData[]>(EXPERIENCES_STORAGE_KEY);
    if (Array.isArray(idbData) && idbData.length > 0) return idbData;
    const raw = IdbStorage.safeLocalGet(EXPERIENCES_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return DEFAULT_EXPERIENCES;
}

async function updateCache(items: ExperienceData[], notify = false) {
  if (typeof window === "undefined") return;
  try {
    await IdbStorage.set(EXPERIENCES_STORAGE_KEY, items);
    IdbStorage.safeLocalSet(EXPERIENCES_STORAGE_KEY, JSON.stringify(items));
    if (notify) {
      window.dispatchEvent(new Event("lp_experiences_updated"));
    }
  } catch {}
}

export const ExperienceService = {
  async getAllExperiences(): Promise<ExperienceData[]> {
    const localData = await getStoredExperiences();

    try {
      const colRef = collection(db, "experiences");
      const fetchPromise = getDocs(colRef);
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Firestore timeout")), 4000)
      );

      const snapshot = (await Promise.race([fetchPromise, timeoutPromise])) as any;
      if (snapshot && !snapshot.empty) {
        const firestoreData: ExperienceData[] = snapshot.docs.map((docSnap: any) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));

        await updateCache(firestoreData, false);
        return firestoreData;
      } else if (snapshot && snapshot.empty) {
        for (const exp of DEFAULT_EXPERIENCES) {
          await setDoc(doc(db, "experiences", exp.id), exp);
        }
        await updateCache(DEFAULT_EXPERIENCES, false);
        return DEFAULT_EXPERIENCES;
      }
    } catch (err) {
      console.warn("Firestore experiences fetch fallback:", err);
    }

    return localData;
  },

  async getFeaturedExperiences(): Promise<ExperienceData[]> {
    const all = await this.getAllExperiences();
    return all.filter((e) => e.featured !== false);
  },

  async toggleFeatured(id: string): Promise<ExperienceData> {
    const currentList = await getStoredExperiences();
    const target = currentList.find((e) => e.id === id);
    if (!target) throw new Error("Experience not found");

    const updated = { ...target, featured: !target.featured };
    const nextList = currentList.map((e) => (e.id === id ? updated : e));
    await updateCache(nextList, true);

    try {
      await setDoc(doc(db, "experiences", id), { featured: updated.featured }, { merge: true });
    } catch (err) {
      console.warn("Firestore toggleFeatured sync:", err);
    }

    return updated;
  },

  async updateExperience(id: string, data: Partial<ExperienceData>): Promise<ExperienceData> {
    const currentList = await getStoredExperiences();
    const target = currentList.find((e) => e.id === id);
    if (!target) throw new Error("Experience not found");

    const updated = { ...target, ...data };
    const nextList = currentList.map((e) => (e.id === id ? updated : e));
    await updateCache(nextList, true);

    try {
      await setDoc(doc(db, "experiences", id), updated, { merge: true });
    } catch (err) {
      console.warn("Firestore updateExperience sync:", err);
    }

    return updated;
  },

  async createExperience(data: Omit<ExperienceData, "id">): Promise<ExperienceData> {
    const newId = `exp-${Date.now()}`;
    const newExp: ExperienceData = {
      ...data,
      id: newId,
      slug: data.slug || data.title.toLowerCase().replace(/\s+/g, "-"),
    };

    const currentList = await getStoredExperiences();
    const nextList = [...currentList, newExp];
    await updateCache(nextList, true);

    try {
      await setDoc(doc(db, "experiences", newId), newExp);
    } catch (err) {
      console.warn("Firestore createExperience sync:", err);
    }

    return newExp;
  },

  async deleteExperience(id: string): Promise<void> {
    const currentList = await getStoredExperiences();
    const nextList = currentList.filter((e) => e.id !== id);
    await updateCache(nextList, true);

    try {
      await deleteDoc(doc(db, "experiences", id));
    } catch (err) {
      console.warn("Firestore deleteExperience sync:", err);
    }
  },
};
