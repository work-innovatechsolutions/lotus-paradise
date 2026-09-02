import { GALLERY_ITEMS } from "@/lib/data";
import type { GalleryItem } from "@/types/gallery";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  query,
} from "firebase/firestore";
import { IdbStorage } from "@/lib/idb-storage";

const GALLERY_STORAGE_KEY = "lp_gallery_items_v2";

const DEFAULT_GALLERY: GalleryItem[] = GALLERY_ITEMS.map((g) => ({
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

function getCachedGallery(): GalleryItem[] {
  if (typeof window === "undefined") return DEFAULT_GALLERY;
  try {
    const raw = IdbStorage.safeLocalGet(GALLERY_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn("Cached gallery error:", err);
  }
  return DEFAULT_GALLERY;
}

function updateCache(items: GalleryItem[]) {
  if (typeof window === "undefined") return;
  try {
    IdbStorage.set(GALLERY_STORAGE_KEY, items);
    IdbStorage.safeLocalSet(GALLERY_STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event("lp_gallery_updated"));
  } catch (err) {
    console.warn("Cache update error:", err);
  }
}

export const GalleryService = {
  async getAllItems(): Promise<GalleryItem[]> {
    const cached = getCachedGallery();

    try {
      const colRef = collection(db, "gallery");
      const fetchPromise = getDocs(colRef);
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Firestore timeout")), 2500)
      );

      const snapshot = (await Promise.race([fetchPromise, timeoutPromise])) as any;

      if (snapshot && !snapshot.empty) {
        const firestoreItems = snapshot.docs.map((docSnap: any) => ({
          id: docSnap.id,
          ...docSnap.data(),
        })) as GalleryItem[];

        updateCache(firestoreItems);
        return firestoreItems;
      }
    } catch (err) {
      console.warn("Firestore gallery fetch error, using local cache:", err);
    }

    return cached;
  },

  async getItemsByCategory(category: string): Promise<GalleryItem[]> {
    const items = await this.getAllItems();
    if (category === "All") return items;
    return items.filter((g) => g.category.toLowerCase() === category.toLowerCase());
  },

  async updateItem(id: string, updated: Partial<GalleryItem>): Promise<GalleryItem> {
    const cached = getCachedGallery();
    const target = cached.find((g) => g.id === id) || ({} as GalleryItem);
    const updatedItem: GalleryItem = { ...target, ...updated, id };

    const nextItems = cached.map((g) => (g.id === id ? updatedItem : g));
    updateCache(nextItems);

    (async () => {
      try {
        await setDoc(doc(db, "gallery", id), updatedItem, { merge: true });
      } catch (err) {
        console.warn("Firestore updateItem sync:", err);
      }
    })();

    return updatedItem;
  },

  async updateItemAlt(id: string, altText: string): Promise<GalleryItem> {
    return this.updateItem(id, { altText });
  },

  async updateItemCategory(id: string, category: GalleryItem["category"]): Promise<GalleryItem> {
    return this.updateItem(id, { category });
  },

  async deleteItem(id: string): Promise<void> {
    const cached = getCachedGallery();
    const filtered = cached.filter((g) => g.id !== id);
    updateCache(filtered);

    (async () => {
      try {
        await deleteDoc(doc(db, "gallery", id));
      } catch (err) {
        console.warn("Firestore deleteItem sync:", err);
      }
    })();
  },

  async createItem(item: Omit<GalleryItem, "id" | "uploadedAt">): Promise<GalleryItem> {
    const newId = `gal-${Date.now()}`;
    const newItem: GalleryItem = {
      ...item,
      id: newId,
      uploadedAt: new Date().toISOString(),
    };

    const cached = getCachedGallery();
    const nextItems = [newItem, ...cached];
    updateCache(nextItems);

    (async () => {
      try {
        await setDoc(doc(db, "gallery", newId), newItem);
      } catch (err) {
        console.warn("Firestore createItem sync:", err);
      }
    })();

    return newItem;
  },
};
