import { HERO_SLIDES } from "@/lib/data";
import type { HeroSlide } from "@/types/hero";

let inMemorySlides: HeroSlide[] = HERO_SLIDES.map((s, idx) => ({
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

export const HeroService = {
  async getActiveSlides(): Promise<HeroSlide[]> {
    return inMemorySlides
      .filter((s) => s.active)
      .sort((a, b) => a.displayOrder - b.displayOrder);
  },

  async getAllSlides(): Promise<HeroSlide[]> {
    return [...inMemorySlides].sort((a, b) => a.displayOrder - b.displayOrder);
  },

  async updateSlide(id: string, updated: Partial<HeroSlide>): Promise<HeroSlide> {
    inMemorySlides = inMemorySlides.map((s) => (s.id === id ? { ...s, ...updated } : s));
    const target = inMemorySlides.find((s) => s.id === id);
    if (!target) throw new Error("Slide not found");
    return target;
  },

  async createSlide(slide: Omit<HeroSlide, "id">): Promise<HeroSlide> {
    const newSlide: HeroSlide = {
      ...slide,
      id: `slide-${Date.now()}`,
    };
    inMemorySlides.push(newSlide);
    return newSlide;
  },

  async deleteSlide(id: string): Promise<void> {
    inMemorySlides = inMemorySlides.filter((s) => s.id !== id);
  },
};
