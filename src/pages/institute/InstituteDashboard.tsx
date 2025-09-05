import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, FileText, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { sarApplications } from '@/lib/data';

export default function InstituteDashboard() {
  const navigate = useNavigate();
  const [applicationProgresses, setApplicationProgresses] = useState<{[key: string]: number}>({});
  const [isSARApplicationsCollapsed, setIsSARApplicationsCollapsed] = useState(false);

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
    
    // Also listen for custom events from the form
    const handleProgressUpdate = (event: CustomEvent) => {
      loadProgressData();
    };

    window.addEventListener('progressUpdate', handleProgressUpdate as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('progressUpdate', handleProgressUpdate as EventListener);
    };
  }, []);

  // Calculate overall statistics
  const calculateStats = () => {
    const totalApplications = sarApplications.length + 1; // +1 for Institute Information
    const allProgresses = [
      applicationProgresses['RGUKT-IS-20250905'] || 0,
      ...sarApplications.map(app => applicationProgresses[app.id] || 0)
    ];
    
    const completed = allProgresses.filter(progress => progress === 100).length;
    const inProgress = allProgresses.filter(progress => progress > 0 && progress < 100).length;
    const notStarted = allProgresses.filter(progress => progress === 0).length;
    
    const overallProgress = allProgresses.length > 0 
      ? Math.round(allProgresses.reduce((sum, progress) => sum + progress, 0) / allProgresses.length)
      : 0;

    return {
      totalApplications,
      completed,
      inProgress,
      notStarted,
      overallProgress
    };
  };

  const stats = calculateStats();

  // Calculate days remaining (60 days from today)
  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(startDate.getDate() + 60);
  const daysRemaining = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getStatusColor = (progress: number) => {
    if (progress === 0) return 'bg-gray-400';
    if (progress < 100) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStatusText = (progress: number) => {
    if (progress === 0) return 'Draft';
    if (progress === 100) return 'Completed';
    return 'In Progress';
  };

  const getStatusVariant = (progress: number): "default" | "secondary" | "destructive" | "outline" => {
    if (progress === 0) return 'outline';
    if (progress === 100) return 'default';
    return 'outline';
  };

  const handleViewApplication = (applicationId: string) => {
    navigate('/institute/sar-applications');
  };

  // Create applications array with Institute Information first
  const allApplications = [
    {
      id: 'RGUKT-IS-20250905',
      departmentName: 'Institute Information',
      applicationId: 'RGUKT-IS-20250905',
      completionPercentage: applicationProgresses['RGUKT-IS-20250905'] || 0
    },
    ...sarApplications.map(app => ({
      id: app.id,
      departmentName: app.department,
      applicationId: app.id,
      completionPercentage: applicationProgresses[app.id] || 0
    }))
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Institute Dashboard</h1>
          <p className="text-gray-600 mt-1">Track your NBA accreditation progress</p>
        </div>
        <Button 
          onClick={() => navigate('/institute/sar-applications')}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <FileText className="w-4 h-4 mr-2" />
          View SAR Applications
        </Button>
      </div>

      {/* Timeline Card */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            Application Timeline
          </CardTitle>
          <CardDescription>
            60-day accreditation process timeline
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{formatDate(startDate)}</div>
              <div className="text-sm text-green-700">Start Date</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{daysRemaining}</div>
              <div className="text-sm text-blue-700">Days Remaining</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{formatDate(endDate)}</div>
              <div className="text-sm text-orange-700">Target End Date</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Application Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Current Application Status
          </CardTitle>
          <CardDescription>
            Real-time progress of your SAR applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Overall Progress */}
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
              <div className="text-3xl font-bold text-blue-600 mb-2">{stats.overallProgress}%</div>
              <div className="text-sm text-blue-700 font-medium">Overall Progress</div>
              <Progress value={stats.overallProgress} className="mt-2 h-2" />
            </div>

            {/* Total Applications */}
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
              <div className="text-3xl font-bold text-purple-600 mb-2">{stats.totalApplications}</div>
              <div className="text-sm text-purple-700 font-medium">Total Applications</div>
              <div className="flex justify-center mt-2">
                <FileText className="w-5 h-5 text-purple-500" />
              </div>
            </div>

            {/* Completed */}
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
              <div className="text-3xl font-bold text-green-600 mb-2">{stats.completed}</div>
              <div className="text-sm text-green-700 font-medium">Completed</div>
              <div className="flex justify-center mt-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
            </div>

            {/* In Progress */}
            <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg">
              <div className="text-3xl font-bold text-yellow-600 mb-2">{stats.inProgress}</div>
              <div className="text-sm text-yellow-700 font-medium">In Progress</div>
              <div className="flex justify-center mt-2">
                <Clock className="w-5 h-5 text-yellow-500" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SAR Applications */}
      {allApplications.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>SAR Applications</CardTitle>
                <CardDescription>
                  Your department-wise SAR application progress
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSARApplicationsCollapsed(!isSARApplicationsCollapsed)}
                className="h-8 w-8 p-0"
              >
                {isSARApplicationsCollapsed ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronUp className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardHeader>
          {!isSARApplicationsCollapsed && (
            <CardContent>
              <div className="space-y-3">
                {allApplications.map((app) => (
                  <Card 
                    key={app.id} 
                    className="bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
                    onClick={() => handleViewApplication(app.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 flex-1">
                          <div className={`w-3 h-3 rounded-full ${getStatusColor(app.completionPercentage)}`}></div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{app.departmentName}</h4>
                            <p className="text-sm text-gray-600">{app.applicationId}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Badge variant={getStatusVariant(app.completionPercentage)}>
                            {getStatusText(app.completionPercentage)}
                          </Badge>
                          <div className="text-right min-w-[100px]">
                            <div className="flex justify-between text-xs text-gray-600 mb-1">
                              <span>Progress</span>
                              <span>{app.completionPercentage}%</span>
                            </div>
                            <Progress value={app.completionPercentage} className="h-1 w-24" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          )}
        </Card>
      )}
    </div>
  );
}