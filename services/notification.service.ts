import type { AdminNotification } from "@/types/notification";

let notifications: AdminNotification[] = [
  {
    id: "notif-1",
    title: "New Reservation Request from Anirban Roy (LPH-849201)",
    type: "BOOKING",
    read: false,
    createdAt: new Date().toISOString(),
    detailsUrl: "/admin/bookings",
  },
  {
    id: "notif-2",
    title: "New Corporate Offsite Inquiry from TechNova Analytics",
    type: "CORPORATE_LEAD",
    read: false,
    createdAt: new Date().toISOString(),
    detailsUrl: "/admin/corporate-leads",
  },
];

export const NotificationService = {
  async getUnreadNotifications(): Promise<AdminNotification[]> {
    return notifications.filter((n) => !n.read);
  },

  async getAllNotifications(): Promise<AdminNotification[]> {
    return [...notifications];
  },

  async createNotification(notif: Omit<AdminNotification, "id" | "createdAt">): Promise<AdminNotification> {
    const created: AdminNotification = {
      ...notif,
      id: `notif-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    notifications.unshift(created);
    return created;
  },

  async markAllRead(): Promise<void> {
    notifications = notifications.map((n) => ({ ...n, read: true }));
  },
};
