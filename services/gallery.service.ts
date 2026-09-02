import { GALLERY_ITEMS } from "@/lib/data";
import type { GalleryItem } from "@/types/gallery";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
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

async function getStoredGallery(): Promise<GalleryItem[]> {
  if (typeof window === "undefined") return DEFAULT_GALLERY;
  try {
    const idbData = await IdbStorage.get<GalleryItem[]>(GALLERY_STORAGE_KEY);
    if (Array.isArray(idbData) && idbData.length > 0) return idbData;
    const raw = IdbStorage.safeLocalGet(GALLERY_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return DEFAULT_GALLERY;
}

async function updateCache(items: GalleryItem[]) {
  if (typeof window === "undefined") return;
  try {
    await IdbStorage.set(GALLERY_STORAGE_KEY, items);
    IdbStorage.safeLocalSet(GALLERY_STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event("lp_gallery_updated"));
  } catch (err) {
    console.warn("Cache update error:", err);
  }
}

export const GalleryService = {
  async getAllItems(): Promise<GalleryItem[]> {
    const localItems = await getStoredGallery();

    try {
      const colRef = collection(db, "gallery");
      const fetchPromise = getDocs(colRef);
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Firestore timeout")), 4000)
      );

      const snapshot = (await Promise.race([fetchPromise, timeoutPromise])) as any;

      if (snapshot && !snapshot.empty) {
        const firestoreItems: GalleryItem[] = snapshot.docs.map((docSnap: any) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));

        const firestoreIds = new Set(firestoreItems.map((g) => g.id));
        const localOnly = localItems.filter((g) => !firestoreIds.has(g.id));
        const merged = [...firestoreItems, ...localOnly];

        await updateCache(merged);
        return merged;
      } else if (snapshot && snapshot.empty) {
        for (const item of DEFAULT_GALLERY) {
          await setDoc(doc(db, "gallery", item.id), item);
        }
        await updateCache(DEFAULT_GALLERY);
        return DEFAULT_GALLERY;
      }
    } catch (err) {
      console.warn("Firestore gallery fetch fallback:", err);
    }

    return localItems;
  },

  async getItemsByCategory(category: string): Promise<GalleryItem[]> {
    const items = await this.getAllItems();
    if (category === "All") return items;
    return items.filter((g) => g.category.toLowerCase() === category.toLowerCase());
  },

  async updateItem(id: string, updated: Partial<GalleryItem>): Promise<GalleryItem> {
    const currentList = await getStoredGallery();
    const target = currentList.find((g) => g.id === id) || ({} as GalleryItem);
    const updatedItem: GalleryItem = { ...target, ...updated, id };

    const nextItems = currentList.map((g) => (g.id === id ? updatedItem : g));
    await updateCache(nextItems);

    try {
      await setDoc(doc(db, "gallery", id), updatedItem, { merge: true });
    } catch (err) {
      console.warn("Firestore updateItem sync:", err);
    }

    return updatedItem;
  },

  async updateItemAlt(id: string, altText: string): Promise<GalleryItem> {
    return this.updateItem(id, { altText });
  },

  async updateItemCategory(id: string, category: GalleryItem["category"]): Promise<GalleryItem> {
    return this.updateItem(id, { category });
  },

  async deleteItem(id: string): Promise<void> {
    const currentList = await getStoredGallery();
    const filtered = currentList.filter((g) => g.id !== id);
    await updateCache(filtered);

    try {
      await deleteDoc(doc(db, "gallery", id));
    } catch (err) {
      console.warn("Firestore deleteItem sync:", err);
    }
  },

  async createItem(item: Omit<GalleryItem, "id" | "uploadedAt">): Promise<GalleryItem> {
    const newId = `gal-${Date.now()}`;
    const newItem: GalleryItem = {
      ...item,
      id: newId,
      uploadedAt: new Date().toISOString(),
    };

    const currentList = await getStoredGallery();
    const nextItems = [newItem, ...currentList];
    await updateCache(nextItems);

    try {
      await setDoc(doc(db, "gallery", newId), newItem);
    } catch (err) {
      console.warn("Firestore createItem sync:", err);
    }

    return newItem;
  },
};
