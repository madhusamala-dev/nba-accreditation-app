import { Institution, User, SARApplication, Department, Application } from './types';

// Mock data for institutions - complete structure with all required fields
export const institutions: Institution[] = [
  {
    id: '1',
    name: 'RGUKT Basar',
    aisheCode: 'U-0001',
    institutionCode: 'RGUKT',
    tierCategory: 'Tier I',
    institutionCategory: 'Engineering',
    email: 'rgukt@example.com',
    address: 'Basar, Telangana',
    registeredDate: '2024-01-15T00:00:00.000Z',
    status: 'registered',
    establishedYear: 2008,
    coordinatorName: 'Dr. Rajesh Kumar',
    coordinatorEmail: 'coordinator@rgukt.ac.in',
    coordinatorPhone: '+91-9876543210',
    preQualifiersCompleted: true,
    nbaCoordinator: {
      name: 'Dr. Rajesh Kumar',
      contactNumber: '+91-9876543210',
      email: 'coordinator@rgukt.ac.in',
      designation: 'Professor'
    }
  },
  {
    id: '2',
    name: 'VIT University',
    aisheCode: 'U-0002',
    institutionCode: 'VIT',
    tierCategory: 'Tier I',
    institutionCategory: 'Engineering',
    email: 'vit@example.com',
    address: 'Vellore, Tamil Nadu',
    registeredDate: '2024-01-10T00:00:00.000Z',
    status: 'registered',
    establishedYear: 1984,
    coordinatorName: 'Dr. Priya Sharma',
    coordinatorEmail: 'coordinator@vit.ac.in',
    coordinatorPhone: '+91-9876543211',
    preQualifiersCompleted: true,
    nbaCoordinator: {
      name: 'Dr. Priya Sharma',
      contactNumber: '+91-9876543211',
      email: 'coordinator@vit.ac.in',
      designation: 'Professor'
    }
  },
  {
    id: '3',
    name: 'IIT Delhi',
    aisheCode: 'U-0003',
    institutionCode: 'IITD',
    tierCategory: 'Tier I',
    institutionCategory: 'Engineering',
    email: 'iit@example.com',
    address: 'New Delhi',
    registeredDate: '2024-01-05T00:00:00.000Z',
    status: 'registered',
    establishedYear: 1961,
    coordinatorName: 'Dr. Amit Singh',
    coordinatorEmail: 'coordinator@iitd.ac.in',
    coordinatorPhone: '+91-9876543212',
    preQualifiersCompleted: true,
    nbaCoordinator: {
      name: 'Dr. Amit Singh',
      contactNumber: '+91-9876543212',
      email: 'coordinator@iitd.ac.in',
      designation: 'Professor'
    }
  }
];

// Mock departments data
export const departments: Department[] = [
  // Engineering Departments
  { id: 'CSE', name: 'Computer Science and Engineering', category: 'Engineering' },
  { id: 'ECE', name: 'Electronics and Communication Engineering', category: 'Engineering' },
  { id: 'EEE', name: 'Electrical and Electronics Engineering', category: 'Engineering' },
  { id: 'MECH', name: 'Mechanical Engineering', category: 'Engineering' },
  { id: 'CIVIL', name: 'Civil Engineering', category: 'Engineering' },
  { id: 'CHEM', name: 'Chemical Engineering', category: 'Engineering' },
  { id: 'AERO', name: 'Aeronautical Engineering', category: 'Engineering' },
  { id: 'AUTO', name: 'Automobile Engineering', category: 'Engineering' },
  { id: 'BIOTECH', name: 'Biotechnology', category: 'Engineering' },
  { id: 'IT', name: 'Information Technology', category: 'Engineering' },
  
  // MBA Departments
  { id: 'MBA-FIN', name: 'MBA - Finance', category: 'MBA' },
  { id: 'MBA-MKT', name: 'MBA - Marketing', category: 'MBA' },
  { id: 'MBA-HR', name: 'MBA - Human Resources', category: 'MBA' },
  { id: 'MBA-OPS', name: 'MBA - Operations', category: 'MBA' },
  { id: 'MBA-IT', name: 'MBA - Information Technology', category: 'MBA' },
  { id: 'MBA-IB', name: 'MBA - International Business', category: 'MBA' }
];

// Storage key for SAR applications
const SAR_APPLICATIONS_KEY = 'compliedu_sar_applications';

