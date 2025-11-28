# College Management System - Complete Rebuild Prompt

## 🎯 Master Prompt (Copy & Use This)

Create a comprehensive college management system with three role-based portals (Staff, HOD, and Super Admin) featuring a complete authentication system, two-stage leave approval workflow, substitute teacher management, and real-time notifications.

### Core Requirements:

**1. Authentication System**
- Create a login page with three distinct cards (Staff, HOD, Super Admin)
- Each card should display role-specific icon, color scheme, title, description, and key features
- Clicking a card reveals a login form with: email input, password input, role selection dropdown, login and cancel buttons
- Implement validation: all fields required, role must match credentials, show toast notifications for success/error
- Display demo credentials at the bottom of the page

Demo Credentials:
```
Staff: staff@college.edu / staff123 (Role: Staff Member)
HOD: hod@college.edu / hod123 (Role: Head of Department)
Super Admin: admin@college.edu / admin123 (Role: Super Admin)
```

**2. Shared State Management**
- Create `/components/LeaveContext.tsx` using React Context API
- Store leave requests, notifications, staff data, and substitute assignments
- Implement functions: submitLeaveRequest, approveByHOD, rejectByHOD, approveByAdmin, rejectByAdmin, assignSubstitute, respondToSubstitute, addNotification, markNotificationRead

Leave Request Interface:
```typescript
interface LeaveRequest {
  id: string;
  staffName: string;
  staffEmail: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'pending-hod' | 'pending-admin' | 'approved' | 'rejected-hod' | 'rejected-admin';
  hodComments?: string;
  adminComments?: string;
  substituteTeacher?: string;
  substituteStatus?: 'pending' | 'accepted' | 'declined';
  createdAt: string;
  hodApprovedAt?: string;
  adminApprovedAt?: string;
}
```

**3. Staff Dashboard** (`/components/StaffDashboard.tsx`)

Header Section:
- User profile with name, email, and department
- Logout button

Dashboard Stats (4 cards in grid):
- Leave Balance (calendar icon, shows remaining days)
- Pending Requests (clock icon, shows count)
- Approved Leaves (check icon, shows count)
- Notifications (bell icon, shows unread count)

Leave Application Form:
- Leave Type dropdown: Sick Leave, Casual Leave, Earned Leave, Other
- Start Date picker
- End Date picker
- Days (auto-calculated from date range)
- Reason textarea
- Submit button (creates request with "Pending HOD Approval" status)
- Form validation: all fields required, end date must be after start date, check sufficient leave balance

Leave History Table:
- Columns: Leave Type, Start Date, End Date, Days, Status, Reason
- Color-coded status badges:
  - Pending HOD Approval: Yellow/warning
  - Pending Admin Approval: Blue/info
  - Approved: Green/success
  - Rejected by HOD: Red/destructive
  - Rejected by Admin: Red/destructive
- Show all leave requests for logged-in staff member
- Display HOD/Admin comments if available

Notifications Panel:
- Display all notifications for the staff member
- Show: message, timestamp (relative time), type-based color coding
- Unread count badge
- Mark as read functionality
- Notification types: HOD approval/rejection, Admin approval/rejection, substitute assignments

Holiday Calendar:
- Monthly calendar view showing:
  - National holidays
  - College events
  - Staff's approved leave dates
  - Color-coded indicators

**4. HOD Dashboard** (`/components/HODDashboard.tsx`)

Header Section:
- Department name
- User profile with name and role
- Logout button

Dashboard Stats (4 cards in grid):
- Pending Approvals (leaves awaiting HOD review)
- Staff on Leave Today (current absences)
- Total Approved This Month
- Department Stats (team size, attendance rate)

Leave Approval Section:
- Table showing pending requests with columns:
  - Staff Name (with avatar/initial)
  - Leave Type
  - Start Date - End Date
  - Days
  - Reason
  - Actions (Approve/Reject buttons)

