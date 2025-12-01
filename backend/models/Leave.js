const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema(
  {
    // Applicant info (can be staff or student)
    applicantType: {
      type: String,
      enum: ['staff', 'student'],
      required: true,
    },
    applicantId: {
      type: String,
      required: true,
    },
    applicantName: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },

    // Leave details
    leaveType: {
      type: String,
      enum: ['Sick Leave', 'Casual Leave', 'Earned Leave', 'Personal Leave', 'Other'],
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    days: {
      type: Number,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },

    // Approval workflow (different for staff and student)
    // STUDENT: student → staff (intermediate) → hod (final)
    // STAFF: staff → hod (intermediate) → admin (final)
    
    // For STUDENT workflow: staff review
    staffStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    staffComments: String,
    
    // For STAFF workflow: hod review
    hodStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    hodComments: String,
    
    // For STAFF workflow: admin final review
    adminStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    adminComments: String,

    // For staff: substitute teacher assignment
    substituteTeacher: String,
    substituteStatus: {
      type: String,
      enum: ['pending', 'accepted', 'declined'],
    },

    // For student: staff reference (if applicable)
    staffReference: String,

    // Workflow stage tracking
    // STUDENT: student_pending → staff_pending → staff_approved/rejected → hod_pending → hod_approved/rejected
    // STAFF: staff_pending → hod_pending → hod_approved/rejected → admin_pending → admin_approved/rejected
    currentStage: {
      type: String,
      enum: ['student_pending', 'staff_pending', 'staff_approved', 'staff_rejected', 'hod_pending', 'hod_approved', 'hod_rejected', 'admin_pending', 'admin_approved', 'admin_rejected'],
      default: 'student_pending',
    },

    submittedDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Validation: ensure startDate <= endDate
leaveSchema.pre('save', function (next) {
  if (this.startDate > this.endDate) {
    return next(new Error('End date must be after or equal to start date'));
  }
  next();
});

module.exports = mongoose.model('Leave', leaveSchema);

