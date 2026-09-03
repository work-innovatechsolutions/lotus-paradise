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
  onSnapshot,
} from "firebase/firestore";
import { IdbStorage } from "@/lib/idb-storage";

const HERO_SLIDES_STORAGE_KEY = "lp_hero_slides_v3";

const DEFAULT_SLIDES: HeroSlide[] = [
  {
    id: "slide-1",
    title: "New Himalayan Horizon",
    subtitle: "A Luxury Mountain Retreat in Latpanchar, North Bengal",
    location: "Latpanchar, Mahananda Wildlife Sanctuary (4,500 ft)",
    badge: "Colonial Charm",
    desktopImage: "/images/hero/himalayan-horizon-view.jpeg",
    mobileImage: "/images/hero/himalayan-horizon-view.jpeg",
    video: "",
    overlayOpacity: 0.5,
    textAlignment: "left",
    buttonText: "Book Your Stay",
    buttonLink: "/booking",
    active: true,
    displayOrder: 1,
  },
  {
    id: "slide-3",
    title: "Warm Bonfires Under Himalayan Skies",
    subtitle: "Gather round the fire with hot local tea, acoustic tunes & starry nights",
    location: "Latpanchar Garden Veranda",
    badge: "Memorable Evenings",
    desktopImage: "/images/hero/ChatGPT Image Aug 4, 2026, 11_29_35 PM.png",
    mobileImage: "/images/hero/ChatGPT Image Aug 4, 2026, 11_29_35 PM.png",
    video: "",
    overlayOpacity: 0,
    textAlignment: "left",
    buttonText: "View Experiences",
    buttonLink: "/experiences",
    active: true,
    displayOrder: 3,
  },
];

// ── Cache helpers ────────────────────────────────────────────────────────────

function normaliseSlide(s: Partial<HeroSlide> & { overlayOpacity?: unknown }): HeroSlide {
  return {
    ...(s as HeroSlide),
    overlayOpacity: typeof s.overlayOpacity === "number" ? s.overlayOpacity : 0.5,
  };
}

/** Read slides from IDB. Returns null if nothing cached. */
async function getCachedSlides(): Promise<{ slides: HeroSlide[]; syncedAt: number } | null> {
  if (typeof window === "undefined") return null;
  try {
    const meta = await IdbStorage.getWithMeta<HeroSlide[]>(HERO_SLIDES_STORAGE_KEY);
    if (meta && Array.isArray(meta.data) && meta.data.length > 0) {
      return { slides: meta.data.map(normaliseSlide), syncedAt: meta.syncedAt };
    }

    const raw = IdbStorage.safeLocalGet(HERO_SLIDES_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return { slides: parsed.map(normaliseSlide), syncedAt: 0 };
      }
    }
  } catch {}
  return null;
}

async function updateCache(slides: HeroSlide[], notify = false) {
  if (typeof window === "undefined") return;
  try {
    await IdbStorage.setWithMeta(HERO_SLIDES_STORAGE_KEY, slides);
    IdbStorage.safeLocalSet(HERO_SLIDES_STORAGE_KEY, JSON.stringify(slides));
    if (notify) {
      window.dispatchEvent(new Event("lp_hero_slides_updated"));
    }
  } catch (err) {
    console.warn("Hero cache update error:", err);
  }
}

