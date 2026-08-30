export interface OrganizationUser {
  id: string;
  name: string;
  email: string;
}

export interface OrganizationMember {
  id: string;
  role: string;
  user: OrganizationUser;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  plan: string;
  memberCount: number;
  members: OrganizationMember[];
}
