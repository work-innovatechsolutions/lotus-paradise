import { HERO_SLIDES } from "@/lib/data";
import type { HeroSlide } from "@/types/hero";
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

const HERO_SLIDES_STORAGE_KEY = "lp_hero_slides_v2";

const DEFAULT_SLIDES: HeroSlide[] = HERO_SLIDES.map((s, idx) => ({
  id: s.id,
  title: s.title,
  subtitle: s.subtitle,
  location: s.location,
  badge: s.badge,
  desktopImage: s.image,
  mobileImage: s.image,
  video: "",
  overlayOpacity: 0.5,
  textAlignment: "left",
  buttonText: "Book Your Stay",
  buttonLink: "/booking",
  active: true,
  displayOrder: idx + 1,
}));

function getCachedSlidesSync(): HeroSlide[] {
  if (typeof window === "undefined") return DEFAULT_SLIDES;
  try {
    const raw = IdbStorage.safeLocalGet(HERO_SLIDES_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((s) => ({
          ...s,
          overlayOpacity: typeof s.overlayOpacity === "number" ? s.overlayOpacity : 0.5,
        }));
      }
    }
  } catch {}
  return DEFAULT_SLIDES;
}

async function getStoredSlides(): Promise<HeroSlide[]> {
  if (typeof window === "undefined") return DEFAULT_SLIDES;
  try {
    const idbData = await IdbStorage.get<HeroSlide[]>(HERO_SLIDES_STORAGE_KEY);
    if (Array.isArray(idbData) && idbData.length > 0) {
      return idbData.map((s) => ({
        ...s,
        overlayOpacity: typeof s.overlayOpacity === "number" ? s.overlayOpacity : 0.5,
      }));
    }
  } catch {}
  return getCachedSlidesSync();
}

async function updateCache(slides: HeroSlide[]) {
  if (typeof window === "undefined") return;
  try {
    await IdbStorage.set(HERO_SLIDES_STORAGE_KEY, slides);
    IdbStorage.safeLocalSet(HERO_SLIDES_STORAGE_KEY, JSON.stringify(slides));
    window.dispatchEvent(new Event("lp_hero_slides_updated"));
  } catch (err) {
    console.warn("Cache update error:", err);
  }
}

function sanitizeSlideForFirestore(slide: HeroSlide): Record<string, any> {
  return {
    id: slide.id || `slide-${Date.now()}`,
    title: slide.title || "",
    subtitle: slide.subtitle || "",
    location: slide.location || "Latpanchar, Kurseong",
    badge: slide.badge || "Latpanchar Retreat",
    desktopImage: slide.desktopImage || "/images/hero/bengal-latpanchar.jpg.jpeg",
    mobileImage: slide.mobileImage || slide.desktopImage || "/images/hero/bengal-latpanchar.jpg.jpeg",
    video: slide.video || "",
    overlayOpacity: typeof slide.overlayOpacity === "number" ? slide.overlayOpacity : 0.5,
    textAlignment: slide.textAlignment || "left",
    buttonText: slide.buttonText || "Book Your Stay",
    buttonLink: slide.buttonLink || "/booking",
    active: slide.active !== false,
    displayOrder: typeof slide.displayOrder === "number" ? slide.displayOrder : 1,
    updatedAt: new Date().toISOString(),
  };
}

