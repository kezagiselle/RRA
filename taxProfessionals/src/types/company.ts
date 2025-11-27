// src/types/company.ts

export enum AccountType {
  INDIVIDUAL = "INDIVIDUAL",
  COMPANY = "COMPANY",
}

export interface CompanyMember {
  memberId?: number;
  tpin: string;
  nid: string;
  fullName: string;
  phoneNumber: string;
  status?: string;
  applicationDate?: string;
}

export interface CompanyAccount {
  companyId: number;
  companyTin: string;
  companyName: string;
  companyEmail: string;
  members: CompanyMember[];
}

export interface CompanyRegistrationData {
  companyTin: string;
  companyName: string;
  companyEmail: string;
  password: string;
  numberOfApplicants?: number;
  provinceId: number;
  districtId: number;
  sectorId: number;
  cellId: number;
  villageId: number;
  applicants?: Array<{
    nid: string;
    fullName: string;
    phoneNumber: string;
  }>;
}

export interface AddMemberData {
  nid: string;
  fullName: string;
  phoneNumber: string;
}

