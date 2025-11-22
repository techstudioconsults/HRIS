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

export interface TeamApiResponse {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface RoleApiResponse {
  id: string;
  name: string;
  teamId: string;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}

// Domain models
export interface Role {
  id: string;
  name: string;
  teamId: string;
  permissions: string[];
}

export interface Team {
  id: string;
  name: string;
  roles: Role[];
}
