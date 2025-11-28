import React, { createContext, useContext, useState, ReactNode } from 'react';

export type PortalRole = 'student' | 'staff' | 'hod' | 'superadmin';

export interface LeaveRequest {
  id: string;
  staffName: string;
  staffId: string;
  department: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  submittedDate: string;
  hodStatus: 'pending' | 'approved' | 'rejected';
  adminStatus: 'pending' | 'approved' | 'rejected';
  substituteTeacher?: string;
  substituteStatus?: 'pending' | 'accepted' | 'declined';
  hodComments?: string;
  adminComments?: string;
  priority: 'low' | 'medium' | 'high';
  // Student-originated workflow support
  requestedBy?: 'staff' | 'student';
  studentId?: string;
  studentName?: string;
  staffStatus?: 'pending' | 'approved' | 'rejected';
}

// Fees workflow models
export type PaymentMode = 'Online' | 'UPI' | 'Card' | 'NetBanking' | 'Cash';
export type FeeStatus = 'submitted' | 'processing' | 'paid' | 'rejected';

export interface FeeRequest {
  id: string;
  studentId: string;
  studentName: string;
  branch: string;
  amount: number;
  feeTitle: string; // e.g., Tuition Fee - Sem II
  details?: string;
  paymentMode?: PaymentMode;
  status: FeeStatus;
  submittedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'info' | 'error';
  timestamp: string;
  read: boolean;
}

export interface SubstituteRequest {
  id: string;
  leaveRequestId: string;
  teacherName: string;
  teacherId: string;
  subject: string;
  classes: string[];
  dates: string[];
  status: 'pending' | 'accepted' | 'declined';
  message?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  description?: string;
  type: 'holiday' | 'event';
  audience: PortalRole[] | 'all';
  createdBy: PortalRole;
}

// Syllabus workflow models
export interface SyllabusSubject {
  id: string;
  name: string;
  allocatedFacultyId?: string;
  allocatedFacultyName?: string;
}

export interface Syllabus {
  id: string;
  branch: string;
  year: string;
  courseName: string;
  subjects: SyllabusSubject[];
  status: 'draft' | 'submitted' | 'approved' | 'revision_required';
  designedByStaffId: string;
  designedByStaffName: string;
  hodComments?: string;
  published: boolean; // visible to students when true
}

interface LeaveContextType {
  leaveRequests: LeaveRequest[];
  notifications: Notification[];
  substituteRequests: SubstituteRequest[];
  events: CalendarEvent[];
  syllabi: Syllabus[];
  feeRequests: FeeRequest[];
  addLeaveRequest: (request: Omit<LeaveRequest, 'id' | 'submittedDate' | 'hodStatus' | 'adminStatus'>) => void;
  updateLeaveRequest: (id: string, updates: Partial<LeaveRequest>) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  markNotificationRead: (id: string) => void;
  addSubstituteRequest: (request: Omit<SubstituteRequest, 'id'>) => void;
  updateSubstituteRequest: (id: string, updates: Partial<SubstituteRequest>) => void;
  getLeaveRequestsByHOD: (department: string) => LeaveRequest[];
  getLeaveRequestsForAdmin: () => LeaveRequest[];
  getNotificationsByUser: (userId: string) => Notification[];
  getSubstituteRequestsByTeacher: (teacherId: string) => SubstituteRequest[];
  // Student workflow helpers
  getStudentLeaveRequestsByStudent: (studentId: string) => LeaveRequest[];
  getStudentLeaveRequestsForStaff: () => LeaveRequest[];
  // Calendar helpers
  addEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  getEventsForRole: (role: PortalRole) => CalendarEvent[];
  // Syllabus helpers
  addSyllabusDraft: (syllabus: Omit<Syllabus, 'id' | 'status' | 'published'>) => void;
  submitSyllabusToHOD: (id: string) => void;
  updateSyllabus: (id: string, updates: Partial<Syllabus>) => void;
  getSyllabiForHOD: () => Syllabus[]; // submitted
  getSyllabiForStaff: (staffId: string) => Syllabus[];
  getPublishedSyllabiForStudents: () => Syllabus[];
  // Fees helpers
  addFeeRequest: (req: Omit<FeeRequest, 'id' | 'status' | 'submittedAt'>) => void;
  updateFeeRequest: (id: string, updates: Partial<FeeRequest>) => void;
  getFeeRequestsForAdmin: () => FeeRequest[];
  getFeeRequestsByStudent: (studentId: string) => FeeRequest[];
}

