const assert = require('assert');

// Core Business Logic
function registerForEvent(event, existingRegistrations, studentData, referenceDateStr = '2026-10-05') {
  const errors = [];

  // Check deadline
  const deadline = new Date(event.deadline);
  const refDate = new Date(referenceDateStr);
  deadline.setHours(23, 59, 59, 999);
  refDate.setHours(0, 0, 0, 0);

  if (refDate.getTime() > deadline.getTime()) {
    errors.push('Registration deadline for this event has passed.');
  }

  // Check capacity
  const confirmedForEvent = existingRegistrations.filter(r => 
    r.eventId === event.id && r.status === 'Confirmed'
  );
  if (confirmedForEvent.length >= event.maxParticipants) {
    errors.push('Event has reached maximum participant capacity.');
  }

  // Check duplicate
  const alreadyRegistered = confirmedForEvent.some(r => r.studentId === studentData.studentId);
  if (alreadyRegistered) {
    errors.push('Student is already registered for this event.');
  }

  // Form validation
  if (!studentData.studentName || studentData.studentName.trim().length < 2) {
    errors.push('Valid student name is required.');
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(studentData.email)) {
    errors.push('Valid email address is required.');
  }

  if (errors.length > 0) return { success: false, errors };

  const regId = `REG-EVT-${Math.floor(1000 + Math.random() * 9000)}`;
  const newRegistration = {
    regId,
    eventId: event.id,
    eventName: event.name,
    studentId: studentData.studentId,
    studentName: studentData.studentName,
    email: studentData.email,
    phone: studentData.phone,
    department: studentData.department || 'CSE',
    registeredDate: new Date().toISOString(),
    status: 'Confirmed'
  };

  return { success: true, registration: newRegistration };
}

function generateParticipantCSV(registrations) {
  const headers = ['Registration ID', 'Event Name', 'Student ID', 'Student Name', 'Email', 'Department', 'Status'];
  const rows = registrations.map(r => [
    r.regId,
    `"${r.eventName}"`,
    r.studentId,
    `"${r.studentName}"`,
    r.email,
    `"${r.department}"`,
    r.status
  ]);
  return [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
}

function filterEvents(events, query, category) {
  return events.filter(e => {
    const q = query.toLowerCase();
    const matchesSearch = !query || 
      e.name.toLowerCase().includes(q) || 
      e.description.toLowerCase().includes(q) || 
      e.venue.toLowerCase().includes(q);
    const matchesCat = !category || e.category === category;
    return matchesSearch && matchesCat;
  });
}

// TEST SUITE
console.log('Running Tests for 09 College Event Registration System...');
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

const mockEvent = {
  id: 'EVT-01',
  name: 'AI Hackathon',
  maxParticipants: 2,
  deadline: '2026-11-01',
  category: 'Technical'
};

// Test Case 1: Deadline Expiry Enforcement
runTest('Test Case 1: Prevention of Registration After Deadline', () => {
  const expiredEvent = { ...mockEvent, deadline: '2026-09-30' };
  const student = { studentId: 'PEC001', studentName: 'Yuva', email: 'yuva@gmail.com', phone: '9840112233' };
  const res = registerForEvent(expiredEvent, [], student, '2026-10-05');
  assert.strictEqual(res.success, false);
  assert.ok(res.errors.includes('Registration deadline for this event has passed.'));
});

// Test Case 2: Maximum Capacity Limit Enforcement
runTest('Test Case 2: Prevention of Registration When Capacity is Reached', () => {
  const fullRegistrations = [
    { eventId: 'EVT-01', studentId: 'STU1', status: 'Confirmed' },
    { eventId: 'EVT-01', studentId: 'STU2', status: 'Confirmed' }
  ]; // maxParticipants = 2
  const student = { studentId: 'PEC003', studentName: 'Karthik', email: 'karthik@gmail.com', phone: '9840112244' };
  const res = registerForEvent(mockEvent, fullRegistrations, student, '2026-10-05');
  assert.strictEqual(res.success, false);
  assert.ok(res.errors.includes('Event has reached maximum participant capacity.'));
});

// Test Case 3: Rejection of Duplicate Registration
runTest('Test Case 3: Duplicate Registration Guard for Same Student and Event', () => {
  const existing = [{ eventId: 'EVT-01', studentId: 'PEC001', status: 'Confirmed' }];
  const duplicate = { studentId: 'PEC001', studentName: 'Yuva', email: 'yuva@gmail.com', phone: '9840112233' };
  const res = registerForEvent(mockEvent, existing, duplicate, '2026-10-05');
  assert.strictEqual(res.success, false);
  assert.ok(res.errors.includes('Student is already registered for this event.'));
});

// Test Case 4: Unique Registration Token Generation
runTest('Test Case 4: Successful Registration Token Generation (REG-EVT-XXXX)', () => {
  const student = { studentId: 'PEC005', studentName: 'Ananya', email: 'ananya@gmail.com', phone: '9840112255' };
  const res = registerForEvent(mockEvent, [], student, '2026-10-05');
  assert.strictEqual(res.success, true);
  assert.ok(res.registration.regId.startsWith('REG-EVT-'));
  assert.strictEqual(res.registration.status, 'Confirmed');
});

// Test Case 5: Participant Data CSV Export
runTest('Test Case 5: Administrator Participant Data CSV Export Formatting', () => {
  const registrations = [
    { regId: 'REG-1', eventName: 'HackPEC', studentId: 'PEC01', studentName: 'Yuva', email: 'y@gmail.com', department: 'CSE', status: 'Confirmed' }
  ];
  const csv = generateParticipantCSV(registrations);
  assert.ok(csv.includes('Registration ID,Event Name,Student ID,Student Name,Email,Department,Status'));
  assert.ok(csv.includes('REG-1,"HackPEC",PEC01,"Yuva",y@gmail.com,"CSE",Confirmed'));
});

console.log(`\nResults: ${passed} passed, ${failed} failed.`);
if (failed > 0) process.exit(1);