function sanitizeSlideForFirestore(slide: HeroSlide): Record<string, unknown> {
  return {
    id: slide.id || `slide-${Date.now()}`,
    title: slide.title || "",
    subtitle: slide.subtitle || "",
    location: slide.location || "Latpanchar, Kurseong",
    badge: slide.badge || "Latpanchar Retreat",
    desktopImage: slide.desktopImage || "/images/hero/himalayan-horizon-view.jpeg",
    mobileImage: slide.mobileImage || slide.desktopImage || "/images/hero/himalayan-horizon-view.jpeg",
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

// ── Internal: fetch slides from Firestore ──

async function fetchFromFirestore(): Promise<HeroSlide[]> {
  try {
    const colRef = collection(db, "heroSlides");
    const fetchPromise = getDocs(query(colRef, orderBy("displayOrder", "asc")));
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Firestore timeout")), 5000)
    );

    const snapshot = (await Promise.race([fetchPromise, timeoutPromise])) as Awaited<
      ReturnType<typeof getDocs>
    >;

    if (snapshot && !snapshot.empty) {
      const firestoreSlides: HeroSlide[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data() as Record<string, unknown>;
        return normaliseSlide({
          id: docSnap.id,
          title: (data.title as string) || "",
          subtitle: (data.subtitle as string) || "",
          location: (data.location as string) || "",
          badge: (data.badge as string) || "",
          desktopImage: (data.desktopImage as string) || (data.image as string) || "",
          mobileImage: (data.mobileImage as string) || (data.desktopImage as string) || (data.image as string) || "",
          video: (data.video as string) || "",
          overlayOpacity: data.overlayOpacity as number | undefined,
          textAlignment: ((data.textAlignment as string) || "left") as "left" | "center" | "right",
          buttonText: (data.buttonText as string) || "Book Your Stay",
          buttonLink: (data.buttonLink as string) || "/booking",
          active: data.active !== false,
          displayOrder: typeof data.displayOrder === "number" ? data.displayOrder : 1,
        });
      });

      // Firestore is the single source of truth (do not resurrect deleted items)
      return firestoreSlides.sort(
        (a, b) => (a.displayOrder || 1) - (b.displayOrder || 1)
      );
    } else if (snapshot && snapshot.empty) {
      for (const s of DEFAULT_SLIDES) {
        await setDoc(doc(db, "heroSlides", s.id), sanitizeSlideForFirestore(s));
      }
      return DEFAULT_SLIDES;
    }
  } catch (err) {
    console.warn("Firestore heroSlides fetch fallback:", err);
  }

  return DEFAULT_SLIDES;
}

// ── Service ──────────────────────────────────────────────────────────────────

