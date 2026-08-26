import type { AdminNotification } from "@/types/notification";

const NOTIFICATIONS_STORAGE_KEY = "lp_notifications_v2";

const DEFAULT_NOTIFICATIONS: AdminNotification[] = [
  {
    id: "notif-1",
    title: "New Reservation Request from Anirban Roy (LPH-849201)",
    type: "BOOKING",
    read: false,
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    detailsUrl: "/admin/bookings",
  },
  {
    id: "notif-2",
    title: "New Corporate Offsite Inquiry from TechNova Analytics",
    type: "CORPORATE_LEAD",
    read: false,
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    detailsUrl: "/admin/corporate-leads",
  },
];

function getStoredNotifications(): AdminNotification[] {
  if (typeof window === "undefined") return DEFAULT_NOTIFICATIONS;
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(DEFAULT_NOTIFICATIONS));
      return DEFAULT_NOTIFICATIONS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_NOTIFICATIONS;
  } catch {
    return DEFAULT_NOTIFICATIONS;
  }
}

function saveNotifications(notifs: AdminNotification[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifs));
    window.dispatchEvent(new Event("lp_notifications_updated"));
  } catch (err) {
    console.error("Error saving notifications:", err);
  }
}

export const NotificationService = {
  async getUnreadNotifications(): Promise<AdminNotification[]> {
    const notifs = getStoredNotifications();
    return notifs.filter((n) => !n.read);
  },

  async getAllNotifications(): Promise<AdminNotification[]> {
    const notifs = getStoredNotifications();
    return [...notifs].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async createNotification(notif: Omit<AdminNotification, "id" | "createdAt">): Promise<AdminNotification> {
    const created: AdminNotification = {
      ...notif,
      id: `notif-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const current = getStoredNotifications();
    const updated = [created, ...current];
    saveNotifications(updated);
    return created;
  },

  async markAllRead(): Promise<void> {
    const current = getStoredNotifications();
    const updated = current.map((n) => ({ ...n, read: true }));
    saveNotifications(updated);
  },
};
