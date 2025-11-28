import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { DashboardCard } from './DashboardCard';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { useLeaveContext } from './LeaveContext';
import { Calendar } from './ui/calendar';
import { 
  Home,
  BookOpen,
  Calendar as CalendarIcon,
  Bell,
  GraduationCap,
  DollarSign,
  CalendarCheck,
  FileText,
  MessageSquare,
  CreditCard,
  ClipboardList,
  Trophy,
  TrendingUp,
  Clock
} from 'lucide-react';

interface StudentDashboardProps {
  onBack: () => void;
}

export function StudentDashboard({ onBack }: StudentDashboardProps) {
  const [activeSection, setActiveSection] = useState<'dashboard' | 'courses' | 'syllabus' | 'calendar' | 'notifications' | 'leave' | 'fees'>('dashboard');
  const { addLeaveRequest, getStudentLeaveRequestsByStudent, getEventsForRole, getNotificationsByUser, getPublishedSyllabiForStudents, addFeeRequest, getFeeRequestsByStudent, addNotification } = useLeaveContext();
  const [selectedDate, setSelectedDate] = useState<Date>();

  // Fees form state (must be top-level hooks)
  const [name, setName] = useState('Demo Student');
  const [branch, setBranch] = useState('Computer Science');
  const [feeTitle, setFeeTitle] = useState('Tuition Fee');
  const [amount, setAmount] = useState<number>(0);
  const [details, setDetails] = useState('');
  const [mode, setMode] = useState<'Online' | 'UPI' | 'Card' | 'NetBanking' | 'Cash'>('Online');

  // Demo identity since this app uses demo logins
  const studentId = 'stud001';
  const studentName = 'Demo Student';

  const [leaveForm, setLeaveForm] = useState({
    leaveType: '',
    startDate: '',
    endDate: '',
    days: 1,
    reason: '',
    priority: 'low' as 'low' | 'medium' | 'high'
  });

  const menuItems = [
    { icon: <Home className="w-4 h-4" />, label: 'Dashboard', active: activeSection === 'dashboard', onClick: () => setActiveSection('dashboard') },
    { icon: <BookOpen className="w-4 h-4" />, label: 'My Courses', active: activeSection === 'courses', onClick: () => setActiveSection('courses') },
    { icon: <BookOpen className="w-4 h-4" />, label: 'Syllabus', active: activeSection === 'syllabus', onClick: () => setActiveSection('syllabus') },
    { icon: <CalendarIcon className="w-4 h-4" />, label: 'Calendar', active: activeSection === 'calendar', onClick: () => setActiveSection('calendar') },
    { icon: <DollarSign className="w-4 h-4" />, label: 'Fees', active: activeSection === 'fees', onClick: () => setActiveSection('fees') },
    { icon: <Bell className="w-4 h-4" />, label: 'Notifications', active: activeSection === 'notifications', onClick: () => setActiveSection('notifications') },
    { icon: <CalendarIcon className="w-4 h-4" />, label: 'Leave', active: activeSection === 'leave', onClick: () => setActiveSection('leave') },
  ];

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="bg-blue-500 text-white p-4 rounded-lg">
        <h1 className="text-3xl font-bold">Welcome to Student Portal</h1>
        <p className="text-lg">Your one-stop solution for all academic needs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard title="Enrolled Courses" value="6" subtitle="This semester" icon={<BookOpen className="w-4 h-4" />} className="bg-white/70 backdrop-blur-sm border-blue-100" />
        <DashboardCard title="Attendance" value="92%" subtitle="Overall" icon={<GraduationCap className="w-4 h-4" />} className="bg-white/70 backdrop-blur-sm border-emerald-100" />
        <DashboardCard title="Assignments Due" value="3" subtitle="Next 7 days" icon={<Bell className="w-4 h-4" />} className="bg-white/70 backdrop-blur-sm border-amber-100" />
        <DashboardCard title="Upcoming Exams" value="2" subtitle="This month" icon={<CalendarIcon className="w-4 h-4" />} className="bg-white/70 backdrop-blur-sm border-purple-100" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 rounded-lg border flex items-center justify-between bg-gray-50">
                <div className="flex items-center gap-3">
                  <CalendarCheck className="w-4 h-4 text-blue-600" />
                  <div>
                    <p className="font-medium">Web Dev Lecture</p>
                    <p className="text-sm text-gray-600">Mon, 10:00 AM • Room B-204</p>
                  </div>
                </div>
                <Badge className="bg-blue-100 text-blue-700">Today</Badge>
              </div>
              <div className="p-3 rounded-lg border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-amber-600" />
                  <div>
                    <p className="font-medium">DSA Assignment #3</p>
                    <p className="text-sm text-gray-600">Due Wed • Submit on LMS</p>
                  </div>
                </div>
                <Badge className="bg-amber-100 text-amber-700">Due</Badge>
              </div>
              <div className="p-3 rounded-lg border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CalendarIcon className="w-4 h-4 text-purple-600" />
                  <div>
                    <p className="font-medium">OS Midterm</p>
                    <p className="text-sm text-gray-600">Fri, 11:30 AM • Hall A</p>
                  </div>
                </div>
                <Badge className="bg-purple-100 text-purple-700">Exam</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="justify-start gap-2"><BookOpen className="w-4 h-4" /> Courses</Button>
              <Button variant="outline" className="justify-start gap-2"><FileText className="w-4 h-4" /> Syllabus</Button>
              <Button variant="outline" className="justify-start gap-2"><CalendarIcon className="w-4 h-4" /> Calendar</Button>
              <Button variant="outline" className="justify-start gap-2"><CreditCard className="w-4 h-4" /> Fees</Button>
              <Button variant="outline" className="justify-start gap-2"><MessageSquare className="w-4 h-4" /> Notices</Button>
              <Button variant="outline" className="justify-start gap-2"><ClipboardList className="w-4 h-4" /> Leave</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border">
              <div>
                <p className="font-medium">Assignment 3 Posted</p>
                <p className="text-sm text-gray-600">Web Development - Due in 5 days</p>
              </div>
              <Badge className="bg-blue-100 text-blue-700">New</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border">
              <div>
                <p className="font-medium">Lab Session Rescheduled</p>
                <p className="text-sm text-gray-600">Physics Lab - Fri, 2 PM</p>
              </div>
              <Badge className="bg-green-100 text-green-700">Updated</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSyllabus = () => {
    const published = getPublishedSyllabiForStudents();
    return (
      <Card>
        <CardHeader>
          <CardTitle>Published Syllabi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {published.length === 0 && (
              <p className="text-sm text-gray-600">No syllabus published yet.</p>
            )}
            {published.map((s) => (
              <div key={s.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium">{s.courseName} • {s.branch} • {s.year}</p>
                    <p className="text-sm text-gray-600">Designed by: {s.designedByStaffName}</p>
                  </div>
                  <Badge className="bg-green-100 text-green-700">Approved</Badge>
                </div>
                <div className="mt-3 space-y-2">
                  <Label>Subjects and Faculty Allocation</Label>
                  {s.subjects.map((sub) => (
                    <div key={sub.id} className="p-2 border rounded flex items-center justify-between text-sm">
                      <span className="font-medium">{sub.name}</span>
                      <span className="text-gray-700">{sub.allocatedFacultyName || 'TBA'}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderFees = () => {
    const currency = (n: number) => `₹${n.toLocaleString('en-IN')}`;
    const myFees = getFeeRequestsByStudent(studentId);
    const totalAmount = myFees.reduce((sum, r) => sum + r.amount, 0);
    const isValid = Boolean(name && branch && feeTitle && amount > 0);

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Submit Fee Request / Payment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Branch</Label>
                <Select value={branch} onValueChange={(v) => setBranch(v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Computer Science">Computer Science</SelectItem>
                    <SelectItem value="IT">IT</SelectItem>
                    <SelectItem value="Mechanical">Mechanical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Fee Title</Label>
                <Input placeholder="e.g. Tuition Fee - Sem II" value={feeTitle} onChange={(e) => setFeeTitle(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Amount</Label>
                <Input type="number" min={0} value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
              </div>
              <div className="space-y-2">
                <Label>Payment Mode</Label>
                <Select value={mode} onValueChange={(v) => setMode(v as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Online">Online</SelectItem>
                    <SelectItem value="UPI">UPI</SelectItem>
                    <SelectItem value="Card">Card</SelectItem>
                    <SelectItem value="NetBanking">NetBanking</SelectItem>
                    <SelectItem value="Cash">Cash</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Details</Label>
              <Textarea placeholder="Any additional details" value={details} onChange={(e) => setDetails(e.target.value)} />
            </div>
            {!isValid && (
              <div className="text-sm text-red-600">Please fill all required fields and enter a positive amount.</div>
            )}
            <div className="flex gap-3">
              <Button disabled={!isValid} className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50" onClick={() => {
                if (!isValid) return;
                addFeeRequest({
                  studentId,
                  studentName: name,
                  branch,
                  amount,
                  feeTitle,
                  details,
                  paymentMode: mode
                });
                addNotification({
                  userId: 'superadmin',
                  title: 'New Fee Request Submitted',
                  message: `${name} submitted ${feeTitle} (${currency(amount)})`,
                  type: 'info',
                  read: false
                });
                setDetails('');
              }}>Submit</Button>
              <Button variant="outline">Pay Now</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>My Fee Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {myFees.length === 0 && <div className="text-sm text-gray-600">No fee requests yet.</div>}
              {myFees.length > 0 && (
                <div className="flex items-center justify-between p-3 rounded-md bg-gray-50 border">
                  <span className="text-sm text-gray-700">Total Requests: <span className="font-medium">{myFees.length}</span></span>
                  <span className="text-sm text-gray-700">Total Amount: <span className="font-semibold">{currency(totalAmount)}</span></span>
                </div>
              )}
              {myFees.map((r) => (
                <div key={r.id} className="p-3 border rounded-lg flex items-center justify-between">
                  <div>
                    <p className="font-medium">{r.feeTitle}</p>
                    <p className="text-sm text-gray-600">{new Date(r.submittedAt).toLocaleString()} • {r.paymentMode}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={
                      r.status === 'paid' ? 'bg-green-100 text-green-700' :
                      r.status === 'rejected' ? 'bg-red-100 text-red-700' :
                      r.status === 'processing' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-blue-100 text-blue-700'
                    }>
                      {r.status.toUpperCase()}
                    </Badge>
                    <span className="font-semibold">{currency(r.amount)}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderCourses = () => {
    const published = getPublishedSyllabiForStudents();
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Courses</CardTitle>
        </CardHeader>
        <CardContent>
          {published.length > 0 ? (
            <div className="space-y-4">
              {published.map((s) => (
                <div key={s.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{s.courseName} • {s.branch} • {s.year}</h4>
                    <Badge className="bg-green-100 text-green-700">Syllabus Published</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Designed by: {s.designedByStaffName}</p>
                  <div className="space-y-2">
                    <Label>Subjects and Faculty</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {s.subjects.map((sub) => (
                        <div key={sub.id} className="p-2 border rounded flex items-center justify-between text-sm">
                          <span className="font-medium">{sub.name}</span>
                          <span className="text-gray-700">{sub.allocatedFacultyName || 'TBA'}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['Web Development', 'Data Structures', 'DBMS', 'Operating Systems', 'Mathematics', 'Physics'].map((course) => (
                <div key={course} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{course}</h4>
                    <Badge variant="secondary">Active</Badge>
                  </div>
                  <p className="text-sm text-gray-600">View lectures, assignments, and resources</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderCalendar = () => (
    <Card>
      <CardHeader>
        <CardTitle>Academic Calendar</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
            />
          </div>
          <div className="space-y-4">
            <h3 className="font-medium">Events & Holidays</h3>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="inline-block w-3 h-3 rounded-full bg-red-400"></span>
                <span className="text-gray-600">Holiday</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block w-3 h-3 rounded-full bg-blue-400"></span>
                <span className="text-gray-600">Event</span>
              </div>
            </div>
            <div className="space-y-3">
              {getEventsForRole('student').map((ev) => (
                <div key={ev.id} className={`p-3 rounded-lg border ${ev.type === 'holiday' ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'}`}>
                  <p className="font-medium">{ev.title}</p>
                  <p className="text-sm text-gray-600">{new Date(ev.date).toLocaleDateString()}</p>
                  <Badge className={ev.type === 'holiday' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}>
                    {ev.type === 'holiday' ? 'Holiday' : 'Event'}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderNotifications = () => {
    const studentNotifications = getNotificationsByUser('student');
    return (
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {studentNotifications.length === 0 ? (
              <p className="text-sm text-gray-600">You are up to date.</p>
            ) : (
              studentNotifications.map((n) => (
                <div key={n.id} className="p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{n.title}</h4>
                        <Badge 
                          className={
                            n.type === 'success' ? 'bg-green-100 text-green-700' :
                            n.type === 'warning' ? 'bg-yellow-100 text-yellow-700' :
                            n.type === 'error' ? 'bg-red-100 text-red-700' :
                            'bg-blue-100 text-blue-700'
                          }
                        >
                          {n.type}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-2">{n.message}</p>
                      <p className="text-sm text-gray-400">{new Date(n.timestamp).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderLeave = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Apply for Leave</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Leave Type</Label>
              <Select onValueChange={(v) => setLeaveForm({ ...leaveForm, leaveType: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select leave type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sick Leave">Sick Leave</SelectItem>
                  <SelectItem value="Personal Leave">Personal Leave</SelectItem>
                  <SelectItem value="Emergency Leave">Emergency Leave</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select onValueChange={(v) => setLeaveForm({ ...leaveForm, priority: v as any })}>
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
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input type="date" value={leaveForm.startDate} onChange={(e) => setLeaveForm({ ...leaveForm, startDate: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>End Date</Label>
              <Input type="date" value={leaveForm.endDate} onChange={(e) => setLeaveForm({ ...leaveForm, endDate: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Days</Label>
              <Input type="number" min={1} value={leaveForm.days} onChange={(e) => setLeaveForm({ ...leaveForm, days: Number(e.target.value) })} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Reason</Label>
            <Textarea placeholder="Provide a brief reason" value={leaveForm.reason} onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })} />
          </div>
          <Button
            className="bg-green-600 hover:bg-green-700"
            onClick={() => {
              if (!leaveForm.leaveType || !leaveForm.startDate || !leaveForm.endDate || !leaveForm.reason) return;
              addLeaveRequest({
                // fields required by model but not used for student flow
                staffName: '',
                staffId: '',
                department: '',
                leaveType: leaveForm.leaveType,
                startDate: leaveForm.startDate,
                endDate: leaveForm.endDate,
                days: leaveForm.days,
                reason: leaveForm.reason,
                priority: leaveForm.priority,
                requestedBy: 'student',
                studentId,
                studentName,
                staffStatus: 'pending'
              });
              setLeaveForm({ leaveType: '', startDate: '', endDate: '', days: 1, reason: '', priority: 'low' });
            }}
          >
            Submit Application
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>My Leave Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {getStudentLeaveRequestsByStudent(studentId).length === 0 ? (
              <p className="text-sm text-gray-600">No leave requests yet.</p>
            ) : (
              getStudentLeaveRequestsByStudent(studentId).map((req) => (
                <div key={req.id} className="p-4 border rounded-lg flex items-center justify-between">
                  <div>
                    <p className="font-medium">{req.leaveType} • {req.startDate} to {req.endDate} ({req.days} days)</p>
                    <p className="text-sm text-gray-600">{req.reason}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <Badge className={req.staffStatus === 'approved' ? 'bg-green-100 text-green-700' : req.staffStatus === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}>
                        Staff: {req.staffStatus ? req.staffStatus.toUpperCase() : 'PENDING'}
                      </Badge>
                      {req.staffStatus === 'approved' && (
                        <Badge className={req.hodStatus === 'approved' ? 'bg-green-100 text-green-700' : req.hodStatus === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}>
                          HOD: {(req.hodStatus || 'pending').toUpperCase()}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50">
      <Sidebar
        title="Student Portal"
        role="Student"
        menuItems={menuItems}
        onBack={onBack}
      />
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {activeSection === 'dashboard' ? 'Dashboard' :
                 activeSection === 'courses' ? 'My Courses' :
                 activeSection === 'syllabus' ? 'Syllabus' :
                 activeSection === 'calendar' ? 'Academic Calendar' :
                 activeSection === 'fees' ? 'Fees' :
                 activeSection === 'leave' ? 'Apply for Leave' :
                 'Notifications'}
              </h1>
              <p className="text-gray-600">
                {activeSection === 'dashboard' ? 'Welcome! Here is your overview.' :
                 activeSection === 'courses' ? 'Browse your enrolled courses.' :
                 activeSection === 'syllabus' ? 'View published syllabi and allocated faculty.' :
                 activeSection === 'calendar' ? 'Important academic dates.' :
                 activeSection === 'fees' ? 'Your fee summary, dues and payments.' :
                 activeSection === 'leave' ? 'Submit a leave request and track its status.' :
                 'All your updates in one place.'}
              </p>
            </div>

            {activeSection === 'dashboard' && renderDashboard()}
            {activeSection === 'courses' && renderCourses()}
            {activeSection === 'calendar' && renderCalendar()}
            {activeSection === 'syllabus' && renderSyllabus()}
            {activeSection === 'fees' && renderFees()}
            {activeSection === 'notifications' && renderNotifications()}
            {activeSection === 'leave' && renderLeave()}
          </div>
        </div>
      </div>
    </div>
  );
}
