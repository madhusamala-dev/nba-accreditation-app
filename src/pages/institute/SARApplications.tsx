import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { sarApplications } from '@/lib/data';
import InstituteInformationForm from './InstituteInformationForm';

export default function SARApplications() {
  const [selectedApplication, setSelectedApplication] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isNewApplicationOpen, setIsNewApplicationOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [applicationProgresses, setApplicationProgresses] = useState<{[key: string]: number}>({});

  // Load saved progress data from localStorage
  useEffect(() => {
    const loadProgressData = () => {
      const progresses: {[key: string]: number} = {};
      
      // Add Institute Information with specific ID
      const instituteData = localStorage.getItem('institute_form_RGUKT-IS-20250905');
      if (instituteData) {
        const parsed = JSON.parse(instituteData);
        progresses['RGUKT-IS-20250905'] = parsed.progress || 0;
      } else {
        progresses['RGUKT-IS-20250905'] = 0;
      }
      
      sarApplications.forEach(app => {
        const savedData = localStorage.getItem(`institute_form_${app.id}`);
        if (savedData) {
          const parsed = JSON.parse(savedData);
          progresses[app.id] = parsed.progress || 0;
        } else {
          progresses[app.id] = 0;
        }
      });
      
      setApplicationProgresses(progresses);
    };

    loadProgressData();

    // Listen for storage changes to update progress in real-time
    const handleStorageChange = () => {
      loadProgressData();
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleProgressUpdate = (applicationId: string, progress: number) => {
    setApplicationProgresses(prev => ({
      ...prev,
      [applicationId]: progress
    }));

    // Dispatch custom event for dashboard to listen
    window.dispatchEvent(new CustomEvent('progressUpdate', { 
      detail: { applicationId, progress } 
    }));
  };

  const handleFillForm = (applicationId: string) => {
    setSelectedApplication(applicationId);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedApplication(null);
  };

  const handleCreateNewApplication = () => {
    if (selectedDepartment) {
      // Here you would typically create a new application
      console.log('Creating new application for:', selectedDepartment);
      setIsNewApplicationOpen(false);
      setSelectedDepartment('');
    }
  };

  const getStatusText = (progress: number) => {
    if (progress === 0) return 'Draft';
    if (progress === 100) return 'Completed';
    return 'In Progress';
  };

  const getStatusVariant = (progress: number): "default" | "secondary" | "destructive" | "outline" => {
    if (progress === 0) return 'secondary';
    if (progress === 100) return 'default';
    return 'outline';
  };

  const getProgressColor = (progress: number) => {
    if (progress === 0) return 'bg-gray-300';
    if (progress < 25) return 'bg-red-500';
    if (progress < 50) return 'bg-orange-500';
    if (progress < 75) return 'bg-yellow-500';
    if (progress < 100) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const departments = [
    'Computer Science Engineering',
    'Electronics and Communication Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Electrical Engineering',
    'Information Technology',
    'Chemical Engineering',
    'Biotechnology'
  ];

  // Create applications array with Institute Information first
  const allApplications = [
    {
      id: 'RGUKT-IS-20250905',
      department: 'Institute Information',
      title: 'Institute Information (RGUKT-IS-20250905)'
    },
    ...sarApplications.map(app => ({
      id: app.id,
      department: app.department,
      title: `${app.department} (${app.id})`
    }))
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">SAR Applications</h1>
          <p className="text-gray-600 mt-1">Your department-wise SAR application progress</p>
        </div>
        <Dialog open={isNewApplicationOpen} onOpenChange={setIsNewApplicationOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              New Application
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New SAR Application</DialogTitle>
              <DialogDescription>
                Select a department to create a new Self Assessment Report application.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Department</label>
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsNewApplicationOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateNewApplication} disabled={!selectedDepartment}>
                  Create Application
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {allApplications.map((application) => {
          const progress = applicationProgresses[application.id] || 0;
          return (
            <Card 
              key={application.id} 
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleFillForm(application.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  {/* Left: Dot and Title */}
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-3 h-3 bg-gray-400 rounded-full flex-shrink-0"></div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{application.title}</h3>
                    </div>
                  </div>

                  {/* Center: Status */}
                  <div className="flex justify-center flex-1">
                    <Badge variant={getStatusVariant(progress)}>
                      {getStatusText(progress)}
                    </Badge>
                  </div>

                  {/* Right: Progress */}
                  <div className="flex items-center gap-3 flex-1 justify-end">
                    <span className="text-sm font-medium text-gray-700">{progress}%</span>
                    <div className="w-24">
                      <Progress 
                        value={progress} 
                        className="h-2"
                        style={{
                          '--progress-background': getProgressColor(progress)
                        } as React.CSSProperties}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Institute Information Form Dialog */}
      {selectedApplication && (
        <InstituteInformationForm
          isOpen={isFormOpen}
          onClose={handleCloseForm}
          applicationId={selectedApplication}
          onProgressUpdate={handleProgressUpdate}
        />
      )}
    </div>
  );
}