export const HeroService = {
  async getAllSlides(): Promise<HeroSlide[]> {
    const localSlides = await getStoredSlides();

    try {
      const colRef = collection(db, "heroSlides");
      const fetchPromise = getDocs(query(colRef, orderBy("displayOrder", "asc")));
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Firestore timeout")), 4000)
      );

      const snapshot = (await Promise.race([fetchPromise, timeoutPromise])) as any;

      if (snapshot && !snapshot.empty) {
        const firestoreSlides: HeroSlide[] = snapshot.docs.map((docSnap: any) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            title: data.title || "",
            subtitle: data.subtitle || "",
            location: data.location || "",
            badge: data.badge || "",
            desktopImage: data.desktopImage || data.image || "",
            mobileImage: data.mobileImage || data.desktopImage || data.image || "",
            video: data.video || "",
            overlayOpacity: typeof data.overlayOpacity === "number" ? data.overlayOpacity : 0.5,
            textAlignment: (data.textAlignment as "left" | "center" | "right") || "left",
            buttonText: data.buttonText || "Book Your Stay",
            buttonLink: data.buttonLink || "/booking",
            active: data.active !== false,
            displayOrder: typeof data.displayOrder === "number" ? data.displayOrder : 1,
          };
        });

        // Merge to preserve any pending offline/local slides
        const firestoreIds = new Set(firestoreSlides.map((s) => s.id));
        const localOnlySlides = localSlides.filter((s) => !firestoreIds.has(s.id));
        const mergedSlides = [...firestoreSlides, ...localOnlySlides].sort(
          (a, b) => (a.displayOrder || 1) - (b.displayOrder || 1)
        );

        await updateCache(mergedSlides);
        return mergedSlides;
      } else if (snapshot && snapshot.empty) {
        // Auto-seed Firestore with DEFAULT_SLIDES
        for (const s of DEFAULT_SLIDES) {
          const payload = sanitizeSlideForFirestore(s);
          await setDoc(doc(db, "heroSlides", s.id), payload);
        }
        await updateCache(DEFAULT_SLIDES);
        return DEFAULT_SLIDES;
      }
    } catch (err) {
      console.warn("Firestore heroSlides fetch fallback:", err);
    }

    return localSlides;
  },

  async getActiveSlides(): Promise<HeroSlide[]> {
    const slides = await this.getAllSlides();
    return slides
      .filter((s) => s.active)
      .sort((a, b) => (a.displayOrder || 1) - (b.displayOrder || 1));
  },

  async updateSlide(id: string, updated: Partial<HeroSlide>): Promise<HeroSlide> {
    const currentList = await getStoredSlides();
    const target = currentList.find((s) => s.id === id) || ({} as HeroSlide);
    const updatedSlide: HeroSlide = {
      ...target,
      ...updated,
      id,
      title: updated.title ?? target.title ?? "",
      subtitle: updated.subtitle ?? target.subtitle ?? "",
      location: updated.location ?? target.location ?? "",
      badge: updated.badge ?? target.badge ?? "",
      desktopImage: updated.desktopImage ?? target.desktopImage ?? "",
      mobileImage: updated.mobileImage ?? updated.desktopImage ?? target.mobileImage ?? target.desktopImage ?? "",
      video: updated.video ?? target.video ?? "",
      overlayOpacity:
        typeof updated.overlayOpacity === "number"
          ? updated.overlayOpacity
          : typeof target.overlayOpacity === "number"
          ? target.overlayOpacity
          : 0.5,
      textAlignment: updated.textAlignment ?? target.textAlignment ?? "left",
      buttonText: updated.buttonText ?? target.buttonText ?? "Book Your Stay",
      buttonLink: updated.buttonLink ?? target.buttonLink ?? "/booking",
      active: updated.active !== undefined ? updated.active : target.active !== false,
      displayOrder: typeof updated.displayOrder === "number" ? updated.displayOrder : target.displayOrder ?? 1,
    };

    const nextSlides = currentList.some((s) => s.id === id)
      ? currentList.map((s) => (s.id === id ? updatedSlide : s))
      : [...currentList, updatedSlide];
    await updateCache(nextSlides);

    // Direct Firestore update
    try {
      const payload = sanitizeSlideForFirestore(updatedSlide);
      await setDoc(doc(db, "heroSlides", id), payload, { merge: true });
    } catch (err) {
      console.warn("Firestore updateSlide sync:", err);
    }

    return updatedSlide;
  },

  async createSlide(slide: Omit<HeroSlide, "id"> & { id?: string }): Promise<HeroSlide> {
    const newId = slide.id && slide.id.startsWith("slide-") ? slide.id : `slide-${Date.now()}`;
    const newSlide: HeroSlide = {
      id: newId,
      title: slide.title || "New Himalayan Horizon",
      subtitle: slide.subtitle || "",
      location: slide.location || "Latpanchar, Kurseong",
      badge: slide.badge || "Latpanchar Retreat",
      desktopImage: slide.desktopImage || "/images/hero/bengal-latpanchar.jpg.jpeg",
      mobileImage: slide.mobileImage || slide.desktopImage || "/images/hero/bengal-latpanchar.jpg.jpeg",
      video: slide.video || "",
      overlayOpacity: typeof slide.overlayOpacity === "number" ? slide.overlayOpacity : 0.5,
      textAlignment: slide.textAlignment || "left",
      buttonText: slide.buttonText || "Book Your Stay",
      buttonLink: slide.buttonLink || "/booking",
      active: slide.active !== false,
      displayOrder: typeof slide.displayOrder === "number" ? slide.displayOrder : 1,
    };

    const currentList = await getStoredSlides();
    const exists = currentList.some((s) => s.id === newId);
    const nextSlides = exists
      ? currentList.map((s) => (s.id === newId ? newSlide : s))
      : [...currentList, newSlide];
    await updateCache(nextSlides);

    // Direct Firestore create
    try {
      const payload = sanitizeSlideForFirestore(newSlide);
      await setDoc(doc(db, "heroSlides", newId), payload);
    } catch (err) {
      console.warn("Firestore createSlide sync:", err);
    }

    return newSlide;
  },

  async deleteSlide(id: string): Promise<void> {
    const currentList = await getStoredSlides();
    const filtered = currentList.filter((s) => s.id !== id);
    await updateCache(filtered);

    // Direct Firestore delete
    try {
      await deleteDoc(doc(db, "heroSlides", id));
    } catch (err) {
      console.warn("Firestore deleteSlide sync:", err);
    }
  },
};
