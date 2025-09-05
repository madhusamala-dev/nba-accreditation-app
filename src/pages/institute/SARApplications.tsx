import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Calendar, User, ExternalLink, Plus, X, CheckCircle } from 'lucide-react';
import InstituteLayout from '@/components/InstituteLayout';
import InstituteInformationForm from './InstituteInformationForm';

interface SARApplication {
  applicationId: string;
  department: string;
  status: string;
  progress: number;
  startDate: string;
  lastModified: string;
  modifiedBy: string;
}

export default function SARApplications() {
  const [selectedApplicationId, setSelectedApplicationId] = useState<string>('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [showDepartmentSelection, setShowDepartmentSelection] = useState(false);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);

  // Institute Information data with state for progress tracking
  const [instituteInfo, setInstituteInfo] = useState({
    applicationId: 'RGUKT-IS-20250905',
    department: 'Institute Information',
    status: 'Draft',
    progress: 0,
    startDate: '6 Sept 2025',
    lastModified: '6 Sept 2025',
    modifiedBy: 'rgukt@example.com'
  });

  // Department SAR Applications data - now using state to allow adding new applications
  const [departmentApplications, setDepartmentApplications] = useState<SARApplication[]>([
    {
      applicationId: 'RGUKT-CSE-20250905',
      department: 'Computer Science and Engineering',
      status: 'Draft',
      progress: 0,
      startDate: '6 Sept 2025',
      lastModified: '6 Sept 2025',
      modifiedBy: 'rgukt@example.com'
    },
    {
      applicationId: 'RGUKT-ECE-20250905',
      department: 'Electronics and Communication Engineering',
      status: 'Draft',
      progress: 0,
      startDate: '6 Sept 2025',
      lastModified: '6 Sept 2025',
      modifiedBy: 'rgukt@example.com'
    }
  ]);

  const handleProgressUpdate = (applicationId: string, progress: number) => {
    // Update institute info progress
    if (applicationId === instituteInfo.applicationId) {
      setInstituteInfo(prev => ({
        ...prev,
        progress,
        lastModified: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
      }));
    } else {
      // Update department application progress
      setDepartmentApplications(prev => 
        prev.map(app => 
          app.applicationId === applicationId 
            ? { 
                ...app, 
                progress, 
                lastModified: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
              }
            : app
        )
      );
    }
  };

  const handleFillForm = (applicationId: string) => {
    setSelectedApplicationId(applicationId);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedApplicationId('');
  };

  const handleStartNewApplication = () => {
    setShowDepartmentSelection(true);
    setSelectedDepartments([]);
  };

  const handleCloseDepartmentSelection = () => {
    setShowDepartmentSelection(false);
    setSelectedDepartments([]);
  };

  const handleDepartmentToggle = (departmentCode: string, checked: boolean) => {
    if (checked) {
      setSelectedDepartments(prev => [...prev, departmentCode]);
    } else {
      setSelectedDepartments(prev => prev.filter(code => code !== departmentCode));
    }
  };

  const handleCreateApplications = () => {
    if (selectedDepartments.length === 0) {
      alert('Please select at least one department to create SAR applications.');
      return;
    }

    const currentDate = new Date();
    const dateString = currentDate.toISOString().slice(0, 10).replace(/-/g, '');
    const formattedDate = currentDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

    const newApplications: SARApplication[] = selectedDepartments.map(deptCode => {
      const department = departments.find(d => d.code === deptCode);
      const newApplicationId = `RGUKT-${deptCode}-${dateString}`;

      return {
        applicationId: newApplicationId,
        department: department?.name || '',
        status: 'Draft',
        progress: 0,
        startDate: formattedDate,
        lastModified: formattedDate,
        modifiedBy: 'rgukt@example.com'
      };
    });

    // Add all new applications to the list
    setDepartmentApplications(prev => [...prev, ...newApplications]);
    
    // Close department selection and reset
    setShowDepartmentSelection(false);
    setSelectedDepartments([]);
    
    // Show success message
    const applicationIds = newApplications.map(app => app.applicationId).join(', ');
    alert(`${newApplications.length} SAR Application(s) created successfully!\nApplication IDs: ${applicationIds}`);
  };

  const departments = [
    { name: 'Computer Science and Engineering', code: 'CSE', icon: '💻' },
    { name: 'Electronics and Communication Engineering', code: 'ECE', icon: '📡' },
    { name: 'Electrical and Electronics Engineering', code: 'EEE', icon: '⚡' },
    { name: 'Mechanical Engineering', code: 'MECH', icon: '⚙️' },
    { name: 'Civil Engineering', code: 'CIVIL', icon: '🏗️' },
    { name: 'Chemical Engineering', code: 'CHEM', icon: '🧪' },
    { name: 'Information Technology', code: 'IT', icon: '🌐' },
    { name: 'Biotechnology', code: 'BT', icon: '🧬' },
    { name: 'Metallurgical Engineering', code: 'MET', icon: '🔩' },
    { name: 'Aerospace Engineering', code: 'AERO', icon: '✈️' }
  ];

  // Filter out departments that already have applications
  const availableDepartments = departments.filter(dept => 
    !departmentApplications.some(app => app.department === dept.name)
  );

  if (showDepartmentSelection) {
    return (
      <InstituteLayout>
        <div className="space-y-6">
          {/* Header with close button */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create New SAR Applications</h1>
              <p className="text-gray-600 mt-2">
                Select departments to create Self Assessment Report applications
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={handleCloseDepartmentSelection}
              className="flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Cancel
            </Button>
          </div>

          {/* Department Selection Checklist */}
          <div className="bg-white border rounded-lg p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-4">
                <h3 className="text-lg font-semibold text-gray-900">Available Departments</h3>
                <div className="text-sm text-gray-600">
                  {selectedDepartments.length} of {availableDepartments.length} selected
                </div>
              </div>

              {availableDepartments.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {availableDepartments.map((department) => (
                    <div 
                      key={department.code} 
                      className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Checkbox
                        id={department.code}
                        checked={selectedDepartments.includes(department.code)}
                        onCheckedChange={(checked) => 
                          handleDepartmentToggle(department.code, checked as boolean)
                        }
                      />
                      <div className="flex items-center space-x-3 flex-1">
                        <span className="text-2xl">{department.icon}</span>
                        <div>
                          <Label 
                            htmlFor={department.code} 
                            className="text-sm font-medium text-gray-900 cursor-pointer"
                          >
                            {department.name}
                          </Label>
                          <p className="text-xs text-gray-500">Code: {department.code}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🎉</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">All Departments Covered!</h3>
                  <p className="text-gray-600">
                    SAR applications have been created for all available departments.
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {availableDepartments.length > 0 && (
              <div className="flex justify-between items-center pt-6 border-t mt-6">
                <div className="text-sm text-gray-600">
                  {selectedDepartments.length > 0 && (
                    <>Selected: {selectedDepartments.join(', ')}</>
                  )}
                </div>
                <div className="space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedDepartments(availableDepartments.map(d => d.code))}
                  >
                    Select All
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedDepartments([])}
                  >
                    Clear All
                  </Button>
                  <Button 
                    onClick={handleCreateApplications}
                    disabled={selectedDepartments.length === 0}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Create {selectedDepartments.length} Application{selectedDepartments.length !== 1 ? 's' : ''}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </InstituteLayout>
    );
  }

  return (
    <InstituteLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">SAR Applications</h1>
          <p className="text-gray-600 mt-2">
            Manage your Self Assessment Report applications for RGUKT Basar
          </p>
        </div>

        {/* Institute Information Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 border-2 border-gray-400 rounded flex items-center justify-center">
              <span className="text-sm font-medium">📋</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Institute Information</h2>
          </div>

          <div className="bg-white border rounded-lg overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-8 gap-4 px-6 py-3 bg-gray-50 border-b text-sm font-medium text-gray-700">
              <div>Application ID</div>
              <div>Department</div>
              <div>Status</div>
              <div>Progress</div>
              <div>Start Date</div>
              <div>Last Modified</div>
              <div>Modified By</div>
              <div>Actions</div>
            </div>

            {/* Table Row */}
            <div className="grid grid-cols-8 gap-4 px-6 py-4 items-center border-b last:border-b-0">
              <div className="text-sm font-medium text-gray-900">
                {instituteInfo.applicationId}
              </div>
              <div className="text-sm text-gray-600">
                {instituteInfo.department}
              </div>
              <div>
                <Badge variant="outline" className="bg-gray-100 text-gray-700">
                  {instituteInfo.status}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-16 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${instituteInfo.progress}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600">{instituteInfo.progress}%</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                {instituteInfo.startDate}
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                {instituteInfo.lastModified}
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <User className="w-4 h-4" />
                {instituteInfo.modifiedBy}
              </div>
              <div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleFillForm(instituteInfo.applicationId)}
                  className="flex items-center gap-1"
                >
                  <ExternalLink className="w-4 h-4" />
                  Fill
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Department SAR Applications Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Department SAR Applications</h2>
            <Button 
              className="bg-gray-900 hover:bg-gray-800 text-white"
              onClick={handleStartNewApplication}
            >
              <Plus className="w-4 h-4 mr-2" />
              Start New Application
            </Button>
          </div>

          <div className="bg-white border rounded-lg overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-8 gap-4 px-6 py-3 bg-gray-50 border-b text-sm font-medium text-gray-700">
              <div>Application ID</div>
              <div>Department</div>
              <div>Status</div>
              <div>Progress</div>
              <div>Start Date</div>
              <div>Last Modified</div>
              <div>Modified By</div>
              <div>Actions</div>
            </div>

            {/* Table Rows */}
            {departmentApplications.map((application) => (
              <div key={application.applicationId} className="grid grid-cols-8 gap-4 px-6 py-4 items-center border-b last:border-b-0">
                <div className="text-sm font-medium text-gray-900">
                  {application.applicationId}
                </div>
                <div className="text-sm text-gray-600">
                  {application.department}
                </div>
                <div>
                  <Badge variant="outline" className="bg-gray-100 text-gray-700">
                    {application.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${application.progress}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600">{application.progress}%</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  {application.startDate}
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  {application.lastModified}
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <User className="w-4 h-4" />
                  {application.modifiedBy}
                </div>
                <div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleFillForm(application.applicationId)}
                    className="flex items-center gap-1"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Fill
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Institute Information Form */}
      <InstituteInformationForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        applicationId={selectedApplicationId}
        onProgressUpdate={handleProgressUpdate}
      />
    </InstituteLayout>
  );
}