// Get SAR applications from localStorage
const getSARApplicationsFromStorage = (): SARApplication[] => {
  try {
    const stored = localStorage.getItem(SAR_APPLICATIONS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading SAR applications from storage:', error);
    return [];
  }
};

// Save SAR applications to localStorage
const saveSARApplicationsToStorage = (applications: SARApplication[]): void => {
  try {
    localStorage.setItem(SAR_APPLICATIONS_KEY, JSON.stringify(applications));
    console.log('SAR applications saved to storage:', applications.length);
  } catch (error) {
    console.error('Error saving SAR applications to storage:', error);
  }
};

// Export sarApplications as a getter function that reads from localStorage
export const sarApplications = getSARApplicationsFromStorage();

export const getInstitutionById = (id: string): Institution | undefined => {
  console.log('getInstitutionById called with ID:', id);
  console.log('Available institutions:', institutions.map(i => ({ id: i.id, name: i.name })));
  
  const found = institutions.find(inst => inst.id === id);
  console.log('Found institution:', found);
  return found;
};

export const getInstitutions = (): Institution[] => {
  return institutions;
};

export const addInstitution = (institution: Omit<Institution, 'id'>): Institution => {
  const newInstitution: Institution = {
    ...institution,
    id: (institutions.length + 1).toString()
  };
  
  institutions.push(newInstitution);
  console.log('Added new institution:', newInstitution);
  return newInstitution;
};

export const getDepartmentsByCategory = (category: string): Department[] => {
  return departments.filter(dept => dept.category === category);
};

export const getSARApplicationsByInstitution = (institutionId: string): SARApplication[] => {
  const allApplications = getSARApplicationsFromStorage();
  const institutionApps = allApplications.filter(app => app.institutionId === institutionId);
  console.log(`Found ${institutionApps.length} applications for institution ${institutionId}:`, institutionApps);
  return institutionApps;
};

// Function to get applications (for backward compatibility with InstituteDashboard)
export const getApplications = (): Application[] => {
  // Convert SAR applications to Application format for dashboard
  const sarApplications = getSARApplicationsFromStorage();
  return sarApplications.map(sarApp => ({
    id: sarApp.id,
    institutionId: sarApp.institutionId,
    applicationId: sarApp.applicationId,
    title: sarApp.departmentName,
    type: sarApp.departmentId === 'institute-info' ? 'Institute Information' : 'Department SAR',
    status: sarApp.status,
    progress: sarApp.completionPercentage,
    dueDate: new Date(new Date(sarApp.applicationStartDate).getTime() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days from start
    lastModified: sarApp.lastModifiedDate,
    createdDate: sarApp.applicationStartDate
  }));
};

export const createSARApplications = (
  institutionId: string,
  departmentIds: string[],
  createdBy: string
): SARApplication[] => {
  const institution = getInstitutionById(institutionId);
  if (!institution) {
    throw new Error('Institution not found');
  }

  const today = new Date();
  const dateString = today.toISOString().split('T')[0].replace(/-/g, '');
  
  const newApplications: SARApplication[] = departmentIds.map(departmentId => {
    const department = departments.find(d => d.id === departmentId);
    if (!department) {
      throw new Error(`Department ${departmentId} not found`);
    }

    return {
      id: `${institutionId}-${departmentId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      applicationId: `${institution.institutionCode}-${departmentId}-${dateString}`,
      institutionId,
      departmentId,
      departmentName: department.name,
      status: 'draft',
      completionPercentage: 0,
      applicationStartDate: today.toISOString(),
      lastModifiedDate: today.toISOString(),
      lastModifiedBy: createdBy
    };
  });

  // Get existing applications and add new ones
  const existingApplications = getSARApplicationsFromStorage();
  const updatedApplications = [...existingApplications, ...newApplications];
  
  // Save to localStorage
  saveSARApplicationsToStorage(updatedApplications);
  
  console.log('Created new SAR applications:', newApplications);
  return newApplications;
};

// New function to create institute information application
export const createInstituteInfoApplication = (
  institutionId: string,
  createdBy: string
): SARApplication => {
  const institution = getInstitutionById(institutionId);
  if (!institution) {
    throw new Error('Institution not found');
  }

  const today = new Date();
  const dateString = today.toISOString().split('T')[0].replace(/-/g, '');
  
  const instituteInfoApp: SARApplication = {
    id: `institute-info-${institutionId}-${Date.now()}`,
    applicationId: `${institution.institutionCode}-IS-${dateString}`,
    institutionId,
    departmentId: 'institute-info',
    departmentName: 'Institute Information',
    status: 'draft',
    completionPercentage: 0,
    applicationStartDate: today.toISOString(),
    lastModifiedDate: today.toISOString(),
    lastModifiedBy: createdBy
  };

  // Get existing applications and add new one
  const existingApplications = getSARApplicationsFromStorage();
  const updatedApplications = [...existingApplications, instituteInfoApp];
  
  // Save to localStorage
  saveSARApplicationsToStorage(updatedApplications);
  
  console.log('Created institute information application:', instituteInfoApp);
  return instituteInfoApp;
};

// Function to update SAR application
export const updateSARApplication = (
  applicationId: string,
  updates: Partial<SARApplication>
): SARApplication | null => {
  const existingApplications = getSARApplicationsFromStorage();
  const applicationIndex = existingApplications.findIndex(app => app.id === applicationId);
  
  if (applicationIndex === -1) {
    console.error('Application not found:', applicationId);
    return null;
  }
  
  const updatedApplication = {
    ...existingApplications[applicationIndex],
    ...updates,
    lastModifiedDate: new Date().toISOString()
  };
  
  existingApplications[applicationIndex] = updatedApplication;
  saveSARApplicationsToStorage(existingApplications);
  
  console.log('Updated SAR application:', updatedApplication);
  return updatedApplication;
};

// Dashboard stats function for admin
export const getDashboardStats = () => {
  const allApplications = getSARApplicationsFromStorage();
  
  const stats = {
    totalInstitutions: institutions.length,
    totalRegistered: institutions.length,
    totalApplications: allApplications.length,
    completedApplications: allApplications.filter(app => app.status === 'completed').length,
    inProgressApplications: allApplications.filter(app => app.status === 'in-progress').length,
    draftApplications: allApplications.filter(app => app.status === 'draft').length,
    submittedApplications: allApplications.filter(app => app.status === 'submitted').length,
    preQualifiersOngoing: 0,
    preQualifiersCompleted: institutions.filter(inst => inst.preQualifiersCompleted).length,
    sarOngoing: allApplications.filter(app => app.status === 'in-progress').length,
    sarCompleted: allApplications.filter(app => app.status === 'completed').length
  };
  
  return stats;
};