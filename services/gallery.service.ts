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

// Images updated in Firebase are guaranteed visible within this window.
const MAX_CACHE_AGE_MS = 5 * 60 * 1000; // 5 minutes

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

// ── Cache helpers ────────────────────────────────────────────────────────────

async function getStoredGallery(): Promise<GalleryItem[]> {
  if (typeof window === "undefined") return DEFAULT_GALLERY;
  try {
    const meta = await IdbStorage.getWithMeta<GalleryItem[]>(GALLERY_STORAGE_KEY);
    if (meta && Array.isArray(meta.data) && meta.data.length > 0) return meta.data;

    // Legacy fallback: raw localStorage value written by older code versions
    const raw = IdbStorage.safeLocalGet(GALLERY_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return DEFAULT_GALLERY;
}

async function updateCache(items: GalleryItem[], notify = false) {
  if (typeof window === "undefined") return;
  try {
    await IdbStorage.setWithMeta(GALLERY_STORAGE_KEY, items);
    // Keep legacy localStorage key in sync for any code that still reads it directly
    IdbStorage.safeLocalSet(GALLERY_STORAGE_KEY, JSON.stringify(items));
    if (notify) {
      window.dispatchEvent(new Event("lp_gallery_updated"));
    }
  } catch (err) {
    console.warn("Gallery cache update error:", err);
  }
}

// ── Service ──────────────────────────────────────────────────────────────────

export const GalleryService = {
  async getAllItems(): Promise<GalleryItem[]> {
    // Check whether the cache is stale BEFORE deciding to use it
    const cacheIsStale = await IdbStorage.isStale(GALLERY_STORAGE_KEY, MAX_CACHE_AGE_MS);

    if (!cacheIsStale) {
      // Cache is fresh — return it immediately and kick off a silent background refresh
      const cachedItems = await getStoredGallery();
      // Background refresh so the *next* load is up-to-date
      this._fetchFromFirestore(cachedItems)
        .then((fresh) => updateCache(fresh, false))
        .catch(() => {});
      return cachedItems;
    }

    // Cache is stale (or empty) — fetch from Firestore first
    const localItems = await getStoredGallery();
    const fresh = await this._fetchFromFirestore(localItems);
    await updateCache(fresh, false);
    return fresh;
  },

  /** Internal: fetch from Firestore and merge with local-only items. */
  async _fetchFromFirestore(localItems: GalleryItem[]): Promise<GalleryItem[]> {
    try {
      const colRef = collection(db, "gallery");
      const fetchPromise = getDocs(colRef);
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Firestore timeout")), 5000)
      );

      const snapshot = (await Promise.race([fetchPromise, timeoutPromise])) as Awaited<
        ReturnType<typeof getDocs>
      >;

      if (snapshot && !snapshot.empty) {
        const firestoreItems: GalleryItem[] = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as Omit<GalleryItem, "id">),
        }));

        return firestoreItems;
      } else if (snapshot && snapshot.empty) {
        // Auto-seed Firestore with defaults on first run
        for (const item of DEFAULT_GALLERY) {
          await setDoc(doc(db, "gallery", item.id), item);
        }
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
    await updateCache(nextItems, true);

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
    await updateCache(filtered, true);

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
    await updateCache(nextItems, true);

    try {
      await setDoc(doc(db, "gallery", newId), newItem);
    } catch (err) {
      console.warn("Firestore createItem sync:", err);
    }

    return newItem;
  },

  /** Force-invalidate the gallery cache so the next getAllItems() hits Firestore. */
  async invalidateCache(): Promise<void> {
    await IdbStorage.clearByPrefix(GALLERY_STORAGE_KEY);
  },
};
