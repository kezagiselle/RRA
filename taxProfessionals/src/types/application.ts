// src/types/application.ts

export enum ApplicationStatus {
  REGISTERED = "REGISTERED",
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export enum BusinessStatus {
  INDIVIDUAL = "INDIVIDUAL",
  COMPANY = "COMPANY",
}

export enum BachelorDegree {
  ACCOUNTING = "ACCOUNTING",
  LAW = "LAW",
  TAXATION = "TAXATION",
  FINANCE = "FINANCE",
  ECONOMICS = "ECONOMICS",
  COMMERCE = "COMMERCE",
}

export enum ProfessionalQualification {
  CPA = "CPA",
  ACCA = "ACCA",
  CAT = "CAT",
  OTHER = "OTHER",
}

export interface WorkAddress {
  name: string;
}

export interface Application {
  tpin: string;
  tinCompany?: string;
  nid: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  workAddress?: WorkAddress;
  businessStatus: BusinessStatus;
  bachelorDegree?: BachelorDegree;
  mastersDegree?: BachelorDegree;
  professionalQualification?: ProfessionalQualification;
  otherProfessionalDetails?: string;
  applicationDate: string;
  status: ApplicationStatus;
  reviewedBy?: string;
  reviewedAt?: string;
  approvalDate?: string;
  expiryDate?: string;
  rejectionReason?: string;
  certificateFilePath?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}
