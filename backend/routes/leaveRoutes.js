const express = require('express');
const router = express.Router();
const leaveController = require('../controllers/leaveController');
const authMiddleware = require('../middleware/authMiddleware');

// Public routes (unauthenticated for testing; add authMiddleware in production)
// Create leave request (staff or student)
router.post('/', leaveController.createLeaveRequest);

// Get all leave requests (admin only)
router.get('/', leaveController.getAllLeaveRequests);

// Get leave requests by applicant (staff or student)
router.get('/applicant/:applicantId', leaveController.getLeaveRequestsByApplicant);

// Get pending leave requests for HOD (department-specific)
router.get('/hod/pending/:department', leaveController.getPendingLeaveRequestsForHOD);

// Get pending leave requests for Admin (all pending HOD-approved)
router.get('/admin/pending', leaveController.getPendingLeaveRequestsForAdmin);

// Update HOD-level status (same for staff and student)
// Flow: Staff/Student submits → HOD approves/rejects → Admin final decision
router.put('/:id/hod-status', leaveController.updateHODStatus);

// Update admin-level status (same for staff and student)
router.put('/:id/admin-status', leaveController.updateAdminStatus);

// Get leave statistics
router.get('/stats/summary', leaveController.getLeaveStatistics);

module.exports = router;