Approval Dialog (when clicking Approve):
- Show complete leave request details
- Optional substitute teacher assignment:
  - Dropdown list of available staff members
  - Shows substitute's current workload
  - Assignment sent as notification
- HOD comments textarea
- Confirm Approve button
- Updates status to "Pending Admin Approval"
- Sends notifications to staff and admin

Rejection Dialog (when clicking Reject):
- Show leave request details
- Required HOD comments/reason
- Confirm Reject button
- Updates status to "Rejected by HOD"
- Sends notification to staff with reason

Staff Workload Analytics:
- Bar chart showing leave days by staff member (use recharts)
- Metrics: total leaves taken, leave balance remaining, attendance percentage
- Filters: by month, leave type

Department Calendar:
- Team schedule view showing all approved leaves
- Highlight staff on leave today
- Show substitute assignments
- Color-coded by staff member

Substitute Management Section:
- Table showing:
  - Pending substitute requests (awaiting response)
  - Accepted assignments
  - Declined assignments (with reassign option)
- Each row shows: substitute name, original staff, dates, status, actions

**5. Super Admin Dashboard** (`/components/SuperAdminDashboard.tsx`)

Header Section:
- System name/logo
- User profile
- Logout button

Dashboard Stats (6 cards in grid):
- Total Staff (system-wide count)
- Total Departments
- Pending Final Approvals (HOD-approved, awaiting admin)
- Active Leaves Today
- Monthly Budget Impact (financial tracking)
- System Health (approval rate percentage)

Final Approval Section:
- Table showing HOD-approved requests awaiting final approval:
  - Staff Name & Department
  - Leave Type & Dates
  - Days
  - HOD Decision & Comments
  - Substitute Assignment (if any)
  - Actions (Approve/Reject buttons)

Final Approval Dialog (when clicking Approve):
- Show complete leave chain: Staff request → HOD approval → Admin decision
- Display HOD's comments
- Show substitute coverage details
- Admin comments textarea (optional)
- Confirm Approve button
- Updates status to "Approved"
- Sends notifications to staff and HOD

Final Rejection Dialog (when clicking Reject):
- Show complete leave chain
- Required admin comments/reason
- Confirm Reject button
- Updates status to "Rejected by Admin"
- Sends notifications to staff and HOD with reason

Analytics Section:
- Leave Statistics Chart (bar/line chart using recharts):
  - Leave requests by type (Sick, Casual, Earned, Other)
  - Monthly trends
  - Department comparison
- Financial Impact Chart:
  - Cost by department
  - Monthly budget tracking
- System Performance Metrics:
  - Total leaves processed
  - Average approval time
  - Approval vs rejection rate
  - Peak leave periods

System-Wide Calendar:
- Calendar showing all approved leaves across departments
- Color-coded by department
- Filters: department, staff, leave type, date range

Department Management Section:
- List of all departments
- Staff count per department
- Department-wise leave statistics
- Performance metrics

**6. Design System**

