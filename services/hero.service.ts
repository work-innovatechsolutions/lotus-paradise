import { HERO_SLIDES } from "@/lib/data";
import type { HeroSlide } from "@/types/hero";

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

import { IdbStorage } from "@/lib/idb-storage";

function getStoredSlides(): HeroSlide[] {
  if (typeof window === "undefined") return DEFAULT_SLIDES;
  try {
    const raw = IdbStorage.safeLocalGet(HERO_SLIDES_STORAGE_KEY);
    if (!raw) {
      IdbStorage.safeLocalSet(HERO_SLIDES_STORAGE_KEY, JSON.stringify(DEFAULT_SLIDES));
      IdbStorage.set(HERO_SLIDES_STORAGE_KEY, DEFAULT_SLIDES);
      return DEFAULT_SLIDES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Ensure all slides have overlayOpacity
      return parsed.map((s) => ({
        ...s,
        overlayOpacity: typeof s.overlayOpacity === "number" ? s.overlayOpacity : 0.5,
      }));
    }
    return DEFAULT_SLIDES;
  } catch {
    return DEFAULT_SLIDES;
  }
}

function saveSlides(slides: HeroSlide[]): void {
  if (typeof window === "undefined") return;
  try {
    IdbStorage.set(HERO_SLIDES_STORAGE_KEY, slides);
    IdbStorage.safeLocalSet(HERO_SLIDES_STORAGE_KEY, JSON.stringify(slides));
    window.dispatchEvent(new Event("lp_hero_slides_updated"));
  } catch (err) {
    console.error("Error saving hero slides:", err);
  }
}

export const HeroService = {
  async getActiveSlides(): Promise<HeroSlide[]> {
    const slides = getStoredSlides();
    return slides
      .filter((s) => s.active)
      .sort((a, b) => (a.displayOrder || 1) - (b.displayOrder || 1));
  },

  async getAllSlides(): Promise<HeroSlide[]> {
    const slides = getStoredSlides();
    return [...slides].sort((a, b) => (a.displayOrder || 1) - (b.displayOrder || 1));
  },

  async updateSlide(id: string, updated: Partial<HeroSlide>): Promise<HeroSlide> {
    const slides = getStoredSlides();
    const target = slides.find((s) => s.id === id);
    if (!target) throw new Error("Slide not found");

    const updatedSlide = { ...target, ...updated };
    const newSlides = slides.map((s) => (s.id === id ? updatedSlide : s));
    saveSlides(newSlides);
    return updatedSlide;
  },

  async createSlide(slide: Omit<HeroSlide, "id">): Promise<HeroSlide> {
    const newSlide: HeroSlide = {
      ...slide,
      id: `slide-${Date.now()}`,
      overlayOpacity: typeof slide.overlayOpacity === "number" ? slide.overlayOpacity : 0.5,
    };
    const slides = getStoredSlides();
    const updated = [...slides, newSlide];
    saveSlides(updated);
    return newSlide;
  },

  async deleteSlide(id: string): Promise<void> {
    const slides = getStoredSlides();
    const filtered = slides.filter((s) => s.id !== id);
    saveSlides(filtered);
  },
};
