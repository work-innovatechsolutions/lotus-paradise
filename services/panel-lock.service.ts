import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";

export interface AdminPanelLockConfig {
  enabled: boolean;
  passcode: string;
  lockedRoutes: string[];
  updatedAt?: string;
}

const STORAGE_KEY = "lp_admin_panel_locks";

const DEFAULT_CONFIG: AdminPanelLockConfig = {
  enabled: false,
  passcode: "1234",
  lockedRoutes: [],
};

// In-memory cache for ultra-fast synchronous checks
let inMemoryConfig: AdminPanelLockConfig | null = null;
const inMemoryUnlockedRoutes = new Set<string>();

export const PanelLockService = {
  getConfig(): AdminPanelLockConfig {
    if (inMemoryConfig) return inMemoryConfig;
    if (typeof window === "undefined") return DEFAULT_CONFIG;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        inMemoryConfig = JSON.parse(saved);
        return inMemoryConfig!;
      }
    } catch (e) {
      console.error("Error reading panel lock config:", e);
    }
    return DEFAULT_CONFIG;
  },

  async saveConfig(config: AdminPanelLockConfig): Promise<void> {
    const payload: AdminPanelLockConfig = {
      ...config,
      updatedAt: new Date().toISOString(),
    };
    inMemoryConfig = payload;

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
        window.dispatchEvent(new Event("lp_admin_locks_updated"));
      } catch (e) {
        console.error("Error saving panel lock config to localStorage:", e);
      }
    }

    // Sync to Cloud Firestore
    try {
      await setDoc(doc(db, "siteSettings", "panelLock"), payload, { merge: true });
    } catch (e) {
      console.warn("Firestore saveConfig error (siteSettings):", e);
      try {
        await setDoc(doc(db, "settings", "panelLock"), payload, { merge: true });
      } catch (err) {
        console.error("Firestore saveConfig fallback error:", err);
      }
    }
  },

  async loadFromFirestore(): Promise<AdminPanelLockConfig> {
    try {
      const docRef = doc(db, "siteSettings", "panelLock");
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data() as AdminPanelLockConfig;
        inMemoryConfig = data;
        if (typeof window !== "undefined") {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
          window.dispatchEvent(new Event("lp_admin_locks_updated"));
        }
        return data;
      }
    } catch (err) {
      console.warn("Firestore panelLock fetch error:", err);
    }
    return this.getConfig();
  },

  subscribeToFirestore(callback?: (config: AdminPanelLockConfig) => void): () => void {
    if (typeof window === "undefined") return () => {};
    try {
      const docRef = doc(db, "siteSettings", "panelLock");
      const unsubscribe = onSnapshot(
        docRef,
        (snap) => {
          if (snap.exists()) {
            const data = snap.data() as AdminPanelLockConfig;
            inMemoryConfig = data;
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
              window.dispatchEvent(new Event("lp_admin_locks_updated"));
            } catch {}
            if (callback) callback(data);
          }
        },
        (err) => {
          console.warn("Firestore panelLock subscription warning:", err);
        }
      );
      return unsubscribe;
    } catch (e) {
      console.warn("Could not subscribe to panelLock in Firestore:", e);
      return () => {};
    }
  },

  isRouteLocked(route: string): boolean {
    const config = this.getConfig();
    if (!config.enabled || !config.passcode) return false;
    return config.lockedRoutes.includes(route);
  },

  isRouteUnlocked(route: string): boolean {
    if (typeof window === "undefined") return true;
    if (!this.isRouteLocked(route)) return true;
    return inMemoryUnlockedRoutes.has(route) || inMemoryUnlockedRoutes.has("MASTER_ALL");
  },

  unlockRoute(route: string, enteredPin: string): boolean {
    const config = this.getConfig();
    if (config.passcode === enteredPin) {
      inMemoryUnlockedRoutes.add(route);
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("lp_admin_locks_updated"));
      }
      return true;
    }
    return false;
  },

  lockAll(): void {
    inMemoryUnlockedRoutes.clear();
    if (typeof window !== "undefined") {
      try {
        sessionStorage.removeItem("lp_unlocked_routes");
      } catch {}
      window.dispatchEvent(new Event("lp_admin_locks_updated"));
    }
  },
};