Color Scheme:
- Staff Portal: Blue (#3B82F6)
- HOD Portal: Indigo (#6366F1)
- Super Admin Portal: Purple (#9333EA)
- Success: Green (#22C55E)
- Error/Rejected: Red (#EF4444)
- Warning/Pending: Yellow (#EAB308)
- Info: Sky Blue (#0EA5E9)

Layout:
- Card-based design with subtle shadows
- Hover effects: increase shadow, border color change
- Responsive grid: 1 column (mobile), 2 columns (tablet), 3-4 columns (desktop)
- Consistent spacing using Tailwind's spacing scale
- Clean, modern typography from globals.css

Components to Use:
- shadcn/ui: Button, Card, Input, Label, Select, Table, Badge, Dialog, AlertDialog, Calendar, Tabs, Textarea, Dropdown Menu, Avatar, Progress
- lucide-react: For icons (Calendar, Clock, CheckCircle, Bell, Users, BarChart, etc.)
- recharts: For analytics charts (BarChart, LineChart, PieChart)
- sonner: For toast notifications (import { toast } from "sonner@2.0.3")

**7. Leave Approval Workflow**

Complete Flow:
```
1. STAFF SUBMITS LEAVE
   ↓
   Status: "pending-hod"
   Notification → HOD: "New leave request from [Staff Name]"

2. HOD REVIEWS
   ↓
   OPTION A: REJECT
   → Status: "rejected-hod"
   → Notification → Staff: "Your leave request was rejected by HOD. Reason: [comments]"
   → WORKFLOW ENDS
   
   OPTION B: APPROVE
   → Status: "pending-admin"
   → Optional: Assign substitute teacher
   → Notification → Staff: "Your leave request was approved by HOD and forwarded to Admin"
   → Notification → Admin: "Leave request approved by HOD, awaiting your final approval"
   → If substitute assigned, Notification → Substitute: "You have been assigned as substitute for [Staff Name]"
   → CONTINUE TO STEP 3

3. SUPER ADMIN REVIEWS (Final Stage)
   ↓
   OPTION A: REJECT
   → Status: "rejected-admin"
   → Notification → Staff: "Your leave request was rejected by Admin. Reason: [comments]"
   → Notification → HOD: "Leave request you approved was rejected by Admin"
   → WORKFLOW ENDS
   
   OPTION B: APPROVE
   → Status: "approved"
   → Notification → Staff: "Your leave request has been approved! Enjoy your leave."
   → Notification → HOD: "Leave request you approved was finalized by Admin"
   → WORKFLOW COMPLETE
```

**8. Mock Data**

Include comprehensive mock data:

Staff Members (at least 12):
- Mix of departments: Computer Science, Mathematics, Physics, Chemistry, English, History
- Varying leave balances: 15-25 days
- Different roles: Professor, Assistant Professor, Lecturer, Lab Assistant

Leave Requests (at least 15):
- Various statuses: pending-hod (3), pending-admin (3), approved (6), rejected-hod (2), rejected-admin (1)
- Mix of leave types
- Recent dates (within last 2 months and upcoming)
- Some with substitute assignments

Notifications (at least 10 per role):
- Mix of read/unread
- Different types: info, success, warning, error
- Realistic timestamps

Holidays:
- National holidays (at least 5)
- College events (at least 3)

**9. Additional Features**

Form Validation:
- Real-time validation feedback
- Date range validation (end date > start date)
- Leave balance validation
- Required field indicators
- Error messages below inputs

Responsive Design:
- Mobile-first approach
- Collapsible sidebar on mobile
- Stacked cards on small screens
- Touch-friendly buttons (min 44px height)
- Readable font sizes on all devices

Notifications:
- Toast notifications for all actions (success, error, info)
- Real-time unread count badges
- Notification dropdown in header
- Mark all as read option
- Auto-dismiss for non-critical toasts

Loading States:
- Skeleton loaders for tables
- Spinner for form submissions
- Disabled buttons during async operations
- Loading indicators for charts

Error Handling:
- Try-catch for all async operations
- Fallback UI for errors
- User-friendly error messages
- Console logging for debugging

**10. Component Structure**

Required Files:
```
/App.tsx - Main component with authentication routing
/components/StaffDashboard.tsx - Complete staff portal
/components/HODDashboard.tsx - Complete HOD portal with approvals
/components/SuperAdminDashboard.tsx - Complete admin portal with analytics
/components/LeaveContext.tsx - Shared state management with React Context
/components/DashboardCard.tsx - Reusable stat card component
/styles/globals.css - Tailwind config and custom styles (already exists)
```

DashboardCard Component Props:
```typescript
interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  color?: string;
  onClick?: () => void;
}
```

**11. Implementation Priority**

Phase 1 (Core):
1. Set up LeaveContext with interfaces and mock data
2. Create authentication page with demo credentials
3. Build basic Staff Dashboard with leave form
4. Implement leave submission functionality

Phase 2 (Workflows):
5. Build HOD Dashboard with approval interface
6. Implement HOD approval/rejection with notifications
7. Build Super Admin Dashboard with final approval
8. Complete two-stage approval workflow

Phase 3 (Features):
9. Add substitute teacher assignment functionality
10. Implement notifications panel in all dashboards
11. Add leave history tables with filtering
12. Create calendar views

Phase 4 (Analytics):
13. Add recharts visualizations to HOD dashboard
14. Implement comprehensive analytics in Admin dashboard
15. Add department and system-wide statistics
16. Create export functionality (optional)

Phase 5 (Polish):
17. Add loading states and error handling
18. Improve responsive design
19. Add animations and transitions
20. Test all user flows

**12. Key Technical Details**

TypeScript Types:
- Use strict typing for all components and functions
- Define clear interfaces for data structures
- Type all props and state
- Use proper enum types for statuses

State Management:
- LeaveContext wraps entire App
- Use useContext hook in all dashboards
- Memoize expensive computations
- Avoid unnecessary re-renders

Routing Logic:
- Store authenticated user in state (email, role, name)
- Conditionally render dashboard based on role
- Logout clears user state and returns to login
- Persist auth state in sessionStorage (optional)

Date Handling:
- Use native Date objects or date-fns library
- Format dates consistently: YYYY-MM-DD for storage, "MMM DD, YYYY" for display
- Calculate days between dates accurately
- Handle timezones appropriately

Notification Logic:
- Auto-generate notification on every state change
- Include relevant details in message
- Set appropriate notification type
- Target correct user(s) with userId field

**13. Testing Scenarios**

Staff Flow:
1. Login as staff
2. Submit new leave request
3. Check notification for HOD approval
4. View updated leave history
5. Check notification for Admin approval
6. Verify leave appears in calendar

HOD Flow:
1. Login as HOD
2. View pending approval requests
3. Assign substitute teacher (optional)
4. Approve request with comments
5. Verify notification sent to staff and admin
6. Check updated analytics charts

Admin Flow:
1. Login as admin
2. View HOD-approved requests
3. Review complete approval chain
4. Give final approval
5. Verify notifications sent
6. Check system-wide statistics

Multi-Role Flow:
1. Submit leave as staff
2. Switch to HOD account and approve
3. Switch to admin account and approve
4. Switch back to staff and verify approved status
5. Check all notifications received

**14. Success Criteria**

The system should:
✅ Allow login for all three roles with validation
✅ Enable staff to submit leave requests with all required fields
✅ Allow HOD to approve/reject with optional substitute assignment
✅ Allow Admin to give final approval/rejection
✅ Update leave status through complete workflow
✅ Send appropriate notifications at each stage
✅ Display accurate statistics in all dashboards
✅ Show proper status badges with correct colors
✅ Be fully responsive on mobile, tablet, and desktop
✅ Handle errors gracefully with user feedback
✅ Include realistic mock data for demonstration
✅ Use professional, consistent design throughout
✅ Load quickly with good performance
✅ Be accessible with keyboard navigation

---

## 📋 Simplified Quick Start

**Minimum Viable Prompt:**

"Build a college management system with 3 portals: Staff, HOD, and Super Admin. Include login page with demo credentials (staff@college.edu/staff123, hod@college.edu/hod123, admin@college.edu/admin123). Staff submits leave requests → HOD approves/rejects (can assign substitute) → Admin gives final approval. Use React Context for state (/components/LeaveContext.tsx), shadcn/ui components, recharts for analytics, blue/white theme with role-specific colors (Staff=blue, HOD=indigo, Admin=purple). Include notifications, status badges, tables, forms, calendars, and analytics charts. Make it responsive and professional."

---

## 🎨 Design Reference

**Staff Dashboard Layout:**
```
┌─────────────────────────────────────────────────┐
│ Header: Profile | Logout                        │
├─────────────────────────────────────────────────┤
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐           │
│ │Leave │ │Pending│ │Approved│ │Notif│           │
│ │Balance│ │Requests│ │Leaves│ │ s   │           │
│ └──────┘ └──────┘ └──────┘ └──────┘           │
├─────────────────────────────────────────────────┤
│ Apply for Leave                                 │
│ [Leave Type ▼] [Start Date] [End Date]         │
│ [Days: Auto] [Reason: ____________]            │
│ [Submit Button]                                 │
├─────────────────────────────────────────────────┤
│ Leave History                                   │
│ ┌──────────────────────────────────────────┐   │
│ │Type   │Start   │End    │Days│Status     │   │
│ ├──────────────────────────────────────────┤   │
│ │Sick   │Oct 15  │Oct 17 │ 3  │[Pending]  │   │
│ │Casual │Oct 20  │Oct 21 │ 2  │[Approved] │   │
│ └──────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
```

**HOD Dashboard Layout:**
```
┌─────────────────────────────────────────────────┐
│ Dept: Computer Science | Profile | Logout      │
├─────────────────────────────────────────────────┤
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌────────┐│
│ │Pending  │ │On Leave │ │Approved │ │Dept    ││
│ │Approvals│ │Today    │ │This Month│ │Stats   ││
│ └─────────┘ └─────────┘ └─────────┘ └────────┘│
├─────────────────────────────────────────────────┤
│ Pending Leave Requests                          │
│ ┌──────────────────────────────────────────┐   │
│ │Staff  │Type  │Dates    │Days│[Approve]  │   │
│ ├──────────────────────────────────────────┤   │
│ │John   │Sick  │Oct 15-17│ 3  │[Reject]   │   │
│ └──────────────────────────────────────────┘   │
├─────────────────────────────────────────────────┤
│ Staff Workload Analytics                        │
│ [Bar Chart: Leave Days by Staff Member]        │
└─────────────────────────────────────────────────┘
```

**Super Admin Dashboard Layout:**
```
┌─────────────────────────────────────────────────┐
│ College Management System | Profile | Logout   │
├─────────────────────────────────────────────────┤
│ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌────┐│
│ │Staff│ │Depts│ │Final│ │Active│ │Budget│ │Health││
│ │ 48  │ │  6  │ │Appr.│ │Today │ │Impact│ │ 95% ││
│ └─────┘ └─────┘ └─────┘ └─────┘ └─────┘ └────┘│
├─────────────────────────────────────────────────┤
│ Awaiting Final Approval                         │
│ ┌──────────────────────────────────────────┐   │
│ │Staff│Dept │Type│Dates│HOD   │[Approve] │   │
│ ├──────────────────────────────────────────┤   │
│ │Jane │CS   │Sick│10/15│Approved│[Reject]│   │
│ └──────────────────────────────────────────┘   │
├─────────────────────────────────────────────────┤
│ System Analytics                                │
│ [Leave Trends Chart] [Department Comparison]   │
└─────────────────────────────────────────────────┘
```

---

## 🔧 Advanced Customization Options

If you want to enhance the system further, add:

1. **Email Integration**: Connect to email service for real notifications
2. **Database**: Connect to Supabase or Firebase for persistent data
3. **File Upload**: Allow staff to attach medical certificates
4. **Advanced Search**: Add filtering and search across all tables
5. **Export Features**: PDF/Excel export for reports
6. **Dark Mode**: Add theme toggle with dark color scheme
7. **Multi-language**: Add i18n support for multiple languages
8. **Attendance Tracking**: Link with attendance system
9. **Payroll Integration**: Calculate leave impact on salary
10. **Calendar Sync**: Export to Google Calendar or Outlook

---

**Version:** 2.0.0  
**Last Updated:** November 4, 2025  
**Status:** Complete and Production-Ready ✅

---

## 💡 Usage Instructions

1. **Copy the "Master Prompt" section** (or use the "Simplified Quick Start" for faster results)
2. **Paste into Figma Make or any AI code generator**
3. **Wait for generation** (system will create all components automatically)
4. **Test the system** using the demo credentials
5. **Customize** as needed using the advanced options

The system will be fully functional with realistic mock data and complete workflows ready to demonstrate!
