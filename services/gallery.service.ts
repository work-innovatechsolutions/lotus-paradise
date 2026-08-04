import { GALLERY_ITEMS } from "@/lib/data";
import type { GalleryItem } from "@/types/gallery";

let inMemoryGallery: GalleryItem[] = GALLERY_ITEMS.map((g) => ({
  id: g.id,
  title: g.title,
  category: g.category,
  imageUrl: g.imageUrl,
  altText: g.altText,
  width: 1920,
  height: 1080,
  location: "Latpanchar, North Bengal",
  photographer: "Lotus Paradise Desk",
  tags: [g.category.toLowerCase(), "latpanchar", "himalayas"],
  featured: true,
  uploadedAt: new Date().toISOString(),
}));

export const GalleryService = {
  async getAllItems(): Promise<GalleryItem[]> {
    return [...inMemoryGallery];
  },

  async getItemsByCategory(category: string): Promise<GalleryItem[]> {
    if (category === "All") return [...inMemoryGallery];
    return inMemoryGallery.filter((g) => g.category === category);
  },

  async updateItemAlt(id: string, altText: string): Promise<GalleryItem> {
    inMemoryGallery = inMemoryGallery.map((g) => (g.id === id ? { ...g, altText } : g));
    const target = inMemoryGallery.find((g) => g.id === id);
    if (!target) throw new Error("Item not found");
    return target;
  },

  async deleteItem(id: string): Promise<void> {
    inMemoryGallery = inMemoryGallery.filter((g) => g.id !== id);
  },

  async createItem(item: Omit<GalleryItem, "id" | "uploadedAt">): Promise<GalleryItem> {
    const created: GalleryItem = {
      ...item,
      id: `gal-${Date.now()}`,
      uploadedAt: new Date().toISOString(),
    };
    inMemoryGallery.unshift(created);
    return created;
  },
};
