import { NotificationService } from "./notification.service";

export interface EnquiryData {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject?: string;
  message: string;
  status: "UNREAD" | "READ" | "REPLIED";
  assignedTo?: string;
  reply?: string;
  repliedAt?: string;
  createdAt: string;
}

let inMemoryEnquiries: EnquiryData[] = [
  {
    id: "enq-1",
    name: "Siddharth Roy",
    email: "siddharth@example.com",
    phone: "+91 98301 99887",
    subject: "Latpanchar Hornbill Tour Package",
    message: "Hello, we are a group of 4 photographers visiting in October. Do you arrange local cab pickup from NJP station?",
    status: "UNREAD",
    createdAt: new Date().toISOString(),
  },
];

export const EnquiryService = {
  async getAllEnquiries(): Promise<EnquiryData[]> {
    return [...inMemoryEnquiries];
  },

  async createEnquiry(data: Omit<EnquiryData, "id" | "status" | "createdAt">): Promise<EnquiryData> {
    const newEnq: EnquiryData = {
      ...data,
      id: `enq-${Date.now()}`,
      status: "UNREAD",
      createdAt: new Date().toISOString(),
    };
    inMemoryEnquiries.unshift(newEnq);

    await NotificationService.createNotification({
      title: `New Guest Enquiry from ${newEnq.name}`,
      type: "ENQUIRY",
      read: false,
      detailsUrl: "/admin/enquiries",
    });

    return newEnq;
  },

  async markAsRead(id: string): Promise<void> {
    inMemoryEnquiries = inMemoryEnquiries.map((e) => (e.id === id ? { ...e, status: "READ" } : e));
  },

  async replyToEnquiry(id: string, replyMessage: string, assignedTo = "Manager"): Promise<EnquiryData> {
    const target = inMemoryEnquiries.find((e) => e.id === id);
    if (!target) throw new Error("Enquiry not found");
    target.status = "REPLIED";
    target.reply = replyMessage;
    target.assignedTo = assignedTo;
    target.repliedAt = new Date().toISOString();
    return target;
  },

  async deleteEnquiry(id: string): Promise<void> {
    inMemoryEnquiries = inMemoryEnquiries.filter((e) => e.id !== id);
  },
};
