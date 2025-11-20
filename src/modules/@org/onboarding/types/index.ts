export interface CompanyProfile {
  id: string;
  name: string;
  industry: string;
  size: string;
  domain: string;
  address: {
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    country: string;
    postcode: string;
  };
  createdAt: string;
  updatedAt: string;
}
