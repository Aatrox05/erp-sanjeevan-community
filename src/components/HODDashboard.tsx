import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { DashboardCard } from './DashboardCard';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { useLeaveContext } from './LeaveContext';
import { toast } from 'sonner@2.0.3';
import { 
  Home, 
  Users, 
  CheckCircle, 
  BarChart3,
  UserCheck,
  Clock,
  TrendingUp,
  FileText,
  Calendar,
  Bell
} from 'lucide-react';
import { BookOpen } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

interface HODDashboardProps {
  onBack: () => void;
}

export function HODDashboard({ onBack }: HODDashboardProps) {
  const [activeSection, setActiveSection] = useState('dashboard');
  // Calendar/Event creation state (top-level hooks)
  const [heTitle, setHeTitle] = useState('');
  const [heDate, setHeDate] = useState('');
  const [heType, setHeType] = useState<'holiday' | 'event'>('event');
  const [heAudienceAll, setHeAudienceAll] = useState(true);
  const [heAudStudent, setHeAudStudent] = useState(false);
  const [heAudStaff, setHeAudStaff] = useState(true);
  const [heAudAdmin, setHeAudAdmin] = useState(false);

  const { 
    getLeaveRequestsByHOD, 
    updateLeaveRequest, 
    addNotification, 
    addSubstituteRequest,
    getEventsForRole,
    addEvent,
    getNotificationsByUser,
    getSyllabiForHOD,
    updateSyllabus
  } = useLeaveContext();
  
  // Mock department - in real app, this would come from user context
  const currentDepartment = 'Computer Science';
  const departmentLeaves = getLeaveRequestsByHOD(currentDepartment);
  const pendingLeaves = departmentLeaves.filter(leave => leave.hodStatus === 'pending');
  
  const availableSubstitutes = [
    { id: 'sub001', name: 'Dr. Robert Smith', subjects: ['Programming', 'Data Structures'] },
    { id: 'sub002', name: 'Prof. Jane Wilson', subjects: ['Algorithms', 'Software Engineering'] },
    { id: 'sub003', name: 'Dr. Mark Davis', subjects: ['Database Systems', 'Computer Networks'] },
    { id: 'sub004', name: 'Prof. Lisa Garcia', subjects: ['Web Development', 'Mobile Apps'] }
  ];

  const menuItems = [
    { icon: <Home className="w-4 h-4" />, label: 'Dashboard', active: activeSection === 'dashboard', onClick: () => setActiveSection('dashboard') },
    { icon: <CheckCircle className="w-4 h-4" />, label: 'Leave Approvals', active: activeSection === 'approvals', onClick: () => setActiveSection('approvals') },
    { icon: <Users className="w-4 h-4" />, label: 'Staff Management', active: activeSection === 'staff', onClick: () => setActiveSection('staff') },
    { icon: <BookOpen className="w-4 h-4" />, label: 'Courses/Syllabus', active: activeSection === 'syllabus', onClick: () => setActiveSection('syllabus') },
    { icon: <Calendar className="w-4 h-4" />, label: 'Calendar & Events', active: activeSection === 'calendar', onClick: () => setActiveSection('calendar') },
    { icon: <Bell className="w-4 h-4" />, label: 'Notifications', active: activeSection === 'notifications', onClick: () => setActiveSection('notifications') },
    { icon: <BarChart3 className="w-4 h-4" />, label: 'Analytics', active: activeSection === 'analytics', onClick: () => setActiveSection('analytics') },
  ];



  const workloadData = [
    { name: 'Dr. Johnson', classes: 18, research: 8, admin: 4 },
    { name: 'Prof. Chen', classes: 16, research: 10, admin: 6 },
    { name: 'Dr. Davis', classes: 20, research: 6, admin: 3 },
    { name: 'Dr. Wilson', classes: 14, research: 12, admin: 5 },
    { name: 'Prof. Brown', classes: 17, research: 9, admin: 4 },
  ];

  const departmentMetrics = [
    { name: 'Teaching Load', value: 85, color: '#3b82f6' },
    { name: 'Research Output', value: 72, color: '#10b981' },
    { name: 'Student Satisfaction', value: 94, color: '#f59e0b' },
    { name: 'Staff Attendance', value: 88, color: '#8b5cf6' },
  ];

  const leaveStats = [
    { name: 'Sick Leave', value: 35, color: '#ef4444' },
    { name: 'Casual Leave', value: 28, color: '#3b82f6' },
    { name: 'Personal Leave', value: 22, color: '#10b981' },
    { name: 'Other', value: 15, color: '#f59e0b' },
  ];

  const monthlyTrends = [
    { month: 'Aug', leaves: 12, attendance: 95 },
    { month: 'Sep', leaves: 8, attendance: 97 },
    { month: 'Oct', leaves: 15, attendance: 92 },
    { month: 'Nov', leaves: 10, attendance: 96 },
    { month: 'Dec', leaves: 18, attendance: 89 },
  ];

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Pending Approvals"
          value={pendingLeaves.length.toString()}
          subtitle="Leave requests"
          icon={<Clock className="w-4 h-4" />}
          trend={{ value: `${pendingLeaves.filter(l => l.priority === 'high').length} urgent`, positive: false }}
          onClick={() => setActiveSection('approvals')}
        />
        <DashboardCard
          title="Department Staff"
          value="15"
          subtitle="Active members"
          icon={<Users className="w-4 h-4" />}
          trend={{ value: "100% present", positive: true }}
        />
        <DashboardCard
          title="Avg Workload"
          value="82%"
          subtitle="This month"
          icon={<BarChart3 className="w-4 h-4" />}
          trend={{ value: "5% increase", positive: true }}
        />
        <DashboardCard
          title="Performance Score"
          value="94"
          subtitle="Department rating"
          icon={<TrendingUp className="w-4 h-4" />}
          trend={{ value: "3 points up", positive: true }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Staff Workload Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={workloadData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="classes" stackId="a" fill="#3b82f6" />
                <Bar dataKey="research" stackId="a" fill="#10b981" />
                <Bar dataKey="admin" stackId="a" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span className="text-sm">Teaching</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span className="text-sm">Research</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                <span className="text-sm">Admin</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Department Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {departmentMetrics.map((metric, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">{metric.name}</span>
                    <span className="text-sm text-gray-600">{metric.value}%</span>
                  </div>
                  <Progress value={metric.value} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border">
              <div className="flex items-center gap-3">
                <UserCheck className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium">Approved leave request</p>
                  <p className="text-sm text-gray-600">Dr. Sarah Johnson - Medical Leave</p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-700">Completed</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-yellow-600" />
                <div>
                  <p className="font-medium">Performance review submitted</p>
                  <p className="text-sm text-gray-600">Quarterly department assessment</p>
                </div>
              </div>
              <Badge className="bg-yellow-100 text-yellow-700">Pending</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium">Department meeting scheduled</p>
                  <p className="text-sm text-gray-600">Monthly staff meeting - Jan 10, 2025</p>
                </div>
              </div>
              <Badge className="bg-blue-100 text-blue-700">Scheduled</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Faculty allocation scratch state: syllabusId -> subjectId -> facultyName
  const [allocations, setAllocations] = useState<Record<string, Record<string, { name: string }>>>({});

  const renderSyllabus = () => {
    const submitted = getSyllabiForHOD();

    const setAlloc = (syllabusId: string, subjectId: string, name: string) => {
      setAllocations(prev => ({
        ...prev,
        [syllabusId]: {
          ...(prev[syllabusId] || {}),
          [subjectId]: { name }
        }
      }));
    };

    const approve = (syllabusId: string, designedByStaffId: string) => {
      const current = submitted.find(s => s.id === syllabusId);
      if (!current) return;
      const subjectAlloc = allocations[syllabusId] || {};
      const updatedSubjects = current.subjects.map(sub => ({
        ...sub,
        allocatedFacultyName: subjectAlloc[sub.id]?.name || sub.allocatedFacultyName
      }));
      updateSyllabus(syllabusId, { subjects: updatedSubjects, status: 'approved', hodComments: undefined });
      addNotification({
        userId: designedByStaffId,
        title: 'Syllabus Approved',
        message: `${current.courseName} (${current.branch} • ${current.year}) has been approved with allocations assigned.`,
        type: 'success',
        read: false
      });
    };

    const requestRevision = (syllabusId: string, designedByStaffId: string, comments: string) => {
      updateSyllabus(syllabusId, { status: 'revision_required', hodComments: comments });
      addNotification({
        userId: designedByStaffId,
        title: 'Syllabus Revision Required',
        message: comments || 'Please address the comments and resubmit.',
        type: 'warning',
        read: false
      });
    };

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Submitted Syllabi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {submitted.length === 0 && (
                <div className="text-gray-500 text-sm">No syllabi submitted for approval.</div>
              )}
              {submitted.map(s => (
                <div key={s.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">{s.courseName} • {s.branch} • {s.year}</p>
                      <p className="text-sm text-gray-600">Designed by: {s.designedByStaffName}</p>
                      {s.hodComments && <p className="text-sm text-red-600 mt-1">Previous Comments: {s.hodComments}</p>}
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-700">Submitted</Badge>
                  </div>
                  <div className="mt-3 space-y-2">
                    <Label>Allocate Faculty per Subject</Label>
                    {s.subjects.map(sub => (
                      <div key={sub.id} className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center p-2 border rounded">
                        <div className="text-sm">
                          <span className="font-medium">{sub.name}</span>
                          {sub.allocatedFacultyName && (
                            <span className="text-gray-600"> • Current: {sub.allocatedFacultyName}</span>
                          )}
                        </div>
                        <Input
                          placeholder="Allocate faculty name"
                          value={allocations[s.id]?.[sub.id]?.name || ''}
                          onChange={(e) => setAlloc(s.id, sub.id, e.target.value)}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => approve(s.id, s.designedByStaffId)}>Approve</Button>
                    <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => {
                      const c = prompt('Enter revision comments for staff') || '';
                      requestRevision(s.id, s.designedByStaffId, c);
                    }}>Request Revision</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderCalendar = () => {
    const submit = () => {
      if (!heTitle || !heDate) return;
      const audience = heAudienceAll ? 'all' : [
        ...(heAudStudent ? ['student'] : []),
        ...(heAudStaff ? ['staff'] : []),
        ...(heAudAdmin ? ['superadmin'] : [])
      ];
      addEvent({
        title: heTitle,
        date: heDate,
        type: heType,
        description: heType === 'holiday' ? 'Holiday announced by HOD' : 'Department event scheduled',
        audience: audience as any,
        createdBy: 'hod'
      });
      const targets: string[] = heAudienceAll ? ['student','staff','hod','superadmin'] : (audience as string[]);
      targets.forEach(roleId => addNotification({
        userId: roleId,
        title: heType === 'holiday' ? 'New Holiday' : 'New Event',
        message: `${heTitle} on ${new Date(heDate).toLocaleDateString()}`,
        type: 'info',
        read: false
      }));
      setHeTitle(''); setHeDate(''); setHeType('event'); setHeAudienceAll(true); setHeAudStudent(false); setHeAudStaff(true); setHeAudAdmin(false);
    };

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Events & Holidays</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-3">
                {getEventsForRole('hod').map((ev) => (
                  <div key={ev.id} className={`p-3 rounded-lg border ${ev.type === 'holiday' ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{ev.title}</p>
                        <p className="text-sm text-gray-600">{new Date(ev.date).toLocaleDateString()}</p>
                      </div>
                      <Badge className={ev.type === 'holiday' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}>
                        {ev.type === 'holiday' ? 'Holiday' : 'Event'}
                      </Badge>
                    </div>
                    {ev.description && <p className="text-sm text-gray-600 mt-1">{ev.description}</p>}
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                <h3 className="font-medium">Schedule Holiday/Event</h3>
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input placeholder="e.g. Dept. Review Meeting" value={heTitle} onChange={(e) => setHeTitle(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input type="date" value={heDate} onChange={(e) => setHeDate(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select value={heType} onValueChange={(v) => setHeType(v as 'holiday' | 'event')}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="holiday">Holiday</SelectItem>
                      <SelectItem value="event">Event</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Audience</Label>
                  <div className="space-y-2 p-3 border rounded-md">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" checked={heAudienceAll} onChange={(e) => setHeAudienceAll(e.target.checked)} />
                      <span>All Portals</span>
                    </label>
                    {!heAudienceAll && (
                      <div className="grid grid-cols-2 gap-2 pl-6">
                        <label className="flex items-center gap-2">
                          <input type="checkbox" checked={heAudStudent} onChange={(e) => setHeAudStudent(e.target.checked)} />
                          <span>Students</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" checked={heAudStaff} onChange={(e) => setHeAudStaff(e.target.checked)} />
                          <span>Staff</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" checked={heAudAdmin} onChange={(e) => setHeAudAdmin(e.target.checked)} />
                          <span>Admin</span>
                        </label>
                      </div>
                    )}
                  </div>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={submit}>Announce</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderNotifications = () => {
    const hodNotifications = getNotificationsByUser('hod');
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {hodNotifications.length === 0 && (
                <div className="text-center py-8 text-gray-500">No notifications</div>
              )}
              {hodNotifications.map((n) => (
                <div key={n.id} className="p-3 border rounded-lg flex items-start justify-between">
                  <div>
                    <p className="font-medium">{n.title}</p>
                    <p className="text-sm text-gray-600">{n.message}</p>
                  </div>
                  <Badge className={
                    n.type === 'success' ? 'bg-green-100 text-green-700' :
                    n.type === 'warning' ? 'bg-yellow-100 text-yellow-700' :
                    n.type === 'error' ? 'bg-red-100 text-red-700' :
                    'bg-blue-100 text-blue-700'
                  }>
                    {n.type}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const handleApproveLeave = (leaveId: string, substituteTeacher?: string, comments?: string) => {
    const leave = departmentLeaves.find(l => l.id === leaveId);
    if (!leave) return;

    // If the request originated from a student, make HOD approval final
    if (leave.requestedBy === 'student') {
      updateLeaveRequest(leaveId, {
        hodStatus: 'approved',
        adminStatus: 'approved',
        hodComments: comments,
        substituteTeacher: substituteTeacher
      });

      addNotification({
        userId: leave.staffId,
        title: 'Leave Approved by HOD (Final)',
        message: `Your leave request for ${leave.startDate} to ${leave.endDate} has been finally approved by HOD.`,
        type: 'success',
        read: false
      });

      if (substituteTeacher) {
        const substitute = availableSubstitutes.find(s => s.name === substituteTeacher);
        if (substitute) {
          addSubstituteRequest({
            leaveRequestId: leaveId,
            teacherName: substitute.name,
            teacherId: substitute.id,
            subject: leave.leaveType === 'Conference' ? 'Various' : 'Regular Classes',
            classes: [`${leave.staffName}'s Classes`],
            dates: [leave.startDate, leave.endDate],
            status: 'pending'
          });
        }
      }

      toast.success(`Leave finally approved for ${leave.staffName}`);
      return;
    }

    // Existing flow for staff-originated requests (forward to Admin)
    updateLeaveRequest(leaveId, {
      hodStatus: 'approved',
      hodComments: comments,
      substituteTeacher: substituteTeacher
    });
    
    addNotification({
      userId: leave.staffId,
      title: 'Leave Approved by HOD',
      message: `Your leave request for ${leave.startDate} to ${leave.endDate} has been approved by HOD and forwarded to Admin for final approval.`,
      type: 'success',
      read: false
    });
    
    if (substituteTeacher) {
      const substitute = availableSubstitutes.find(s => s.name === substituteTeacher);
      if (substitute) {
        addSubstituteRequest({
          leaveRequestId: leaveId,
          teacherName: substitute.name,
          teacherId: substitute.id,
          subject: leave.leaveType === 'Conference' ? 'Various' : 'Regular Classes',
          classes: [`${leave.staffName}'s Classes`],
          dates: [leave.startDate, leave.endDate],
          status: 'pending'
        });
      }
    }
    
    toast.success(`Leave approved for ${leave.staffName}`);
  };
  
  const handleRejectLeave = (leaveId: string, comments: string) => {
    updateLeaveRequest(leaveId, {
      hodStatus: 'rejected',
      hodComments: comments
    });
    
    const leave = departmentLeaves.find(l => l.id === leaveId);
    if (leave) {
      addNotification({
        userId: leave.staffId,
        title: 'Leave Request Rejected',
        message: `Your leave request for ${leave.startDate} to ${leave.endDate} has been rejected by HOD. Reason: ${comments}`,
        type: 'error',
        read: false
      });
      
      toast.success(`Leave rejected for ${leave.staffName}`);
    }
  };

  const renderApprovals = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Pending Leave Approvals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pendingLeaves.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No pending leave requests</p>
              </div>
            ) : (
              pendingLeaves.map((leave) => (
                <LeaveApprovalCard 
                  key={leave.id} 
                  leave={leave} 
                  onApprove={handleApproveLeave}
                  onReject={handleRejectLeave}
                  availableSubstitutes={availableSubstitutes}
                />
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const LeaveApprovalCard = ({ leave, onApprove, onReject, availableSubstitutes }: {
    leave: any;
    onApprove: (id: string, substitute?: string, comments?: string) => void;
    onReject: (id: string, comments: string) => void;
    availableSubstitutes: any[];
  }) => {
    const [showApprovalForm, setShowApprovalForm] = useState(false);
    const [showRejectForm, setShowRejectForm] = useState(false);
    const [selectedSubstitute, setSelectedSubstitute] = useState('');
    const [comments, setComments] = useState('');

    return (
      <div className="p-4 border rounded-lg hover:bg-gray-50">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h4 className="font-medium">{leave.staffName}</h4>
              <Badge variant="secondary">{leave.leaveType}</Badge>
              <Badge className={
                leave.priority === 'high' ? 'bg-red-100 text-red-700' :
                leave.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                'bg-blue-100 text-blue-700'
              }>
                {leave.priority} Priority
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div>
                <span className="font-medium">Dates:</span> {leave.startDate} to {leave.endDate}
              </div>
              <div>
                <span className="font-medium">Duration:</span> {leave.days} days
              </div>
              <div>
                <span className="font-medium">Submitted:</span> {leave.submittedDate}
              </div>
            </div>
            <div className="mt-2">
              <span className="font-medium text-sm">Reason:</span>
              <p className="text-sm text-gray-600 mt-1">{leave.reason}</p>
            </div>
            
            {showApprovalForm && (
              <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                <h5 className="font-medium mb-3">Approve Leave Request</h5>
                <div className="space-y-3">
                  <div>
                    <Label>Assign Substitute Teacher (Optional)</Label>
                    <Select onValueChange={setSelectedSubstitute}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select substitute teacher" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableSubstitutes.map((sub) => (
                          <SelectItem key={sub.id} value={sub.name}>
                            {sub.name} - {sub.subjects.join(', ')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Comments (Optional)</Label>
                    <Textarea 
                      placeholder="Add any comments..."
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => {
                        onApprove(leave.id, selectedSubstitute || undefined, comments || undefined);
                        setShowApprovalForm(false);
                        setSelectedSubstitute('');
                        setComments('');
                      }}
                    >
                      Confirm Approval
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        setShowApprovalForm(false);
                        setSelectedSubstitute('');
                        setComments('');
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            {showRejectForm && (
              <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
                <h5 className="font-medium mb-3">Reject Leave Request</h5>
                <div className="space-y-3">
                  <div>
                    <Label>Reason for Rejection</Label>
                    <Textarea 
                      placeholder="Please provide reason for rejection..."
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => {
                        if (comments.trim()) {
                          onReject(leave.id, comments);
                          setShowRejectForm(false);
                          setComments('');
                        } else {
                          toast.error('Please provide a reason for rejection');
                        }
                      }}
                    >
                      Confirm Rejection
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        setShowRejectForm(false);
                        setComments('');
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {!showApprovalForm && !showRejectForm && (
            <div className="flex gap-2 ml-4">
              <Button 
                size="sm" 
                className="bg-green-600 hover:bg-green-700"
                onClick={() => setShowApprovalForm(true)}
              >
                Approve
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="text-red-600 border-red-200 hover:bg-red-50"
                onClick={() => setShowRejectForm(true)}
              >
                Reject
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderStaff = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard
          title="Total Staff"
          value="15"
          subtitle="Department members"
          icon={<Users className="w-4 h-4" />}
        />
        <DashboardCard
          title="Present Today"
          value="14"
          subtitle="93% attendance"
          icon={<UserCheck className="w-4 h-4" />}
          trend={{ value: "1 on leave", positive: false }}
        />
        <DashboardCard
          title="Performance Rating"
          value="4.2"
          subtitle="Average score"
          icon={<TrendingUp className="w-4 h-4" />}
          trend={{ value: "0.3 improvement", positive: true }}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Staff Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {workloadData.map((staff, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">{staff.name}</h4>
                  <Badge variant="secondary">Active</Badge>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Teaching Load</p>
                    <p className="font-medium">{staff.classes} hrs/week</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Research Hours</p>
                    <p className="font-medium">{staff.research} hrs/week</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Admin Work</p>
                    <p className="font-medium">{staff.admin} hrs/week</p>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">Total Workload</span>
                    <span className="text-sm font-medium">{staff.classes + staff.research + staff.admin} hrs</span>
                  </div>
                  <Progress value={(staff.classes + staff.research + staff.admin) * 2.5} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <Tabs defaultValue="leaves" className="w-full">
        <TabsList>
          <TabsTrigger value="leaves">Leave Analytics</TabsTrigger>
          <TabsTrigger value="performance">Performance Trends</TabsTrigger>
          <TabsTrigger value="workload">Workload Analysis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="leaves" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Leave Distribution by Type</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={leaveStats}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label
                    >
                      {leaveStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Leave Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="leaves" stroke="#3b82f6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Department Performance Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="attendance" stroke="#10b981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workload" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Staff Workload Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={workloadData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="classes" fill="#3b82f6" />
                  <Bar dataKey="research" fill="#10b981" />
                  <Bar dataKey="admin" fill="#f59e0b" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        title="HOD Portal"
        role="Head of Department"
        menuItems={menuItems}
        onBack={onBack}
      />
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {activeSection === 'dashboard' ? 'HOD Dashboard' :
               activeSection === 'approvals' ? 'Leave Approvals' :
               activeSection === 'staff' ? 'Staff Management' :
               activeSection === 'syllabus' ? 'Courses / Syllabus' :
               activeSection === 'calendar' ? 'Calendar & Events' :
               activeSection === 'notifications' ? 'Notifications' :
               'Department Analytics'}
            </h1>
            <p className="text-gray-600">
              {activeSection === 'dashboard' ? 'Manage your department effectively.' :
               activeSection === 'approvals' ? 'Review and approve leave requests.' :
               activeSection === 'staff' ? 'Monitor staff performance and workload.' :
               activeSection === 'syllabus' ? 'Review submitted syllabi and allocate faculty.' :
               activeSection === 'calendar' ? 'View all holidays/events and schedule department items.' :
               activeSection === 'notifications' ? 'All announcements and updates for HOD.' :
               'Analyze department performance and trends.'}
            </p>
          </div>

          {activeSection === 'dashboard' && renderDashboard()}
          {activeSection === 'approvals' && renderApprovals()}
          {activeSection === 'staff' && renderStaff()}
          {activeSection === 'syllabus' && renderSyllabus()}
          {activeSection === 'calendar' && renderCalendar()}
          {activeSection === 'notifications' && renderNotifications()}
          {activeSection === 'analytics' && renderAnalytics()}
        </div>
      </div>
      
 </div>
  );
}