import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { DashboardCard } from './DashboardCard';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useLeaveContext } from './LeaveContext';
import { toast } from 'sonner@2.0.3';
import { 
  Home, 
  DollarSign, 
  Users, 
  BarChart3,
  AlertTriangle,
  TrendingUp,
  Building,
  FileText,
  MessageSquare,
  Search,
  Filter,
  CheckCircle,
  Clock,
  Calendar as CalendarIcon
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from 'recharts';

interface SuperAdminDashboardProps {
  onBack: () => void;
}

export function SuperAdminDashboard({ onBack }: SuperAdminDashboardProps) {
  const [activeSection, setActiveSection] = useState('dashboard');
  // State for Calendar & Events form (must be top-level hooks)
  const [ceTitle, setCeTitle] = useState('');
  const [ceDate, setCeDate] = useState('');
  const [ceType, setCeType] = useState<'holiday' | 'event'>('holiday');
  const [ceAudienceAll, setCeAudienceAll] = useState(true);
  const [ceAudStudent, setCeAudStudent] = useState(true);
  const [ceAudStaff, setCeAudStaff] = useState(true);
  const [ceAudHod, setCeAudHod] = useState(true);
  
  const { 
    getLeaveRequestsForAdmin, 
    updateLeaveRequest, 
    addNotification,
    addEvent,
    getEventsForRole,
    getFeeRequestsForAdmin,
    updateFeeRequest
  } = useLeaveContext();
  
  const pendingAdminApprovals = getLeaveRequestsForAdmin();
  const adminFeeRequests = getFeeRequestsForAdmin ? getFeeRequestsForAdmin() : [];

  const renderStudentFees = () => {
    const currency = (n: number) => `₹${n.toLocaleString('en-IN')}`;
    const setStatus = (id: string, status: 'processing' | 'paid' | 'rejected') => {
      const req = adminFeeRequests.find(r => r.id === id);
      updateFeeRequest(id, { status });
      if (req) {
        addNotification({
          userId: req.studentId,
          title: status === 'paid' ? 'Fee Payment Approved' : status === 'rejected' ? 'Fee Request Rejected' : 'Fee Request Processing',
          message: `${req.feeTitle} (${currency(req.amount)}) is now ${status}.`,
          type: status === 'paid' ? 'success' : status === 'rejected' ? 'error' : 'info',
          read: false
        });
      }
    };

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Student Fee Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {adminFeeRequests.length === 0 && (
                <div className="text-sm text-gray-600">No fee requests submitted.</div>
              )}
              {adminFeeRequests.map((r) => (
                <div key={r.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">{r.feeTitle} • {currency(r.amount)}</p>
                      <p className="text-sm text-gray-600">{r.studentName} • {r.branch} • {new Date(r.submittedAt).toLocaleString()}</p>
                      {r.details && <p className="text-sm text-gray-600 mt-1">{r.details}</p>}
                    </div>
                    <Badge className={
                      r.status === 'paid' ? 'bg-green-100 text-green-700' :
                      r.status === 'rejected' ? 'bg-red-100 text-red-700' :
                      r.status === 'processing' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-blue-100 text-blue-700'
                    }>
                      {r.status.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => setStatus(r.id, 'processing')}>Mark Processing</Button>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => setStatus(r.id, 'paid')}>Mark Paid</Button>
                    <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => setStatus(r.id, 'rejected')}>Reject</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const menuItems = [
    { icon: <Home className="w-4 h-4" />, label: 'Dashboard', active: activeSection === 'dashboard', onClick: () => setActiveSection('dashboard') },
    { icon: <CheckCircle className="w-4 h-4" />, label: 'Final Approvals', active: activeSection === 'approvals', onClick: () => setActiveSection('approvals') },
    { icon: <DollarSign className="w-4 h-4" />, label: 'Financial Analytics', active: activeSection === 'financial', onClick: () => setActiveSection('financial') },
    { icon: <Building className="w-4 h-4" />, label: 'Department Analytics', active: activeSection === 'departments', onClick: () => setActiveSection('departments') },
    { icon: <FileText className="w-4 h-4" />, label: 'Staff Reports', active: activeSection === 'reports', onClick: () => setActiveSection('reports') },
    { icon: <MessageSquare className="w-4 h-4" />, label: 'Grievance System', active: activeSection === 'grievances', onClick: () => setActiveSection('grievances') },
    { icon: <CalendarIcon className="w-4 h-4" />, label: 'Calendar & Events', active: activeSection === 'calendar', onClick: () => setActiveSection('calendar') },
    { icon: <DollarSign className="w-4 h-4" />, label: 'Student Fees', active: activeSection === 'fees', onClick: () => setActiveSection('fees') },
  ];

  const financialData = [
    { month: 'Aug', budget: 850000, spent: 780000, revenue: 920000 },
    { month: 'Sep', budget: 870000, spent: 820000, revenue: 950000 },
    { month: 'Oct', budget: 890000, spent: 850000, revenue: 980000 },
    { month: 'Nov', budget: 910000, spent: 870000, revenue: 1020000 },
    { month: 'Dec', budget: 950000, spent: 890000, revenue: 1050000 },
  ];

  const departmentData = [
    { name: 'Computer Science', staff: 25, students: 350, budget: 180000, performance: 92 },
    { name: 'Mathematics', staff: 18, students: 280, budget: 140000, performance: 88 },
    { name: 'Physics', staff: 22, students: 320, budget: 160000, performance: 90 },
    { name: 'Chemistry', staff: 20, students: 300, budget: 150000, performance: 85 },
    { name: 'Biology', staff: 19, students: 290, budget: 145000, performance: 87 },
  ];

  const leaveDistribution = [
    { department: 'CS', sick: 12, casual: 18, personal: 8, conference: 6 },
    { department: 'Math', sick: 8, casual: 15, personal: 6, conference: 4 },
    { department: 'Physics', sick: 10, casual: 16, personal: 7, conference: 8 },
    { department: 'Chemistry', sick: 9, casual: 14, personal: 5, conference: 5 },
    { department: 'Biology', sick: 11, casual: 17, personal: 9, conference: 7 },
  ];

  const grievances = [
    { id: 1, type: 'Workload', department: 'Computer Science', priority: 'High', status: 'Open', submitted: '2 days ago', description: 'Excessive teaching hours assigned' },
    { id: 2, type: 'Infrastructure', department: 'Physics', priority: 'Medium', status: 'In Progress', submitted: '1 week ago', description: 'Laboratory equipment maintenance issues' },
    { id: 3, type: 'Policy', department: 'Mathematics', priority: 'Low', status: 'Resolved', submitted: '2 weeks ago', description: 'Clarification on leave policy' },
    { id: 4, type: 'Salary', department: 'Chemistry', priority: 'High', status: 'Under Review', submitted: '3 days ago', description: 'Delay in salary disbursement' },
  ];

  const performanceMetrics = [
    { name: 'Overall Satisfaction', value: 87, color: '#10b981' },
    { name: 'Academic Quality', value: 92, color: '#3b82f6' },
    { name: 'Infrastructure', value: 78, color: '#f59e0b' },
    { name: 'Staff Welfare', value: 84, color: '#8b5cf6' },
  ];

  const handleFinalApproval = (leaveId: string, comments?: string) => {
    updateLeaveRequest(leaveId, {
      adminStatus: 'approved',
      adminComments: comments
    });
    
    const leave = pendingAdminApprovals.find(l => l.id === leaveId);
    if (leave) {
      addNotification({
        userId: leave.staffId,
        title: 'Leave Finally Approved',
        message: `Your leave request for ${leave.startDate} to ${leave.endDate} has been finally approved by Admin. You can proceed with your leave.`,
        type: 'success',
        read: false
      });
      
      toast.success(`Leave finally approved for ${leave.staffName}`);
    }
  };

  const handleFinalRejection = (leaveId: string, comments: string) => {
    updateLeaveRequest(leaveId, {
      adminStatus: 'rejected',
      adminComments: comments
    });
    
    const leave = pendingAdminApprovals.find(l => l.id === leaveId);
    if (leave) {
      addNotification({
        userId: leave.staffId,
        title: 'Leave Request Rejected by Admin',
        message: `Your leave request for ${leave.startDate} to ${leave.endDate} has been rejected by Admin. Reason: ${comments}`,
        type: 'error',
        read: false
      });
      
      toast.success(`Leave rejected for ${leave.staffName}`);
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Total Revenue"
          value="₹1.05M"
          subtitle="This month"
          icon={<DollarSign className="w-4 h-4" />}
          trend={{ value: "8% increase", positive: true }}
        />
        <DashboardCard
          title="Active Staff"
          value="104"
          subtitle="Across all departments"
          icon={<Users className="w-4 h-4" />}
          trend={{ value: "2 new hires", positive: true }}
        />
        <DashboardCard
          title="Departments"
          value="5"
          subtitle="Active departments"
          icon={<Building className="w-4 h-4" />}
          trend={{ value: "All operational", positive: true }}
        />
        <DashboardCard
          title="Pending Approvals"
          value={pendingAdminApprovals.length.toString()}
          subtitle="Final leave approvals"
          icon={<Clock className="w-4 h-4" />}
          trend={{ value: `${pendingAdminApprovals.filter(l => l.priority === 'high').length} urgent`, positive: false }}
          onClick={() => setActiveSection('approvals')}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Financial Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={financialData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `₹${(value / 1000).toFixed(0)}K`} />
                <Area type="monotone" dataKey="revenue" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                <Area type="monotone" dataKey="budget" stackId="2" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span className="text-sm">Revenue</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span className="text-sm">Budget</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Department Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={departmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="performance" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Department Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {departmentData.map((dept, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium">{dept.name}</h4>
                    <Badge 
                      className={dept.performance >= 90 ? 'bg-green-100 text-green-700' : 
                                dept.performance >= 85 ? 'bg-yellow-100 text-yellow-700' : 
                                'bg-red-100 text-red-700'}
                    >
                      {dept.performance}% Performance
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Staff</p>
                      <p className="font-medium">{dept.staff} members</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Students</p>
                      <p className="font-medium">{dept.students} enrolled</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Budget</p>
                      <p className="font-medium">₹{(dept.budget / 1000).toFixed(0)}K</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {performanceMetrics.map((metric, index) => (
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
    </div>
  );

  const renderCalendar = () => {
    const submit = () => {
      if (!ceTitle || !ceDate) return;
      const audience = ceAudienceAll ? 'all' : [
        ...(ceAudStudent ? ['student'] : []),
        ...(ceAudStaff ? ['staff'] : []),
        ...(ceAudHod ? ['hod'] : [])
      ];
      addEvent({ title: ceTitle, date: ceDate, type: ceType, description: ceType === 'holiday' ? 'Public Holiday' : 'Scheduled Event', audience: audience as any, createdBy: 'superadmin' });
      const targets: string[] = ceAudienceAll ? ['student','staff','hod'] : (audience as string[]);
      targets.forEach(roleId => addNotification({
        userId: roleId,
        title: ceType === 'holiday' ? 'New Holiday Announced' : 'New Event Scheduled',
        message: `${ceTitle} on ${new Date(ceDate).toLocaleDateString()}`,
        type: 'info',
        read: false
      }));
      setCeTitle(''); setCeDate(''); setCeType('holiday'); setCeAudienceAll(true); setCeAudStudent(true); setCeAudStaff(true); setCeAudHod(true);
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
                {getEventsForRole('superadmin').map(ev => (
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
                <h3 className="font-medium">Create Holiday/Event</h3>
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input placeholder="e.g. Public Holiday - Heavy Rains" value={ceTitle} onChange={e => setCeTitle(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input type="date" value={ceDate} onChange={e => setCeDate(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select value={ceType} onValueChange={(v) => setCeType(v as 'holiday' | 'event')}>
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
                      <input type="checkbox" checked={ceAudienceAll} onChange={(e) => setCeAudienceAll(e.target.checked)} />
                      <span>All Portals</span>
                    </label>
                    {!ceAudienceAll && (
                      <div className="grid grid-cols-2 gap-2 pl-6">
                        <label className="flex items-center gap-2">
                          <input type="checkbox" checked={ceAudStudent} onChange={(e) => setCeAudStudent(e.target.checked)} />
                          <span>Students</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" checked={ceAudStaff} onChange={(e) => setCeAudStaff(e.target.checked)} />
                          <span>Staff</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" checked={ceAudHod} onChange={(e) => setCeAudHod(e.target.checked)} />
                          <span>HOD</span>
                        </label>
                      </div>
                    )}
                  </div>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={submit}>
                  Announce
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderApprovals = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Pending Final Approvals</CardTitle>
          <p className="text-sm text-gray-600">
            Leave requests that have been approved by HODs and require your final approval
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pendingAdminApprovals.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No pending final approvals</p>
              </div>
            ) : (
              pendingAdminApprovals.map((leave) => (
                <FinalApprovalCard 
                  key={leave.id} 
                  leave={leave} 
                  onApprove={handleFinalApproval}
                  onReject={handleFinalRejection}
                />
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const FinalApprovalCard = ({ leave, onApprove, onReject }: {
    leave: any;
    onApprove: (id: string, comments?: string) => void;
    onReject: (id: string, comments: string) => void;
  }) => {
    const [showApprovalForm, setShowApprovalForm] = useState(false);
    const [showRejectForm, setShowRejectForm] = useState(false);
    const [comments, setComments] = useState('');

    return (
      <div className="p-4 border rounded-lg hover:bg-gray-50">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h4 className="font-medium">{leave.staffName}</h4>
              <Badge variant="secondary">{leave.department}</Badge>
              <Badge className="bg-blue-100 text-blue-700">{leave.leaveType}</Badge>
              <Badge className={
                leave.priority === 'high' ? 'bg-red-100 text-red-700' :
                leave.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                'bg-blue-100 text-blue-700'
              }>
                {leave.priority} Priority
              </Badge>
              <Badge className="bg-green-100 text-green-700">HOD Approved</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
              <div>
                <span className="font-medium">Dates:</span> {leave.startDate} to {leave.endDate}
              </div>
              <div>
                <span className="font-medium">Duration:</span> {leave.days} days
              </div>
              <div>
                <span className="font-medium">Submitted:</span> {leave.submittedDate}
              </div>
              {leave.substituteTeacher && (
                <div>
                  <span className="font-medium">Substitute:</span> {leave.substituteTeacher}
                </div>
              )}
            </div>
            <div className="mt-2">
              <span className="font-medium text-sm">Reason:</span>
              <p className="text-sm text-gray-600 mt-1">{leave.reason}</p>
            </div>
            {leave.hodComments && (
              <div className="mt-2">
                <span className="font-medium text-sm">HOD Comments:</span>
                <p className="text-sm text-gray-600 mt-1">{leave.hodComments}</p>
              </div>
            )}
            
            {showApprovalForm && (
              <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                <h5 className="font-medium mb-3">Final Approval</h5>
                <div className="space-y-3">
                  <div>
                    <Label>Admin Comments (Optional)</Label>
                    <Textarea 
                      placeholder="Add any final comments..."
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => {
                        onApprove(leave.id, comments || undefined);
                        setShowApprovalForm(false);
                        setComments('');
                      }}
                    >
                      Give Final Approval
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        setShowApprovalForm(false);
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
                      Final Rejection
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
                Final Approve
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

  const renderFinancial = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard
          title="Monthly Revenue"
          value="₹1,050,000"
          subtitle="December 2024"
          icon={<TrendingUp className="w-4 h-4" />}
          trend={{ value: "12% vs last month", positive: true }}
        />
        <DashboardCard
          title="Total Expenses"
          value="₹890,000"
          subtitle="This month"
          icon={<DollarSign className="w-4 h-4" />}
          trend={{ value: "5% under budget", positive: true }}
        />
        <DashboardCard
          title="Profit Margin"
          value="15.2%"
          subtitle="Year to date"
          icon={<BarChart3 className="w-4 h-4" />}
          trend={{ value: "2.1% improvement", positive: true }}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Financial Trends (Last 6 Months)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={financialData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `₹${(value / 1000).toFixed(0)}K`} />
              <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} />
              <Line type="monotone" dataKey="budget" stroke="#3b82f6" strokeWidth={3} />
              <Line type="monotone" dataKey="spent" stroke="#ef4444" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span className="text-sm">Revenue</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span className="text-sm">Budget</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span className="text-sm">Expenses</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderDepartments = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Department-wise Leave Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={leaveDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="department" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sick" stackId="a" fill="#ef4444" />
              <Bar dataKey="casual" stackId="a" fill="#3b82f6" />
              <Bar dataKey="personal" stackId="a" fill="#10b981" />
              <Bar dataKey="conference" stackId="a" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span className="text-sm">Sick Leave</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span className="text-sm">Casual Leave</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span className="text-sm">Personal Leave</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded"></div>
              <span className="text-sm">Conference</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {departmentData.map((dept, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {dept.name}
                <Badge 
                  className={dept.performance >= 90 ? 'bg-green-100 text-green-700' : 
                            dept.performance >= 85 ? 'bg-yellow-100 text-yellow-700' : 
                            'bg-red-100 text-red-700'}
                >
                  {dept.performance}%
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Staff Members</p>
                  <p className="text-xl font-bold">{dept.staff}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Students</p>
                  <p className="text-xl font-bold">{dept.students}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Budget Allocated</p>
                  <p className="text-xl font-bold">₹{(dept.budget / 1000).toFixed(0)}K</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Staff:Student Ratio</p>
                  <p className="text-xl font-bold">1:{Math.round(dept.students / dept.staff)}</p>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Performance Score</span>
                  <span className="text-sm font-medium">{dept.performance}%</span>
                </div>
                <Progress value={dept.performance} className="h-2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-6">
      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <Input placeholder="Search staff reports..." className="w-full" />
        </div>
        <Select>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            <SelectItem value="cs">Computer Science</SelectItem>
            <SelectItem value="math">Mathematics</SelectItem>
            <SelectItem value="physics">Physics</SelectItem>
            <SelectItem value="chemistry">Chemistry</SelectItem>
            <SelectItem value="biology">Biology</SelectItem>
          </SelectContent>
        </Select>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Search className="w-4 h-4 mr-2" />
          Search
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Performance Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Excellent (90-100%)</span>
                <Badge className="bg-green-100 text-green-700">28 staff</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Good (80-89%)</span>
                <Badge className="bg-blue-100 text-blue-700">52 staff</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Average (70-79%)</span>
                <Badge className="bg-yellow-100 text-yellow-700">18 staff</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Below Average (&lt;70%)</span>
                <Badge className="bg-red-100 text-red-700">6 staff</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Attendance Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Average Attendance</span>
                  <span className="text-sm font-medium">94.2%</span>
                </div>
                <Progress value={94.2} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Perfect Attendance</span>
                  <span className="text-sm font-medium">78 staff</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Leave Utilization</span>
                  <span className="text-sm font-medium">68%</span>
                </div>
                <Progress value={68} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Training & Development</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Completed Courses</span>
                <Badge className="bg-green-100 text-green-700">142</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>In Progress</span>
                <Badge className="bg-blue-100 text-blue-700">38</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Certifications Earned</span>
                <Badge className="bg-purple-100 text-purple-700">67</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Training Hours</span>
                <Badge className="bg-yellow-100 text-yellow-700">1,250h</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detailed Staff Performance Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: 'Dr. Sarah Johnson', dept: 'Computer Science', performance: 95, attendance: 98, rating: 'Excellent' },
              { name: 'Prof. Michael Chen', dept: 'Mathematics', performance: 88, attendance: 95, rating: 'Good' },
              { name: 'Dr. Emily Davis', dept: 'Physics', performance: 92, attendance: 97, rating: 'Excellent' },
              { name: 'Dr. Robert Wilson', dept: 'Chemistry', performance: 78, attendance: 90, rating: 'Average' },
              { name: 'Prof. Lisa Brown', dept: 'Biology', performance: 85, attendance: 93, rating: 'Good' },
            ].map((staff, index) => (
              <div key={index} className="p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-medium">{staff.name}</h4>
                      <Badge variant="secondary">{staff.dept}</Badge>
                      <Badge 
                        className={
                          staff.rating === 'Excellent' ? 'bg-green-100 text-green-700' :
                          staff.rating === 'Good' ? 'bg-blue-100 text-blue-700' :
                          'bg-yellow-100 text-yellow-700'
                        }
                      >
                        {staff.rating}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-gray-600">Performance Score: </span>
                        <span className="font-medium">{staff.performance}%</span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Attendance: </span>
                        <span className="font-medium">{staff.attendance}%</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderGrievances = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Grievance Management</h2>
          <p className="text-gray-600">Track and resolve staff grievances efficiently</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          Create New Grievance
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <DashboardCard
          title="Total Grievances"
          value="4"
          subtitle="This month"
          icon={<MessageSquare className="w-4 h-4" />}
        />
        <DashboardCard
          title="Open Cases"
          value="2"
          subtitle="Requiring action"
          icon={<AlertTriangle className="w-4 h-4" />}
          trend={{ value: "1 urgent", positive: false }}
        />
        <DashboardCard
          title="Resolved"
          value="1"
          subtitle="This month"
          icon={<FileText className="w-4 h-4" />}
          trend={{ value: "100% on time", positive: true }}
        />
        <DashboardCard
          title="Avg Resolution"
          value="3.2 days"
          subtitle="Response time"
          icon={<TrendingUp className="w-4 h-4" />}
          trend={{ value: "0.5 days faster", positive: true }}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Grievances</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {grievances.map((grievance) => (
              <div key={grievance.id} className="p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-medium">Grievance #{grievance.id}</h4>
                      <Badge variant="secondary">{grievance.type}</Badge>
                      <Badge 
                        className={
                          grievance.priority === 'High' ? 'bg-red-100 text-red-700' :
                          grievance.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-blue-100 text-blue-700'
                        }
                      >
                        {grievance.priority} Priority
                      </Badge>
                      <Badge 
                        className={
                          grievance.status === 'Open' ? 'bg-red-100 text-red-700' :
                          grievance.status === 'In Progress' ? 'bg-yellow-100 text-yellow-700' :
                          grievance.status === 'Under Review' ? 'bg-blue-100 text-blue-700' :
                          'bg-green-100 text-green-700'
                        }
                      >
                        {grievance.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                      <div>
                        <span className="font-medium">Department:</span> {grievance.department}
                      </div>
                      <div>
                        <span className="font-medium">Submitted:</span> {grievance.submitted}
                      </div>
                    </div>
                    <p className="text-gray-700">{grievance.description}</p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                    {grievance.status !== 'Resolved' && (
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        Take Action
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Submit New Grievance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Grievance Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="workload">Workload</SelectItem>
                  <SelectItem value="infrastructure">Infrastructure</SelectItem>
                  <SelectItem value="policy">Policy</SelectItem>
                  <SelectItem value="salary">Salary</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Department</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cs">Computer Science</SelectItem>
                  <SelectItem value="math">Mathematics</SelectItem>
                  <SelectItem value="physics">Physics</SelectItem>
                  <SelectItem value="chemistry">Chemistry</SelectItem>
                  <SelectItem value="biology">Biology</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea 
              placeholder="Describe the grievance in detail..."
              className="min-h-[100px]"
            />
          </div>
          <div className="space-y-2">
            <Label>Priority Level</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            Submit Grievance
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        title="Super Admin"
        role="System Administrator"
        menuItems={menuItems}
        onBack={onBack}
      />
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {activeSection === 'dashboard' ? 'Super Admin Dashboard' :
               activeSection === 'approvals' ? 'Final Leave Approvals' :
               activeSection === 'financial' ? 'Financial Analytics' :
               activeSection === 'departments' ? 'Department Analytics' :
               activeSection === 'reports' ? 'Staff Performance Reports' :
               activeSection === 'grievances' ? 'Grievance Management System' :
               activeSection === 'calendar' ? 'Calendar & Events' :
               activeSection === 'fees' ? 'Student Fees' :
               'Super Admin'}
            </h1>
            <p className="text-gray-600">
              {activeSection === 'dashboard' ? 'Complete system overview and analytics.' :
               activeSection === 'approvals' ? 'Review and approve leave requests after HOD approval.' :
               activeSection === 'financial' ? 'Monitor financial performance and budgets.' :
               activeSection === 'departments' ? 'Track department-wise performance and metrics.' :
               activeSection === 'reports' ? 'Detailed staff performance and analytics.' :
               activeSection === 'grievances' ? 'Manage incoming complaints.' :
               activeSection === 'calendar' ? 'Announce holidays/events and view what is visible to each portal.' :
               activeSection === 'fees' ? 'Manage student fee submissions and payments.' :
               'System administration'}
            </p>
          </div>

          {activeSection === 'dashboard' && renderDashboard()}
          {activeSection === 'approvals' && renderApprovals()}
          {activeSection === 'financial' && renderFinancial()}
          {activeSection === 'departments' && renderDepartments()}
          {activeSection === 'reports' && renderReports()}
          {activeSection === 'calendar' && renderCalendar()}
          {activeSection === 'fees' && renderStudentFees()}
          {activeSection === 'grievances' && renderGrievances()}
        </div>
      </div>
    </div>
  );
}