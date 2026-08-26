export interface AdminPanelLockConfig {
  enabled: boolean;
  passcode: string;
  lockedRoutes: string[];
}

const STORAGE_KEY = "lp_admin_panel_locks";
const SESSION_UNLOCKED_KEY = "lp_unlocked_routes";

const DEFAULT_CONFIG: AdminPanelLockConfig = {
  enabled: false,
  passcode: "1234",
  lockedRoutes: [],
};

// In-memory unlocked routes: Resets on every page refresh!
const inMemoryUnlockedRoutes = new Set<string>();

export const PanelLockService = {
  getConfig(): AdminPanelLockConfig {
    if (typeof window === "undefined") return DEFAULT_CONFIG;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error("Error reading panel lock config:", e);
    }
    return DEFAULT_CONFIG;
  },

  saveConfig(config: AdminPanelLockConfig): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
      window.dispatchEvent(new Event("lp_admin_locks_updated"));
    } catch (e) {
      console.error("Error saving panel lock config:", e);
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