export const HeroService = {
  async getAllSlides(): Promise<HeroSlide[]> {
    const fresh = await fetchFromFirestore();
    await updateCache(fresh);
    return fresh;
  },

  async getActiveSlides(): Promise<HeroSlide[]> {
    const slides = await this.getAllSlides();
    return slides
      .filter((s) => s.active)
      .sort((a, b) => (a.displayOrder || 1) - (b.displayOrder || 1));
  },

  /** Real-time subscription to active hero slides */
  subscribeToActiveSlides(callback: (slides: HeroSlide[]) => void): () => void {
    if (typeof window === "undefined") return () => {};

    // Immediate cached or default view to prevent blank flash
    getCachedSlides().then((cached) => {
      if (cached && cached.slides.length > 0) {
        const active = cached.slides
          .filter((s) => s.active)
          .sort((a, b) => (a.displayOrder || 1) - (b.displayOrder || 1));
        callback(active);
      } else {
        callback(DEFAULT_SLIDES);
      }
    });

    const colRef = collection(db, "heroSlides");
    const q = query(colRef, orderBy("displayOrder", "asc"));

    const unsub = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const freshSlides: HeroSlide[] = snapshot.docs.map((docSnap) => {
            const data = docSnap.data() as Record<string, unknown>;
            return normaliseSlide({
              id: docSnap.id,
              title: (data.title as string) || "",
              subtitle: (data.subtitle as string) || "",
              location: (data.location as string) || "",
              badge: (data.badge as string) || "",
              desktopImage: (data.desktopImage as string) || (data.image as string) || "",
              mobileImage: (data.mobileImage as string) || (data.desktopImage as string) || (data.image as string) || "",
              video: (data.video as string) || "",
              overlayOpacity: data.overlayOpacity as number | undefined,
              textAlignment: ((data.textAlignment as string) || "left") as "left" | "center" | "right",
              buttonText: (data.buttonText as string) || "Book Your Stay",
              buttonLink: (data.buttonLink as string) || "/booking",
              active: data.active !== false,
              displayOrder: typeof data.displayOrder === "number" ? data.displayOrder : 1,
            });
          });

          updateCache(freshSlides, false);
          const active = freshSlides
            .filter((s) => s.active)
            .sort((a, b) => (a.displayOrder || 1) - (b.displayOrder || 1));
          callback(active);
        }
      },
      (err) => {
        console.warn("Firestore heroSlides onSnapshot error:", err);
      }
    );

    return unsub;
  },

  async updateSlide(id: string, updated: Partial<HeroSlide>): Promise<HeroSlide> {
    const cached = await getCachedSlides();
    const currentList = cached ? cached.slides : DEFAULT_SLIDES;

    const target = currentList.find((s) => s.id === id) || ({} as HeroSlide);
    const updatedSlide: HeroSlide = normaliseSlide({
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
    });

    const nextSlides = currentList.some((s) => s.id === id)
      ? currentList.map((s) => (s.id === id ? updatedSlide : s))
      : [...currentList, updatedSlide];
    await updateCache(nextSlides, true);

    try {
      await setDoc(doc(db, "heroSlides", id), sanitizeSlideForFirestore(updatedSlide), { merge: true });
    } catch (err) {
      console.warn("Firestore updateSlide sync:", err);
    }

    return updatedSlide;
  },

  async createSlide(slide: Omit<HeroSlide, "id"> & { id?: string }): Promise<HeroSlide> {
    const newId = slide.id && slide.id.startsWith("slide-") ? slide.id : `slide-${Date.now()}`;
    const newSlide: HeroSlide = normaliseSlide({
      id: newId,
      title: slide.title || "New Himalayan Horizon",
      subtitle: slide.subtitle || "",
      location: slide.location || "Latpanchar, Kurseong",
      badge: slide.badge || "Latpanchar Retreat",
      desktopImage: slide.desktopImage || "/images/hero/himalayan-horizon-view.jpeg",
      mobileImage: slide.mobileImage || slide.desktopImage || "/images/hero/himalayan-horizon-view.jpeg",
      video: slide.video || "",
      overlayOpacity: slide.overlayOpacity,
      textAlignment: slide.textAlignment || "left",
      buttonText: slide.buttonText || "Book Your Stay",
      buttonLink: slide.buttonLink || "/booking",
      active: slide.active !== false,
      displayOrder: typeof slide.displayOrder === "number" ? slide.displayOrder : 1,
    });

    const cached = await getCachedSlides();
    const currentList = cached ? cached.slides : DEFAULT_SLIDES;
    const exists = currentList.some((s) => s.id === newId);
    const nextSlides = exists
      ? currentList.map((s) => (s.id === newId ? newSlide : s))
      : [...currentList, newSlide];
    await updateCache(nextSlides, true);

    try {
      await setDoc(doc(db, "heroSlides", newId), sanitizeSlideForFirestore(newSlide));
    } catch (err) {
      console.warn("Firestore createSlide sync:", err);
    }

    return newSlide;
  },

  async deleteSlide(id: string): Promise<void> {
    const cached = await getCachedSlides();
    const currentList = cached ? cached.slides : DEFAULT_SLIDES;
    const filtered = currentList.filter((s) => s.id !== id);
    await updateCache(filtered, true);

    try {
      await deleteDoc(doc(db, "heroSlides", id));
    } catch (err) {
      console.warn("Firestore deleteSlide sync:", err);
    }
  },

  /** Force-invalidate the hero slides cache so the next getAllSlides() hits Firestore. */
  async invalidateCache(): Promise<void> {
    await IdbStorage.clearByPrefix(HERO_SLIDES_STORAGE_KEY);
  },
};
