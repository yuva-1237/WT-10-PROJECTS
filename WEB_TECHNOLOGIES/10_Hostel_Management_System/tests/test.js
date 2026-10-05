const assert = require('assert');

// Core Hostel Business Logic
function calculateHostelStats(rooms, leaveRequests, complaints) {
  const totalRooms = rooms.length;
  const occupiedRooms = rooms.filter(r => r.occupied > 0).length;
  const availableRooms = rooms.filter(r => r.available > 0).length;
  const pendingLeaves = leaveRequests.filter(l => l.status === 'Pending').length;
  const pendingComplaints = complaints.filter(c => c.status !== 'Resolved').length;

  return {
    totalRooms,
    occupiedRooms,
    availableRooms,
    pendingLeaves,
    pendingComplaints
  };
}

function allocateStudentRoom(student, targetRoomNo, rooms, students) {
  const room = rooms.find(r => r.roomNo === targetRoomNo);
  if (!room) {
    return { success: false, error: 'Target room does not exist.' };
  }
  if (room.available <= 0) {
    return { success: false, error: 'Cannot allocate: Target room has no available capacity.' };
  }

  // If student already occupied another room, free up 1 bed in previous room
  if (student.roomNo && student.roomNo !== 'Unallocated') {
    const prevRoom = rooms.find(r => r.roomNo === student.roomNo);
    if (prevRoom) {
      prevRoom.occupied = Math.max(0, prevRoom.occupied - 1);
      prevRoom.available = prevRoom.capacity - prevRoom.occupied;
    }
  }

  // Update target room
  room.occupied += 1;
  room.available = room.capacity - room.occupied;

  // Update student
  student.roomNo = room.roomNo;
  student.block = room.block;
  student.bedNo = `Bed ${room.occupied}`;

  return { success: true, student, room };
}

function submitLeaveRequest(studentId, studentName, roomNo, reason, fromDate, toDate) {
  const from = new Date(fromDate);
  const to = new Date(toDate);

  if (to.getTime() < from.getTime()) {
    return { success: false, error: 'Return date cannot precede departure date.' };
  }
  if (!reason || reason.trim().length < 5) {
    return { success: false, error: 'Meaningful reason for leave is required.' };
  }

  const newLeave = {
    id: `LEV-${Math.floor(500 + Math.random() * 500)}`,
    studentId,
    studentName,
    roomNo,
    reason,
    fromDate,
    toDate,
    parentApproved: true,
    status: 'Pending',
    submittedOn: new Date().toISOString(),
    remarks: ''
  };

  return { success: true, leave: newLeave };
}

function updateLeaveStatus(leave, newStatus, remarks) {
  if (!['Approved', 'Rejected'].includes(newStatus)) {
    return { success: false, error: 'Invalid leave status transition.' };
  }
  leave.status = newStatus;
  leave.remarks = remarks || '';
  return { success: true, leave };
}

function getRoommates(studentId, roomNo, students) {
  return students.filter(s => s.roomNo === roomNo && s.studentId !== studentId);
}

// TEST SUITE
console.log('Running Tests for 10 Hostel Management System...');
let passed = 0;
let failed = 0;

function runTest(name, fn) {
  try {
    fn();
    console.log(`  PASS: ${name}`);
    passed++;
  } catch (err) {
    console.error(`  FAIL: ${name} -> ${err.message}`);
    failed++;
  }
}

// Test Case 1: Room Allocation Rejection on Full Capacity
runTest('Test Case 1: Rejection of Room Allocation when Room is Full', () => {
  const rooms = [{ roomNo: '101', capacity: 2, occupied: 2, available: 0, block: 'Block A' }];
  const student = { studentId: 'PEC001', name: 'Karthik', roomNo: 'Unallocated' };
  const res = allocateStudentRoom(student, '101', rooms, [student]);
  assert.strictEqual(res.success, false);
  assert.strictEqual(res.error, 'Cannot allocate: Target room has no available capacity.');
});

// Test Case 2: Successful Room Allocation and Capacity Decrement
runTest('Test Case 2: Successful Room Allocation Updates Occupancy and Bed', () => {
  const rooms = [{ roomNo: '102', capacity: 3, occupied: 1, available: 2, block: 'Block A' }];
  const student = { studentId: 'PEC002', name: 'Sanjay', roomNo: 'Unallocated' };
  const res = allocateStudentRoom(student, '102', rooms, [student]);
  assert.strictEqual(res.success, true);
  assert.strictEqual(rooms[0].occupied, 2);
  assert.strictEqual(rooms[0].available, 1);
  assert.strictEqual(student.roomNo, '102');
  assert.strictEqual(student.bedNo, 'Bed 2');
});

// Test Case 3: Reallocation / Room Change Updates Both Old and New Rooms
runTest('Test Case 3: Room Change Decrements Source Room and Increments Target Room', () => {
  const rooms = [
    { roomNo: '101', capacity: 3, occupied: 3, available: 0, block: 'Block A' },
    { roomNo: '102', capacity: 3, occupied: 1, available: 2, block: 'Block A' }
  ];
  const student = { studentId: 'PEC003', name: 'Arun', roomNo: '101', bedNo: 'Bed 3' };
  const res = allocateStudentRoom(student, '102', rooms, [student]);
  assert.strictEqual(res.success, true);
  assert.strictEqual(rooms[0].occupied, 2, 'Previous room occupancy should decrease to 2');
  assert.strictEqual(rooms[0].available, 1, 'Previous room availability should increase to 1');
  assert.strictEqual(rooms[1].occupied, 2, 'New room occupancy should increase to 2');
  assert.strictEqual(rooms[1].available, 1, 'New room availability should decrease to 1');
});

// Test Case 4: Leave Request Date Validation
runTest('Test Case 4: Leave Request Date Validation (Return Date Cannot Precede Departure)', () => {
  const res = submitLeaveRequest('PEC001', 'Yuva', '101', 'Festival vacation', '2026-10-15', '2026-10-10');
  assert.strictEqual(res.success, false);
  assert.strictEqual(res.error, 'Return date cannot precede departure date.');
});

// Test Case 5: Dynamic Dashboard Statistics Verification
runTest('Test Case 5: Dynamic Dashboard Statistics Derived from Actual Data', () => {
  const rooms = [
    { roomNo: '101', capacity: 3, occupied: 3, available: 0 },
    { roomNo: '102', capacity: 3, occupied: 2, available: 1 },
    { roomNo: '201', capacity: 2, occupied: 0, available: 2 }
  ];
  const leaves = [
    { id: 'L1', status: 'Pending' },
    { id: 'L2', status: 'Approved' },
    { id: 'L3', status: 'Pending' }
  ];
  const complaints = [
    { id: 'C1', status: 'Submitted' },
    { id: 'C2', status: 'In Progress' },
    { id: 'C3', status: 'Resolved' }
  ];
  const stats = calculateHostelStats(rooms, leaves, complaints);
  assert.strictEqual(stats.totalRooms, 3);
  assert.strictEqual(stats.occupiedRooms, 2);
  assert.strictEqual(stats.availableRooms, 2);
  assert.strictEqual(stats.pendingLeaves, 2);
  assert.strictEqual(stats.pendingComplaints, 2);
});

console.log(`\nResults: ${passed} passed, ${failed} failed.`);
if (failed > 0) process.exit(1);
