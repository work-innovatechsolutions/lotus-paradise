import { NotificationService } from "./notification.service";

export interface CorporateLeadData {
  id: string;
  company: string;
  contactPerson: string;
  email: string;
  phone: string;
  employeesCount: number;
  preferredDates: string;
  budgetRange: string;
  requirements?: string;
  status: "NEW" | "PROPOSAL_SENT" | "CLOSED_WON";
  createdAt: string;
}

let inMemoryLeads: CorporateLeadData[] = [
  {
    id: "corp-1",
    company: "TechNova Analytics",
    contactPerson: "Rahul Sengupta",
    email: "rahul@technova.io",
    phone: "+91 98765 43210",
    employeesCount: 16,
    preferredDates: "Oct 12 - Oct 15, 2026",
    budgetRange: "₹2.5L - ₹3L",
    requirements: "Strategy offsite, bonfire night, guided birding hike, audio-visual setup.",
    status: "NEW",
    createdAt: new Date().toISOString(),
  },
];

export const CorporateService = {
  async getAllLeads(): Promise<CorporateLeadData[]> {
    return [...inMemoryLeads];
  },

  async createLead(data: Omit<CorporateLeadData, "id" | "status" | "createdAt">): Promise<CorporateLeadData> {
    const created: CorporateLeadData = {
      ...data,
      id: `corp-${Date.now()}`,
      status: "NEW",
      createdAt: new Date().toISOString(),
    };
    inMemoryLeads.unshift(created);

    await NotificationService.createNotification({
      title: `New B2B Corporate Offsite Inquiry from ${created.company}`,
      type: "CORPORATE_LEAD",
      read: false,
      detailsUrl: "/admin/corporate-leads",
    });

    return created;
  },

  async updateLeadStatus(id: string, status: "NEW" | "PROPOSAL_SENT" | "CLOSED_WON"): Promise<CorporateLeadData> {
    const target = inMemoryLeads.find((l) => l.id === id);
    if (!target) throw new Error("Lead not found");
    target.status = status;
    return target;
  },
};
