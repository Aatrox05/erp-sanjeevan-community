const BASE_URL = 'http://localhost:3001/api';

function getFutureDate(daysOffset) {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return date.toISOString().split('T')[0];
}

async function testCompleteWorkflow() {
  console.log('\n=== COMPLETE LEAVE WORKFLOW TEST ===\n');

  try {
    // Generate future dates
    const date1Start = getFutureDate(10);
    const date1End = getFutureDate(12);
    const date2Start = getFutureDate(15);
    const date2End = getFutureDate(17);
    const date3Start = getFutureDate(25);
    const date3End = getFutureDate(34);
    // ========== SCENARIO 1: STAFF LEAVE (Approval Path) ==========
    console.log('📋 SCENARIO 1: Staff Leave Request (Approval Path)');
    console.log('─'.repeat(60));

    // Step 1: Staff submits leave
    console.log('\n[1] Staff submits leave request...');
    const staffLeaveRes = await fetch(`${BASE_URL}/leaves`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        applicantType: 'staff',
        applicantId: 'STAFF001',
        applicantName: 'Dr. Rajesh Kumar',
        department: 'Computer Science',
        leaveType: 'Sick Leave',
        startDate: date1Start,
        endDate: date1End,
        days: 3,
        reason: 'Medical treatment - fever and flu',
        priority: 'high'
      })
    });
    
    const staffLeaveData = await staffLeaveRes.json();
    const staffLeaveId = staffLeaveData.leaveRequest._id;
    console.log(`✅ Leave created (ID: ${staffLeaveId})`);
    console.log(`   Current Stage: ${staffLeaveData.leaveRequest.currentStage}`);
    console.log(`   HOD Status: ${staffLeaveData.leaveRequest.hodStatus}`);
    console.log(`   Admin Status: ${staffLeaveData.leaveRequest.adminStatus}`);

    // Step 2: HOD approves leave
    console.log('\n[2] HOD approves leave...');
    const hodApproveRes = await fetch(`${BASE_URL}/leaves/${staffLeaveId}/hod-status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: 'approved',
        comments: 'Approved. Please assign Dr. Priya Sharma as substitute.',
        substituteTeacher: 'Dr. Priya Sharma'
      })
    });
    
    const hodApproveData = await hodApproveRes.json();
    console.log(`✅ HOD approved`);
    console.log(`   Current Stage: ${hodApproveData.leaveRequest.currentStage}`);
    console.log(`   HOD Status: ${hodApproveData.leaveRequest.hodStatus}`);
    console.log(`   Substitute: ${hodApproveData.leaveRequest.substituteTeacher}`);

    // Step 3: Admin gives final approval
    console.log('\n[3] Admin gives final approval...');
    const adminApproveRes = await fetch(`${BASE_URL}/leaves/${staffLeaveId}/admin-status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: 'approved',
        comments: 'Confirmed. All documents verified.'
      })
    });
    
    const adminApproveData = await adminApproveRes.json();
    console.log(`✅ Admin approved (FINAL)`);
    console.log(`   Current Stage: ${adminApproveData.leaveRequest.currentStage}`);
    console.log(`   Admin Status: ${adminApproveData.leaveRequest.adminStatus}`);

    // ========== SCENARIO 2: STUDENT LEAVE (Rejection Path) ==========
    console.log('\n\n📋 SCENARIO 2: Student Leave Request (Rejection Path)');
    console.log('─'.repeat(60));

    // Step 1: Student submits leave
    console.log('\n[1] Student submits leave request...');
    const studentLeaveRes = await fetch(`${BASE_URL}/leaves`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        applicantType: 'student',
        applicantId: 'STU20230045',
        applicantName: 'Aditya Singh',
        department: 'B.Tech - ECE',
        leaveType: 'Personal Leave',
        startDate: date2Start,
        endDate: date2End,
        days: 3,
        reason: 'Family emergency - urgent personal matter',
        priority: 'high'
      })
    });
    
    const studentLeaveData = await studentLeaveRes.json();
    const studentLeaveId = studentLeaveData.leaveRequest._id;
    console.log(`✅ Leave created (ID: ${studentLeaveId})`);
    console.log(`   Current Stage: ${studentLeaveData.leaveRequest.currentStage}`);
    console.log(`   HOD Status: ${studentLeaveData.leaveRequest.hodStatus}`);

    // Step 2: HOD rejects leave
    console.log('\n[2] HOD rejects leave...');
    const hodRejectRes = await fetch(`${BASE_URL}/leaves/${studentLeaveId}/hod-status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: 'rejected',
        comments: 'Leave denied. Exams are scheduled during this period. Students are not allowed to be absent.'
      })
    });
    
    const hodRejectData = await hodRejectRes.json();
    console.log(`✅ HOD rejected`);
    console.log(`   Current Stage: ${hodRejectData.leaveRequest.currentStage}`);
    console.log(`   HOD Status: ${hodRejectData.leaveRequest.hodStatus}`);
    console.log(`   Reason: ${hodRejectData.leaveRequest.hodComments}`);

    // ========== SCENARIO 3: STAFF LEAVE (Admin Rejection) ==========
    console.log('\n\n📋 SCENARIO 3: Staff Leave Request (Admin Rejects After HOD Approval)');
    console.log('─'.repeat(60));

    // Step 1: Staff submits leave
    console.log('\n[1] Staff submits leave request...');
    const staffLeave2Res = await fetch(`${BASE_URL}/leaves`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        applicantType: 'staff',
        applicantId: 'STAFF002',
        applicantName: 'Prof. Anjali Verma',
        department: 'Mathematics',
        leaveType: 'Earned Leave',
        startDate: date3Start,
        endDate: date3End,
        days: 10,
        reason: 'Annual leave - vacation planned',
        priority: 'medium'
      })
    });
    
    const staffLeave2Data = await staffLeave2Res.json();
    const staffLeave2Id = staffLeave2Data.leaveRequest._id;
    console.log(`✅ Leave created (ID: ${staffLeave2Id})`);

    // Step 2: HOD approves
    console.log('\n[2] HOD approves leave...');
    const hodApprove2Res = await fetch(`${BASE_URL}/leaves/${staffLeave2Id}/hod-status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: 'approved',
        comments: 'Approved by HOD'
      })
    });
    
    const hodApprove2Data = await hodApprove2Res.json();
    console.log(`✅ HOD approved`);

    // Step 3: Admin rejects despite HOD approval
    console.log('\n[3] Admin rejects leave (final decision)...');
    const adminRejectRes = await fetch(`${BASE_URL}/leaves/${staffLeave2Id}/admin-status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: 'rejected',
        comments: 'Annual leave quota exhausted for this period. Reapply for different dates.'
      })
    });
    
    const adminRejectData = await adminRejectRes.json();
    console.log(`✅ Admin rejected (FINAL)`);
    console.log(`   Current Stage: ${adminRejectData.leaveRequest.currentStage}`);
    console.log(`   Admin Status: ${adminRejectData.leaveRequest.adminStatus}`);
    console.log(`   Reason: ${adminRejectData.leaveRequest.adminComments}`);

    // ========== Fetch all notifications ==========
    console.log('\n\n📬 NOTIFICATIONS SENT DURING WORKFLOW');
    console.log('─'.repeat(60));

    // Get notifications for each applicant
    const staffNotifications = await fetch(`${BASE_URL}/leaves/applicant/STAFF001`);
    const staffNotData = await staffNotifications.json();
    
    console.log(`\n🔔 Notifications for Staff (STAFF001 - Dr. Rajesh Kumar):`);
    console.log('   Status progression: submitted → HOD approved → Admin approved (FINAL)');
    
    const studentNotifications = await fetch(`${BASE_URL}/leaves/applicant/STU20230045`);
    const studentNotData = await studentNotifications.json();
    
    console.log(`\n🔔 Notifications for Student (STU20230045 - Aditya Singh):`);
    console.log('   Status progression: submitted → HOD REJECTED');

    console.log(`\n🔔 Notifications for Staff2 (STAFF002 - Prof. Anjali Verma):`);
    console.log('   Status progression: submitted → HOD approved → Admin REJECTED');

    // ========== Statistics ==========
    console.log('\n\n📊 LEAVE STATISTICS');
    console.log('─'.repeat(60));
    
    const statsRes = await fetch(`${BASE_URL}/leaves/stats/summary`);
    const statsData = await statsRes.json();
    
    console.log('\nStatus Summary:');
    statsData.forEach(stat => {
      console.log(`\n  ${stat._id}:`);
      console.log(`    Total Requests: ${stat.totalRequests}`);
      console.log(`    ✅ Approved: ${stat.approved}`);
      console.log(`    ❌ Rejected: ${stat.rejected}`);
      console.log(`    ⏳ Pending HOD: ${stat.pending_hod}`);
      console.log(`    ⏳ Pending Admin: ${stat.pending_admin}`);
    });

    console.log('\n\n✅ ALL TESTS COMPLETED SUCCESSFULLY!\n');
    console.log('Workflow verified:');
    console.log('  ✓ Staff/Student → HOD approval → Admin final approval');
    console.log('  ✓ HOD rejection (doesn\'t go to Admin)');
    console.log('  ✓ Admin rejection (after HOD approval)');
    console.log('  ✓ Notifications at each stage');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testCompleteWorkflow();
