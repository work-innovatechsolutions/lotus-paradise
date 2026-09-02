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

// Images updated in Firebase are guaranteed visible within this window.
const MAX_CACHE_AGE_MS = 5 * 60 * 1000; // 5 minutes

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

// ── Cache helpers ────────────────────────────────────────────────────────────

function normaliseSlide(s: Partial<HeroSlide> & { overlayOpacity?: unknown }): HeroSlide {
  return {
    ...(s as HeroSlide),
    overlayOpacity: typeof s.overlayOpacity === "number" ? s.overlayOpacity : 0.5,
  };
}

/** Read slides from IDB (includes syncedAt metadata). Returns null if nothing cached. */
async function getCachedSlides(): Promise<{ slides: HeroSlide[]; syncedAt: number } | null> {
  if (typeof window === "undefined") return null;
  try {
    const meta = await IdbStorage.getWithMeta<HeroSlide[]>(HERO_SLIDES_STORAGE_KEY);
    if (meta && Array.isArray(meta.data) && meta.data.length > 0) {
      return { slides: meta.data.map(normaliseSlide), syncedAt: meta.syncedAt };
    }

    // Legacy fallback: plain localStorage written by older code versions
    const raw = IdbStorage.safeLocalGet(HERO_SLIDES_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return { slides: parsed.map(normaliseSlide), syncedAt: 0 }; // syncedAt=0 → always stale → will refresh
      }
    }
  } catch {}
  return null;
}

async function updateCache(slides: HeroSlide[]) {
  if (typeof window === "undefined") return;
  try {
    await IdbStorage.setWithMeta(HERO_SLIDES_STORAGE_KEY, slides);
    IdbStorage.safeLocalSet(HERO_SLIDES_STORAGE_KEY, JSON.stringify(slides));
    window.dispatchEvent(new Event("lp_hero_slides_updated"));
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

// ── Internal: fetch slides from Firestore and merge with local-only entries ──

async function fetchFromFirestore(
  localSlides: HeroSlide[]
): Promise<HeroSlide[]> {
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


      // Keep slides that only exist locally (e.g. created offline)
      const firestoreIds = new Set(firestoreSlides.map((s) => s.id));
      const localOnly = localSlides.filter((s) => !firestoreIds.has(s.id));
      return [...firestoreSlides, ...localOnly].sort(
        (a, b) => (a.displayOrder || 1) - (b.displayOrder || 1)
      );
    } else if (snapshot && snapshot.empty) {
      // Auto-seed Firestore with DEFAULT_SLIDES on first run
      for (const s of DEFAULT_SLIDES) {
        await setDoc(doc(db, "heroSlides", s.id), sanitizeSlideForFirestore(s));
      }
      return DEFAULT_SLIDES;
    }
  } catch (err) {
    console.warn("Firestore heroSlides fetch fallback:", err);
  }

  return localSlides;
}

// ── Service ──────────────────────────────────────────────────────────────────

export const HeroService = {
  async getAllSlides(): Promise<HeroSlide[]> {
    const cached = await getCachedSlides();
    const cacheAge = cached ? Date.now() - cached.syncedAt : Infinity;
    const cacheIsStale = cacheAge > MAX_CACHE_AGE_MS;

    if (cached && !cacheIsStale) {
      // Cache is fresh — return immediately and silently refresh in the background
      const localSlides = cached.slides;
      fetchFromFirestore(localSlides)
        .then(updateCache)
        .catch(() => {});
      return localSlides;
    }

    // Cache is stale or empty — fetch from Firestore first
    const localSlides = cached ? cached.slides : DEFAULT_SLIDES;
    const fresh = await fetchFromFirestore(localSlides);
    await updateCache(fresh);
    return fresh;
  },

  async getActiveSlides(): Promise<HeroSlide[]> {
    const slides = await this.getAllSlides();
    return slides
      .filter((s) => s.active)
      .sort((a, b) => (a.displayOrder || 1) - (b.displayOrder || 1));
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
    await updateCache(nextSlides);

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
      desktopImage: slide.desktopImage || "/images/hero/bengal-latpanchar.jpg.jpeg",
      mobileImage: slide.mobileImage || slide.desktopImage || "/images/hero/bengal-latpanchar.jpg.jpeg",
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
    await updateCache(nextSlides);

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
    await updateCache(filtered);

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
