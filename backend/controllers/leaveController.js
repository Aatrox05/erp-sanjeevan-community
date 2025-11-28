const Leave = require('../models/Leave');
const sendNotification = require('../utils/sendNotification');

// Validation rules (same for staff and student)
const validateLeaveRequest = (startDate, endDate, days) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Condition 1: Start date must be in the future or today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (start < today) {
    return { valid: false, message: 'Start date must be today or in the future' };
  }

  // Condition 2: End date must be >= start date
  if (end < start) {
    return { valid: false, message: 'End date must be after or equal to start date' };
  }

  // Condition 3: Days calculation must match the date range
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end dates
  if (Math.abs(diffDays - days) > 1) { // Allow 1-day tolerance for rounding
    return { valid: false, message: 'Days count does not match the date range' };
  }

  // Condition 4: Maximum consecutive leave limit (e.g., 15 days)
  if (days > 15) {
    return { valid: false, message: 'Maximum consecutive leave limit is 15 days' };
  }

  // Condition 5: Minimum 1 day leave
  if (days < 1) {
    return { valid: false, message: 'Leave must be for at least 1 day' };
  }

  return { valid: true };
};

// Create a leave request (staff or student)
exports.createLeaveRequest = async (req, res) => {
  try {
    const { applicantType, applicantId, applicantName, department, leaveType, startDate, endDate, days, reason, priority } = req.body;

    // Validate required fields
    if (!applicantType || !applicantId || !applicantName || !department || !leaveType || !startDate || !endDate || !days || !reason) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Validate applicant type
    if (!['staff', 'student'].includes(applicantType)) {
      return res.status(400).json({ message: 'Invalid applicant type. Must be "staff" or "student"' });
    }

    // Validate leave request using shared conditions
    const validation = validateLeaveRequest(startDate, endDate, days);
    if (!validation.valid) {
      return res.status(400).json({ message: validation.message });
    }

    // Create leave request
    const leaveRequest = new Leave({
      applicantType,
      applicantId,
      applicantName,
      department,
      leaveType,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      days,
      reason,
      priority: priority || 'medium',
      staffStatus: 'pending', // For staff: awaits staff confirmation; for student: awaits staff review
      hodStatus: 'pending',
      adminStatus: 'pending',
      submittedDate: new Date(),
    });

    await leaveRequest.save();

    // Send notification
    await sendNotification(
      applicantId,
      'Leave Request Submitted',
      `Your ${leaveType} leave request for ${days} days (${startDate} to ${endDate}) has been submitted and is pending approval.`
    );

    res.status(201).json({ message: 'Leave request created successfully', leaveRequest });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all leave requests (admin/HOD)
exports.getAllLeaveRequests = async (req, res) => {
  try {
    const leaveRequests = await Leave.find().sort({ submittedDate: -1 });
    res.json(leaveRequests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get leave requests by applicant (staff or student)
exports.getLeaveRequestsByApplicant = async (req, res) => {
  try {
    const { applicantId } = req.params;
    const leaveRequests = await Leave.find({ applicantId }).sort({ submittedDate: -1 });
    res.json(leaveRequests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get pending leave requests for HOD (same for all staff/student requests in their department)
exports.getPendingLeaveRequestsForHOD = async (req, res) => {
  try {
    const { department } = req.params;
    const leaveRequests = await Leave.find({
      department,
      hodStatus: 'pending'
    }).sort({ submittedDate: -1 });
    res.json(leaveRequests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get pending leave requests for Admin (same for all staff/student requests)
exports.getPendingLeaveRequestsForAdmin = async (req, res) => {
  try {
    const leaveRequests = await Leave.find({
      hodStatus: 'approved',
      adminStatus: 'pending'
    }).sort({ submittedDate: -1 });
    res.json(leaveRequests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Approve or reject at Staff level (for student applications)
exports.updateStaffStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, comments } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be "approved" or "rejected"' });
    }

    const leaveRequest = await Leave.findById(id);
    if (!leaveRequest) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    leaveRequest.staffStatus = status;
    if (comments) leaveRequest.staffComments = comments;

    await leaveRequest.save();

    // Send notification
    const message = status === 'approved'
      ? `Your leave request has been approved by staff and forwarded to HOD.`
      : `Your leave request has been rejected by staff. Reason: ${comments || 'No reason provided'}`;

    await sendNotification(leaveRequest.applicantId, `Leave Request ${status === 'approved' ? 'Approved' : 'Rejected'} by Staff`, message);

    res.json({ message: `Leave request ${status} at staff level`, leaveRequest });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Approve or reject at HOD level (same for both staff and student applications)
exports.updateHODStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, comments, substituteTeacher } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be "approved" or "rejected"' });
    }

    const leaveRequest = await Leave.findById(id);
    if (!leaveRequest) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    leaveRequest.hodStatus = status;
    if (comments) leaveRequest.hodComments = comments;
    if (substituteTeacher && leaveRequest.applicantType === 'staff') {
      leaveRequest.substituteTeacher = substituteTeacher;
      leaveRequest.substituteStatus = 'pending';
    }

    await leaveRequest.save();

    // Send notification
    const message = status === 'approved'
      ? `Your leave request has been approved by HOD and forwarded to Admin for final approval.`
      : `Your leave request has been rejected by HOD. Reason: ${comments || 'No reason provided'}`;

    await sendNotification(leaveRequest.applicantId, `Leave Request ${status === 'approved' ? 'Approved' : 'Rejected'} by HOD`, message);

    res.json({ message: `Leave request ${status} at HOD level`, leaveRequest });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Approve or reject at Admin level (same for both staff and student applications)
exports.updateAdminStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, comments } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be "approved" or "rejected"' });
    }

    const leaveRequest = await Leave.findById(id);
    if (!leaveRequest) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    leaveRequest.adminStatus = status;
    if (comments) leaveRequest.adminComments = comments;

    await leaveRequest.save();

    // Send notification
    const message = status === 'approved'
      ? `Your leave request has been finally approved by Admin. Your leave is confirmed for ${leaveRequest.days} days.`
      : `Your leave request has been rejected by Admin. Reason: ${comments || 'No reason provided'}`;

    await sendNotification(leaveRequest.applicantId, `Leave Request ${status === 'approved' ? 'Approved' : 'Rejected'} by Admin`, message);

    res.json({ message: `Leave request ${status} at admin level`, leaveRequest });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get leave statistics
exports.getLeaveStatistics = async (req, res) => {
  try {
    const stats = await Leave.aggregate([
      {
        $group: {
          _id: '$applicantType',
          totalRequests: { $sum: 1 },
          approved: { $sum: { $cond: [{ $eq: ['$adminStatus', 'approved'] }, 1, 0] } },
          rejected: { $sum: { $cond: [{ $eq: ['$adminStatus', 'rejected'] }, 1, 0] } },
          pending: { $sum: { $cond: [{ $eq: ['$adminStatus', 'pending'] }, 1, 0] } },
        },
      },
    ]);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
