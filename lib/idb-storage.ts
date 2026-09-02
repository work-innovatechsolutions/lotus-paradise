// ─────────────────────────────────────────────────────────────────────────────
// INDEXEDDB KEY-VAL UTILITY
// Provides virtually unlimited client storage for base64 images and large models
// ─────────────────────────────────────────────────────────────────────────────

const DB_NAME = "lotus_paradise_db";
const DB_VERSION = 1;
const STORE_NAME = "keyval";

// ── Internal wrapper type ────────────────────────────────────────────────────

interface CacheMeta<T> {
  data: T;
  syncedAt: number; // Unix ms timestamp of when data was written from the remote
}

function getDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      return reject(new Error("IndexedDB is not available"));
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export const IdbStorage = {
  // ── Raw get/set ─────────────────────────────────────────────────────────

  async get<T>(key: string): Promise<T | null> {
    try {
      const db = await getDB();
      return new Promise((resolve) => {
        const tx = db.transaction(STORE_NAME, "readonly");
        const store = tx.objectStore(STORE_NAME);
        const req = store.get(key);
        req.onsuccess = () => resolve(req.result !== undefined ? req.result : null);
        req.onerror = () => resolve(null);
      });
    } catch {
      return null;
    }
  },

  async set<T>(key: string, value: T): Promise<void> {
    try {
      const db = await getDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readwrite");
        const store = tx.objectStore(STORE_NAME);
        const req = store.put(value, key);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch (e) {
      console.warn("IdbStorage.set error:", e);
    }
  },

  async delete(key: string): Promise<void> {
    try {
      const db = await getDB();
      return new Promise((resolve) => {
        const tx = db.transaction(STORE_NAME, "readwrite");
        const store = tx.objectStore(STORE_NAME);
        const req = store.delete(key);
        req.onsuccess = () => resolve();
        req.onerror = () => resolve();
      });
    } catch {}
  },

  // ── Metadata-aware get/set (for stale-cache checking) ───────────────────

  /**
   * Store data alongside a `syncedAt` timestamp so callers can later
   * determine whether the cache is still fresh.
   */
  async setWithMeta<T>(key: string, data: T): Promise<void> {
    const meta: CacheMeta<T> = { data, syncedAt: Date.now() };
    await this.set(`${key}__meta`, meta);
    // Also keep the raw value for backward compatibility with legacy reads
    await this.set(key, data);
    this.safeLocalSet(`${key}__syncedAt`, String(Date.now()));
  },

  /**
   * Read data and its `syncedAt` timestamp.
   * Returns null if no cache entry exists.
   */
  async getWithMeta<T>(key: string): Promise<CacheMeta<T> | null> {
    try {
      const meta = await this.get<CacheMeta<T>>(`${key}__meta`);
      if (meta && typeof meta.syncedAt === "number" && meta.data !== undefined) {
        return meta;
      }
      // Fallback: try composing from raw key + localStorage timestamp
      const raw = await this.get<T>(key);
      if (raw !== null) {
        const tsStr = this.safeLocalGet(`${key}__syncedAt`);
        const syncedAt = tsStr ? parseInt(tsStr, 10) : 0;
        return { data: raw, syncedAt };
      }
    } catch {}
    return null;
  },

  /**
   * Returns true when the cached entry for `key` is older than `maxAgeMs`.
   * Returns true (treat as stale) when there is no cache entry at all.
   */
  async isStale(key: string, maxAgeMs: number): Promise<boolean> {
    try {
      const meta = await this.getWithMeta(key);
      if (!meta) return true;
      return Date.now() - meta.syncedAt > maxAgeMs;
    } catch {
      return true;
    }
  },

  /**
   * Delete all IDB keys and localStorage keys that start with `prefix`.
   * Useful for a hard-refresh triggered by an admin action.
   */
  async clearByPrefix(prefix: string): Promise<void> {
    try {
      const db = await getDB();
      const allKeys: string[] = await new Promise((resolve) => {
        const tx = db.transaction(STORE_NAME, "readonly");
        const store = tx.objectStore(STORE_NAME);
        const req = store.getAllKeys();
        req.onsuccess = () => resolve((req.result as string[]) || []);
        req.onerror = () => resolve([]);
      });
      const matching = allKeys.filter((k) => String(k).startsWith(prefix));
      await Promise.all(matching.map((k) => this.delete(k)));
    } catch {}

    // Also clear matching localStorage keys
    if (typeof window !== "undefined") {
      try {
        const lsKeys = Object.keys(localStorage).filter((k) => k.startsWith(prefix));
        lsKeys.forEach((k) => {
          try { localStorage.removeItem(k); } catch {}
        });
      } catch {}
    }
  },

  // ── Safe localStorage helpers ────────────────────────────────────────────

  safeLocalSet(key: string, value: string): boolean {
    if (typeof window === "undefined") return false;
    try {
      localStorage.setItem(key, value);
      return true;
    } catch {
      return false;
    }
  },

  safeLocalGet(key: string): string | null {
    if (typeof window === "undefined") return null;
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
};
