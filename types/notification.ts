export interface AdminNotification {
  id: string;
  title: string;
  type: "BOOKING" | "ENQUIRY" | "CORPORATE_LEAD";
  read: boolean;
  createdAt: string;
  detailsUrl?: string;
}
