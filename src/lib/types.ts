export interface User {
  id: string;
  email: string;
  password: string;
  role: 'admin' | 'institute';
  institutionId?: string;
}

export interface Institution {
  id: string;
  name: string;
  aisheCode?: string;
  institutionCode: string;
  tierCategory?: string;
  institutionCategory: string;
  email?: string;
  password?: string;
  nbaCoordinator?: {
    name: string;
    designation: string;
    email: string;
    contactNumber: string;
  };
  chairman?: {
    name: string;
    designation: string;
    email: string;
    contactNumber: string;
  };
  address: string;
  registeredDate?: string;
  status?: string;
  completionPercentage?: number;
  lastUpdated?: string;
  establishedYear: number;
  coordinatorName: string;
  coordinatorEmail: string;
  coordinatorPhone: string;
}

export interface Application {
  id: string;
  institutionId?: string;
  applicationId?: string;
  title?: string;
  type?: string;
  programs?: string[];
  sars?: string[];
  createdDate: string;
  status: string;
  progress?: number;
  dueDate?: string;
  lastModified?: string;
}

export interface SARApplication {
  id: string;
  institutionId: string;
  applicationId: string;
  departmentId: string;
  departmentName: string;
  applicationStartDate: string;
  lastModifiedDate: string;
  lastModifiedBy: string;
  status: 'draft' | 'in-progress' | 'completed' | 'submitted';
  completionPercentage: number;
}

export interface Department {
  id: string;
  name: string;
  category: string;
}