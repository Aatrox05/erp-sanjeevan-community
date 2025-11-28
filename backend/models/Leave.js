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

    // Approval workflow (same for both staff and student)
    staffStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    hodStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    adminStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },

    // Comments at each stage
    staffComments: String,
    hodComments: String,
    adminComments: String,

    // For staff: substitute teacher assignment
    substituteTeacher: String,
    substituteStatus: {
      type: String,
      enum: ['pending', 'accepted', 'declined'],
    },

    // For student: staff reference (if applicable)
    staffReference: String,

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
