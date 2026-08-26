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

function getCachedSlides(): HeroSlide[] {
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
  } catch (err) {
    console.warn("Cached slides error:", err);
  }
  return DEFAULT_SLIDES;
}

function updateCache(slides: HeroSlide[]) {
  if (typeof window === "undefined") return;
  try {
    IdbStorage.set(HERO_SLIDES_STORAGE_KEY, slides);
    IdbStorage.safeLocalSet(HERO_SLIDES_STORAGE_KEY, JSON.stringify(slides));
    window.dispatchEvent(new Event("lp_hero_slides_updated"));
  } catch (err) {
    console.warn("Cache update error:", err);
  }
}

export const HeroService = {
  async getAllSlides(): Promise<HeroSlide[]> {
    // 1. Return cached slides immediately for instant UI
    const cached = getCachedSlides();

    // 2. Fetch from Firestore in background if available
    try {
      const colRef = collection(db, "heroSlides");
      const fetchPromise = getDocs(query(colRef, orderBy("displayOrder", "asc")));
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Firestore timeout")), 2500)
      );

      const snapshot = (await Promise.race([fetchPromise, timeoutPromise])) as any;

      if (snapshot && !snapshot.empty) {
        const firestoreSlides = snapshot.docs.map((docSnap: any) => {
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
          } as HeroSlide;
        });

        updateCache(firestoreSlides);
        return firestoreSlides;
      }
    } catch (err) {
      console.warn("Firestore fetch error, using local cache:", err);
    }

    return cached;
  },

  async getActiveSlides(): Promise<HeroSlide[]> {
    const slides = await this.getAllSlides();
    return slides
      .filter((s) => s.active)
      .sort((a, b) => (a.displayOrder || 1) - (b.displayOrder || 1));
  },

  async updateSlide(id: string, updated: Partial<HeroSlide>): Promise<HeroSlide> {
    const cached = getCachedSlides();
    const target = cached.find((s) => s.id === id) || ({} as HeroSlide);
    const updatedSlide: HeroSlide = {
      ...target,
      ...updated,
      id,
      overlayOpacity:
        typeof updated.overlayOpacity === "number"
          ? updated.overlayOpacity
          : target.overlayOpacity ?? 0.5,
    };

    // 1. Immediately update local storage and notify UI
    const nextSlides = cached.some((s) => s.id === id)
      ? cached.map((s) => (s.id === id ? updatedSlide : s))
      : [...cached, updatedSlide];
    updateCache(nextSlides);

    // 2. Asynchronously sync to Firestore without blocking the client
    (async () => {
      try {
        await Promise.race([
          setDoc(doc(db, "heroSlides", id), updatedSlide, { merge: true }),
          new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 3000)),
        ]);
      } catch (err) {
        console.warn("Firestore updateSlide sync:", err);
      }
    })();

    return updatedSlide;
  },

  async createSlide(slide: Omit<HeroSlide, "id">): Promise<HeroSlide> {
    const newId = `slide-${Date.now()}`;
    const newSlide: HeroSlide = {
      ...slide,
      id: newId,
      overlayOpacity:
        typeof slide.overlayOpacity === "number" ? slide.overlayOpacity : 0.5,
    };

    // 1. Immediately update local cache and dispatch event
    const cached = getCachedSlides();
    const nextSlides = [...cached, newSlide];
    updateCache(nextSlides);

    // 2. Asynchronously sync to Firestore
    (async () => {
      try {
        await Promise.race([
          setDoc(doc(db, "heroSlides", newId), newSlide),
          new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 3000)),
        ]);
      } catch (err) {
        console.warn("Firestore createSlide sync:", err);
      }
    })();

    return newSlide;
  },

  async deleteSlide(id: string): Promise<void> {
    // 1. Immediately delete from local cache and dispatch event
    const cached = getCachedSlides();
    const filtered = cached.filter((s) => s.id !== id);
    updateCache(filtered);

    // 2. Asynchronously delete from Firestore
    (async () => {
      try {
        await Promise.race([
          deleteDoc(doc(db, "heroSlides", id)),
          new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 3000)),
        ]);
      } catch (err) {
        console.warn("Firestore deleteSlide sync:", err);
      }
    })();
  },
};
