const express = require('express');
const router = express.Router();
const leaveController = require('../controllers/leaveController');
const authMiddleware = require('../middleware/authMiddleware');

// Public routes (unauthenticated for testing; add authMiddleware in production)
// Create leave request (staff or student)
router.post('/', leaveController.createLeaveRequest);

// Get all leave requests
router.get('/', leaveController.getAllLeaveRequests);

// Get leave requests by applicant (staff or student)
router.get('/applicant/:applicantId', leaveController.getLeaveRequestsByApplicant);

// Get pending leave requests for Staff (student leaves only)
router.get('/staff/pending', leaveController.getPendingLeaveRequestsForStaff);

// Get pending leave requests for HOD (department-specific)
router.get('/hod/pending/:department', leaveController.getPendingLeaveRequestsForHOD);

// Get pending leave requests for Admin (staff leaves only)
router.get('/admin/pending', leaveController.getPendingLeaveRequestsForAdmin);

// Update Staff-level status (students only) - intermediate approval
// STUDENT workflow: student → staff (approve/reject) → HOD
router.put('/:id/staff-status', leaveController.updateStaffStatus);

// Update HOD-level status (different logic for staff vs student)
// STUDENT workflow: after staff approval, HOD gives FINAL approval
// STAFF workflow: HOD gives intermediate approval, goes to Admin
router.put('/:id/hod-status', leaveController.updateHODStatus);

// Update Admin-level status (staff leaves only) - final approval
// STAFF workflow: staff → HOD → admin (final)
router.put('/:id/admin-status', leaveController.updateAdminStatus);

// Get leave statistics
router.get('/stats/summary', leaveController.getLeaveStatistics);

module.exports = router;

