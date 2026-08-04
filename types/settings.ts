export interface SiteGeneralSettings {
  phone1: string;
  phone2: string;
  whatsappNumber: string;
  email: string;
  address: string;
  mapUrl: string;
  seoKeywords: string;
}

export interface HomepageSectionConfig {
  id: string;
  name: string;
  enabled: boolean;
  order: number;
}
