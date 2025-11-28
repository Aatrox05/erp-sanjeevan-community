# College Management System - Complete System Prompt

## System Overview
A comprehensive college management system with three distinct user roles (Staff, HOD, and Super Admin) featuring a complete authentication system, two-stage leave approval workflow, substitute teacher assignment, and real-time notifications. Built with React, TypeScript, Tailwind CSS, and shadcn/ui components.

## Design Theme
- **Color Scheme**: Professional blue/white theme with role-specific accent colors
  - Staff Portal: Blue (#3B82F6)
  - HOD Portal: Indigo (#6366F1)
  - Super Admin Portal: Purple (#9333EA)
- **UI Style**: Modern, clean, card-based layout with subtle shadows and hover effects
- **Responsive**: Optimized for both desktop and mobile devices
- **Typography**: Clean, readable fonts with consistent sizing via globals.css

## Authentication System

### Login Page Features
- Three separate login cards (Staff, HOD, Super Admin)
- Each card displays:
  - Role-specific icon and color scheme
  - Title and description
  - Key features list
  - Login button that reveals form
- Login form includes:
  - Email input field
  - Password input field
  - Role selection dropdown
  - Login and Cancel buttons
- Demo credentials displayed at bottom of page

### Demo Credentials
```
Staff Portal:
- Email: staff@college.edu
- Password: staff123
- Role: Staff Member

HOD Portal:
- Email: hod@college.edu
- Password: hod123
- Role: Head of Department

Super Admin Portal:
- Email: admin@college.edu
- Password: admin123
- Role: Super Admin
```

### Authentication Validation
- All fields must be filled
- Selected role must match login credentials
- Email and password must match demo credentials
- Success/error toasts for user feedback
- Automatic redirect to role-specific dashboard on success

## Staff Portal Features

### Dashboard Overview
- **Header**: Profile section with user info and logout button
- **Stats Cards** (4 cards in grid):
  1. Leave Balance (with calendar icon, shows days remaining)
  2. Pending Requests (with clock icon, shows count)
  3. Approved Leaves (with check icon, shows count)
  4. Notifications (with bell icon, shows count)

### Leave Application Form
- **Leave Type**: Dropdown (Sick Leave, Casual Leave, Earned Leave, Other)
- **Start Date**: Date picker
- **End Date**: Date picker
- **Days**: Auto-calculated based on date range
- **Reason**: Textarea for description
- **Submit Button**: Creates leave request with "Pending HOD Approval" status

### Leave History Table
- Displays all submitted leave requests
- Columns: Leave Type, Start Date, End Date, Days, Status, Reason
- Status badges with color coding:
  - Pending HOD Approval: Yellow/warning
  - Pending Admin Approval: Blue/info
  - Approved: Green/success
  - Rejected by HOD: Red/destructive
  - Rejected by Admin: Red/destructive
- Sortable and filterable

### Notifications Panel
- Real-time updates on leave request status
- Notification types:
  - HOD approval with substitute assignment
  - HOD rejection with reason
  - Admin final approval
  - Admin final rejection with reason
- Timestamp for each notification
- Unread count badge

### Holiday Calendar
- Monthly calendar view
- Displays:
  - National holidays
  - College events
  - Approved leave dates
  - Color-coded indicators

## HOD Portal Features

### Dashboard Overview
- **Header**: Department info, profile, and logout
- **Stats Cards** (4 cards in grid):
  1. Pending Approvals (leaves waiting for HOD review)
  2. Staff on Leave Today (current absences)
  3. Total Approved (this month)
  4. Department Stats (team size, attendance rate)

### Leave Approval Workflow
- **Pending Requests Table**:
  - Staff name and photo
  - Leave type and dates
  - Number of days
  - Reason/description
  - Action buttons (Approve/Reject)

- **Approval Process**:
  1. Review leave request details
  2. Optional: Assign substitute teacher
     - Dropdown list of available staff
     - Assignment sent as notification to substitute
  3. Add optional comments
  4. Approve or Reject
  5. If approved: Moves to "Pending Admin Approval"
  6. If rejected: Returns to staff with reason

### Substitute Teacher Management
- **Assignment Interface**:
  - Select staff member from dropdown
  - View substitute's current workload
  - Send assignment notification
- **Tracking**:
  - Pending substitute responses
  - Accepted assignments
  - Declined assignments (with ability to reassign)

### Staff Workload Analytics
- **Visualization**: Bar chart showing leave days by staff member
- **Metrics**:
  - Total leaves taken
  - Leave balance remaining
  - Attendance percentage
- **Filters**: By month, department, leave type

### Department Calendar
- Team schedule view
- Shows all approved leaves
- Highlights:
  - Staff on leave today
  - Upcoming leaves
  - Substitute assignments
  - Coverage gaps

## Super Admin Portal Features

### Dashboard Overview
- **Header**: System-wide controls and profile
- **Stats Cards** (6 cards in grid):
  1. Total Staff (system-wide count)
  2. Departments (number of departments)
  3. Pending Final Approvals (leaves awaiting admin)
  4. Active Leaves Today (current absences)
  5. Monthly Budget Impact (financial tracking)
  6. System Health (uptime, performance)

### Final Approval Workflow
- **Review Queue**:
  - All HOD-approved requests
  - Staff details and leave information
  - HOD approval notes
  - Substitute assignment details
  - Department impact analysis

- **Approval Process**:
  1. Review complete leave chain (Staff → HOD → Admin)
  2. View HOD's decision and comments
  3. Check substitute coverage
  4. Add admin comments (optional)
  5. Final Approve or Reject
  6. Notification sent to staff and HOD

### Financial Analytics
- **Dashboard Charts**:
  - Leave cost analysis by department
  - Monthly budget tracking
  - Year-over-year comparison
  - Cost per leave type
- **Reports**:
  - Exportable data tables
  - PDF report generation
  - Custom date ranges

### System Performance Metrics
- **Staff Analytics**:
  - Total staff count
  - Active/inactive users
  - Department distribution
  - Leave utilization rates

- **Leave Statistics**:
  - Approval rate by type
  - Average processing time
  - Rejection reasons analysis
  - Peak leave periods

- **Department Comparison**:
  - Cross-department metrics
  - Efficiency rankings
  - Resource utilization

### System-Wide Calendar
- All departments and staff
- Color-coded by department
- Filters: Department, staff, leave type, date range
- Export functionality

## Shared Context Management

### LeaveContext.tsx (React Context)
Manages shared state across all three portals:

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

interface Notification {
  id: string;
  userId: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  timestamp: string;
}
```

**Context Functions**:
- `submitLeaveRequest()`: Staff submits new leave
- `approveByHOD()`: HOD approves and forwards to admin
- `rejectByHOD()`: HOD rejects and returns to staff
- `approveByAdmin()`: Admin gives final approval
- `rejectByAdmin()`: Admin rejects after HOD approval
- `assignSubstitute()`: HOD assigns substitute teacher
- `respondToSubstitute()`: Substitute accepts/declines
- `addNotification()`: Create new notification
- `markNotificationRead()`: Mark notification as read

## Component Architecture

### Core Components
1. **App.tsx**: Main entry point, authentication router
2. **StaffDashboard.tsx**: Complete staff portal
3. **HODDashboard.tsx**: Complete HOD portal with approval UI
4. **SuperAdminDashboard.tsx**: Complete admin portal with analytics
5. **LeaveContext.tsx**: Shared state management
6. **DashboardCard.tsx**: Reusable stat card component
7. **Sidebar.tsx**: Navigation sidebar (if used)

### UI Components (shadcn/ui)
- `button`, `card`, `input`, `label`, `select`
- `table`, `badge`, `dialog`, `alert-dialog`
- `calendar`, `tabs`, `textarea`, `toast`
- `dropdown-menu`, `avatar`, `progress`
- `chart` (for analytics visualization)

## Leave Request Workflow

### Complete Flow Diagram
```
1. STAFF SUBMITS LEAVE
   ↓
   Status: "Pending HOD Approval"
   Notification: Sent to HOD
   
2. HOD REVIEWS
   ↓
   Option A: REJECT
   → Status: "Rejected by HOD"
   → Notification: Sent to Staff with reason
   → End of workflow
   
   Option B: APPROVE
   → Status: "Pending Admin Approval"
   → Optional: Assign substitute teacher
   → Notification: Sent to Staff and Admin
   → Continue to step 3
   
3. SUPER ADMIN REVIEWS
   ↓
   Option A: REJECT
   → Status: "Rejected by Admin"
   → Notification: Sent to Staff and HOD with reason
   → End of workflow
   
   Option B: APPROVE
   → Status: "Approved"
   → Notification: Sent to Staff and HOD
   → Leave request finalized
```

### Status Progression
1. **Pending HOD Approval** (initial state)
2. **Rejected by HOD** (terminal state) OR **Pending Admin Approval** (continues)
3. **Rejected by Admin** (terminal state) OR **Approved** (terminal state)

## Data Models

### Mock Data Structure
```typescript
// Sample leave requests
const mockLeaveRequests = [
  {
    id: "1",
    staffName: "John Doe",
    staffEmail: "john.doe@college.edu",
    leaveType: "Sick Leave",
    startDate: "2025-10-15",
    endDate: "2025-10-17",
    days: 3,
    reason: "Medical checkup and recovery",
    status: "pending-hod",
    createdAt: "2025-10-01T09:00:00Z"
  }
  // ... more requests
];

// Sample notifications
const mockNotifications = [
  {
    id: "1",
    userId: "staff@college.edu",
    message: "Your leave request (Sick Leave, Oct 15-17) has been approved by HOD",
    type: "success",
    read: false,
    timestamp: "2025-10-02T10:30:00Z"
  }
  // ... more notifications
];

// Sample staff data
const mockStaffData = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@college.edu",
    department: "Computer Science",
    leaveBalance: 15,
    role: "Assistant Professor"
  }
  // ... more staff
];
```

## Notification System

### Notification Triggers
1. **Staff submits leave**: Notify HOD
2. **HOD approves**: Notify Staff and Admin
3. **HOD rejects**: Notify Staff with reason
4. **HOD assigns substitute**: Notify Substitute
5. **Substitute responds**: Notify HOD
6. **Admin approves**: Notify Staff and HOD
7. **Admin rejects**: Notify Staff and HOD with reason

### Notification Display
- Badge with unread count on dashboard
- Notification panel/dropdown in header
- Color-coded by type (info, success, warning, error)
- Timestamp showing relative time (e.g., "2 hours ago")
- Mark as read functionality
- Auto-dismiss after reading (optional)

## UI/UX Patterns

### Responsive Design Breakpoints
- **Mobile**: < 768px (single column layout)
- **Tablet**: 768px - 1024px (2-column layout)
- **Desktop**: > 1024px (3-4 column layout)

### Color Coding System
- **Blue**: Staff-related, information
- **Indigo**: HOD-related, warnings
- **Purple**: Admin-related, system
- **Green**: Success, approvals
- **Red**: Rejections, errors
- **Yellow**: Pending, requires attention
- **Gray**: Neutral, inactive

### Interactive Elements
- Hover effects on cards (shadow increase, border color change)
- Loading states for async operations
- Toast notifications for user feedback
- Confirmation dialogs for critical actions (reject, approve)
- Smooth transitions and animations

### Accessibility
- Proper ARIA labels
- Keyboard navigation support
- Screen reader friendly
- Color contrast compliance (WCAG AA)
- Focus indicators

## Technical Implementation

### State Management
- React Context for global state (LeaveContext)
- Local state with useState for component-specific data
- Efficient re-rendering with proper memoization

### Data Flow
```
User Action
  ↓
Component Handler
  ↓
Context Function
  ↓
State Update
  ↓
Re-render Affected Components
  ↓
Notification Trigger (if applicable)
```

### Form Validation
- Required field validation
- Date range validation (end date > start date)
- Business logic validation (sufficient leave balance)
- Email format validation
- Real-time error feedback

### Error Handling
- Try-catch blocks for async operations
- Fallback UI for errors
- User-friendly error messages via toast
- Console logging for debugging

## Future Enhancement Possibilities

### Feature Additions
1. **Email Integration**: Real email notifications
2. **File Attachments**: Upload medical certificates
3. **Advanced Analytics**: AI-powered insights
4. **Mobile App**: React Native version
5. **Calendar Integration**: Google Calendar sync
6. **Multi-language**: i18n support
7. **Dark Mode**: Complete dark theme
8. **Export Functions**: PDF/Excel reports
9. **Audit Trail**: Complete action history
10. **Role Permissions**: Granular access control

### Technical Improvements
1. **Backend API**: Connect to real database
2. **Authentication**: JWT tokens, OAuth
3. **Real-time Updates**: WebSocket integration
4. **Caching**: Optimize data fetching
5. **Testing**: Unit and integration tests
6. **CI/CD**: Automated deployment
7. **Performance**: Code splitting, lazy loading
8. **Security**: Enhanced validation, rate limiting

## Development Guidelines

### Code Style
- TypeScript for type safety
- Functional components with hooks
- Tailwind CSS for styling (no inline styles)
- Component composition over inheritance
- Clear naming conventions (descriptive, consistent)

### File Organization
```
/components
  - Dashboard components (StaffDashboard.tsx, etc.)
  - Shared components (DashboardCard.tsx, etc.)
  - Context providers (LeaveContext.tsx)
  /ui - shadcn components
  /figma - Figma-specific components
/styles
  - globals.css (Tailwind config and custom styles)
/guidelines
  - Guidelines.md (project-specific guidelines)
```

### Best Practices
- Single Responsibility Principle
- DRY (Don't Repeat Yourself)
- Proper TypeScript typing
- Meaningful variable/function names
- Comments for complex logic
- Consistent formatting
- Git commit best practices

## Deployment Considerations

### Environment Variables
```
REACT_APP_API_URL=<backend_api_url>
REACT_APP_SUPABASE_URL=<supabase_project_url>
REACT_APP_SUPABASE_ANON_KEY=<supabase_anon_key>
```

### Build Configuration
- Production build optimization
- Environment-specific configs
- Asset optimization (images, fonts)
- Code minification
- Source maps for debugging

### Hosting Options
- Vercel (recommended for React)
- Netlify
- AWS Amplify
- GitHub Pages
- Custom server

## Testing Strategy

### Unit Tests
- Component rendering
- Form validation logic
- Context functions
- Utility functions

### Integration Tests
- User workflows (submit leave, approve, reject)
- Authentication flow
- Notification system
- Data persistence

### E2E Tests
- Complete user journeys
- Multi-role interactions
- Cross-browser compatibility
- Mobile responsiveness

## Documentation

### User Documentation
- User manuals for each role
- Video tutorials
- FAQ section
- Troubleshooting guide

### Developer Documentation
- API documentation
- Component documentation
- Setup instructions
- Contributing guidelines

---

## Quick Start Command

To recreate this system from scratch, use this prompt:

"Create a professional college management system with three role-based dashboards (Staff, HOD, Super Admin). Include authentication with demo credentials (staff@college.edu/staff123, hod@college.edu/hod123, admin@college.edu/admin123). Implement a two-stage leave approval workflow where staff submit leaves → HOD approves/rejects (with optional substitute assignment) → Super Admin gives final approval. Include React Context for state management, modern blue/white theme, responsive design, notifications system, and analytics dashboards with charts. Use shadcn/ui components and Tailwind CSS."

---

**Last Updated**: October 1, 2025
**Version**: 1.0.0
**Status**: Production Ready ✅