const LeaveContext = createContext<LeaveContextType | undefined>(undefined);

export function LeaveProvider({ children }: { children: ReactNode }) {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([
    {
      id: '1',
      staffName: 'Dr. Sarah Johnson',
      staffId: 'staff001',
      department: 'Computer Science',
      leaveType: 'Sick Leave',
      startDate: '2024-12-28',
      endDate: '2024-12-30',
      days: 3,
      reason: 'Medical treatment required',
      submittedDate: '2024-12-25',
      hodStatus: 'approved',
      adminStatus: 'pending',
      priority: 'high',
      hodComments: 'Approved due to medical urgency'
    },
    {
      id: '2',
      staffName: 'Prof. Michael Chen',
      staffId: 'staff002',
      department: 'Mathematics',
      leaveType: 'Personal Leave',
      startDate: '2025-01-05',
      endDate: '2025-01-07',
      days: 3,
      reason: 'Family function',
      submittedDate: '2024-12-24',
      hodStatus: 'pending',
      adminStatus: 'pending',
      priority: 'medium'
    }
  ]);

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      userId: 'staff001',
      title: 'Leave Approved by HOD',
      message: 'Your leave request for Dec 28-30 has been approved by HOD and sent to Admin for final approval',
      type: 'info',
      timestamp: '2024-12-26T10:00:00Z',
      read: false
    }
  ]);

  const [substituteRequests, setSubstituteRequests] = useState<SubstituteRequest[]>([]);

  // Syllabi state
  const [syllabi, setSyllabi] = useState<Syllabus[]>([]);
  const [feeRequests, setFeeRequests] = useState<FeeRequest[]>([]);

  // Seed with a few national holidays (example dates)
  const [events, setEvents] = useState<CalendarEvent[]>([
    { id: 'e1', title: 'Republic Day', date: '2025-01-26', type: 'holiday', audience: 'all', createdBy: 'superadmin', description: 'National Holiday' },
    { id: 'e2', title: 'Independence Day', date: '2025-08-15', type: 'holiday', audience: 'all', createdBy: 'superadmin', description: 'National Holiday' },
    { id: 'e3', title: 'Gandhi Jayanti', date: '2025-10-02', type: 'holiday', audience: 'all', createdBy: 'superadmin', description: 'National Holiday' },
  ]);

  const addLeaveRequest = (request: Omit<LeaveRequest, 'id' | 'submittedDate' | 'hodStatus' | 'adminStatus'>) => {
    const newRequest: LeaveRequest = {
      ...request,
      id: Date.now().toString(),
      submittedDate: new Date().toISOString().split('T')[0],
      hodStatus: 'pending',
      adminStatus: 'pending',
      requestedBy: request.requestedBy ?? 'staff',
      staffStatus: request.staffStatus ?? 'pending'
    };

    setLeaveRequests((prev: LeaveRequest[]) => [...prev, newRequest]);
  };

  // ---- Fees helpers ----
  const addFeeRequest = (req: Omit<FeeRequest, 'id' | 'status' | 'submittedAt'>) => {
    const newReq: FeeRequest = {
      ...req,
      id: Date.now().toString(),
      status: 'submitted',
      submittedAt: new Date().toISOString()
    };
    setFeeRequests((prev: FeeRequest[]) => [newReq, ...prev]);
  };

  const updateFeeRequest = (id: string, updates: Partial<FeeRequest>) => {
    setFeeRequests((prev: FeeRequest[]) => prev.map((r: FeeRequest) => r.id === id ? { ...r, ...updates } : r));
  };

  const getFeeRequestsForAdmin = () => feeRequests; // all for now
  const getFeeRequestsByStudent = (studentId: string) => feeRequests.filter((r: FeeRequest) => r.studentId === studentId);

  // ---- Syllabus workflow helpers ----
  const addSyllabusDraft = (syllabus: Omit<Syllabus, 'id' | 'status' | 'published'>) => {
    const newSyl: Syllabus = {
      ...syllabus,
      id: Date.now().toString(),
      status: 'draft',
      published: false
    };
    setSyllabi((prev: Syllabus[]) => [newSyl, ...prev]);
  };

  const submitSyllabusToHOD = (id: string) => {
    setSyllabi((prev: Syllabus[]) => prev.map((s: Syllabus) => s.id === id ? { ...s, status: 'submitted' } : s));
  };

  const updateSyllabus = (id: string, updates: Partial<Syllabus>) => {
    setSyllabi((prev: Syllabus[]) => prev.map((s: Syllabus) => s.id === id ? { ...s, ...updates } : s));
  };

  const getSyllabiForHOD = () => syllabi.filter((s: Syllabus) => s.status === 'submitted');
  const getSyllabiForStaff = (staffId: string) => syllabi.filter((s: Syllabus) => s.designedByStaffId === staffId);
  const getPublishedSyllabiForStudents = () => syllabi.filter((s: Syllabus) => s.published && s.status === 'approved');

  const updateLeaveRequest = (id: string, updates: Partial<LeaveRequest>) => {
    setLeaveRequests((prev: LeaveRequest[]) => 
      prev.map((request: LeaveRequest) => 
        request.id === id ? { ...request, ...updates } : request
      )
    );
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    };
    setNotifications((prev: Notification[]) => [newNotification, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev: Notification[]) =>
      prev.map((notification: Notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const addSubstituteRequest = (request: Omit<SubstituteRequest, 'id'>) => {
    const newRequest: SubstituteRequest = {
      ...request,
      id: Date.now().toString()
    };
    setSubstituteRequests((prev: SubstituteRequest[]) => [...prev, newRequest]);
  };

  const updateSubstituteRequest = (id: string, updates: Partial<SubstituteRequest>) => {
    setSubstituteRequests((prev: SubstituteRequest[]) =>
      prev.map((request: SubstituteRequest) =>
        request.id === id ? { ...request, ...updates } : request
      )
    );
  };

  const getLeaveRequestsByHOD = (department: string) => {
    return leaveRequests.filter((request: LeaveRequest) => request.department === department);
  };

  const getLeaveRequestsForAdmin = () => {
    return leaveRequests.filter((request: LeaveRequest) => request.hodStatus === 'approved' && request.adminStatus === 'pending');
  };

  const getNotificationsByUser = (userId: string) => {
    return notifications.filter((notification: Notification) => notification.userId === userId);
  };

  const getSubstituteRequestsByTeacher = (teacherId: string) => {
    return substituteRequests.filter((request: SubstituteRequest) => request.teacherId === teacherId);
  };

  const getStudentLeaveRequestsByStudent = (studentId: string) => {
    return leaveRequests.filter((r: LeaveRequest) => r.requestedBy === 'student' && r.studentId === studentId);
  };

  const getStudentLeaveRequestsForStaff = () => {
    return leaveRequests.filter((r: LeaveRequest) => r.requestedBy === 'student');
  };

  const addEvent = (event: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = { ...event, id: Date.now().toString() };
    setEvents((prev: CalendarEvent[]) => [newEvent, ...prev]);
  };

  const getEventsForRole = (role: PortalRole) => {
    return events.filter((ev: CalendarEvent) => ev.audience === 'all' || ev.audience.includes(role));
  };

  return (
    <LeaveContext.Provider value={{
      leaveRequests,
      notifications,
      substituteRequests,
      events,
      syllabi,
      feeRequests,
      addLeaveRequest,
      updateLeaveRequest,
      addNotification,
      markNotificationRead,
      addSubstituteRequest,
      updateSubstituteRequest,
      getLeaveRequestsByHOD,
      getLeaveRequestsForAdmin,
      getNotificationsByUser,
      getSubstituteRequestsByTeacher,
      getStudentLeaveRequestsByStudent,
      getStudentLeaveRequestsForStaff,
      addEvent,
      getEventsForRole,
      addSyllabusDraft,
      submitSyllabusToHOD,
      updateSyllabus,
      getSyllabiForHOD,
      getSyllabiForStaff,
      getPublishedSyllabiForStudents,
      addFeeRequest,
      updateFeeRequest,
      getFeeRequestsForAdmin,
      getFeeRequestsByStudent
    }}>
      {children}
    </LeaveContext.Provider>
  );
}

export function useLeaveContext() {
  const context = useContext(LeaveContext);
  if (context === undefined) {
    throw new Error('useLeaveContext must be used within a LeaveProvider');
  }
  return context;
}