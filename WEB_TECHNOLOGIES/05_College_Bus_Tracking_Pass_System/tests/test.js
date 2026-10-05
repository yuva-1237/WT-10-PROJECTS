const assert = require('assert');

// Core Business Logic
function checkPassValidity(validUntilStr, referenceDateStr = '2026-10-05') {
  const expiry = new Date(validUntilStr);
  const ref = new Date(referenceDateStr);
  expiry.setHours(0, 0, 0, 0);
  ref.setHours(0, 0, 0, 0);

  return ref.getTime() <= expiry.getTime() ? 'Valid' : 'Expired';
}

function searchRoutesByStop(buses, stopQuery) {
  const query = stopQuery.toLowerCase();
  return buses.filter(bus => 
    bus.routeName.toLowerCase().includes(query) ||
    bus.stops.some(s => s.name.toLowerCase().includes(query))
  );
}

function generateDigitalPass(existingPasses, passData) {
  const errors = [];
  if (!passData.studentId || passData.studentId.trim().length < 3) errors.push('Student ID is required.');
  if (!passData.studentName || passData.studentName.trim().length < 2) errors.push('Student name is required.');
  if (!passData.busNumber) errors.push('Bus assignment is required.');
  if (!passData.boardingStop) errors.push('Boarding stop is required.');
  if (!passData.validUntil) errors.push('Validity expiry date is required.');

  // Check duplicate active pass for same student
  const hasActivePass = existingPasses.some(p => 
    p.studentId === passData.studentId && p.status === 'Valid'
  );
  if (hasActivePass) {
    errors.push('Student already holds an active bus pass.');
  }

  if (errors.length > 0) return { success: false, errors };

  const pass = {
    ...passData,
    passId: `BPASS-${Date.now().toString().slice(-4)}`,
    status: 'Valid',
    issueDate: new Date().toISOString().split('T')[0]
  };

  return { success: true, pass };
}

function updateBusProgress(bus, newStopIndex) {
  if (newStopIndex < 0 || newStopIndex >= bus.stops.length) {
    return { success: false, error: 'Invalid stop index.' };
  }
  bus.currentStopIndex = newStopIndex;
  if (newStopIndex === 0) bus.currentStatus = 'Not Started';
  else if (newStopIndex === bus.stops.length - 1) bus.currentStatus = 'At College';
  else bus.currentStatus = 'On Route';
  return { success: true, bus };
}

// TEST SUITE
console.log('Running Tests for 05 College Bus Tracking and Pass System...');
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

const mockBuses = [
  {
    busNumber: 'TN-20-CZ-1001',
    routeName: 'Tambaram → PEC Campus',
    stops: [{ name: 'Tambaram' }, { name: 'Chromepet' }, { name: 'PEC Campus' }],
    currentStopIndex: 0,
    currentStatus: 'Not Started'
  },
  {
    busNumber: 'TN-20-CZ-1002',
    routeName: 'Avadi → PEC Campus',
    stops: [{ name: 'Avadi' }, { name: 'Thirumullaivoyal' }, { name: 'PEC Campus' }],
    currentStopIndex: 2,
    currentStatus: 'At College'
  }
];

// Test Case 1: Pass Expiry Verification
runTest('Test Case 1: Digital Pass Validity and Expiry Check', () => {
  assert.strictEqual(checkPassValidity('2026-12-31', '2026-10-05'), 'Valid');
  assert.strictEqual(checkPassValidity('2026-09-30', '2026-10-05'), 'Expired');
  assert.strictEqual(checkPassValidity('2026-10-05', '2026-10-05'), 'Valid');
});

// Test Case 2: Route Search by Intermediate Stop
runTest('Test Case 2: Bus Search by Stop Name (Chromepet)', () => {
  const matches = searchRoutesByStop(mockBuses, 'chromepet');
  assert.strictEqual(matches.length, 1);
  assert.strictEqual(matches[0].busNumber, 'TN-20-CZ-1001');

  const noMatches = searchRoutesByStop(mockBuses, 'vellore');
  assert.strictEqual(noMatches.length, 0);
});

// Test Case 3: Digital Pass Generation
runTest('Test Case 3: Digital Pass Creation with Automatic ID and Validity', () => {
  const passData = {
    studentId: 'PEC2023CS010',
    studentName: 'Ravi',
    busNumber: 'TN-20-CZ-1001',
    boardingStop: 'Chromepet',
    validUntil: '2026-12-31'
  };
  const res = generateDigitalPass([], passData);
  assert.strictEqual(res.success, true);
  assert.strictEqual(res.pass.status, 'Valid');
  assert.ok(res.pass.passId.startsWith('BPASS-'));
});

// Test Case 4: Duplicate Pass Prevention
runTest('Test Case 4: Rejection of Duplicate Active Bus Pass', () => {
  const existing = [{ studentId: 'PEC2023CS001', status: 'Valid' }];
  const passData = {
    studentId: 'PEC2023CS001',
    studentName: 'Yuvathilagan',
    busNumber: 'TN-20-CZ-1001',
    boardingStop: 'Tambaram',
    validUntil: '2026-12-31'
  };
  const res = generateDigitalPass(existing, passData);
  assert.strictEqual(res.success, false);
  assert.ok(res.errors.includes('Student already holds an active bus pass.'));
});

// Test Case 5: Bus Stop Progression Logic
runTest('Test Case 5: Bus Progress Transition (Not Started -> On Route -> At College)', () => {
  const bus = {
    busNumber: 'TN-10',
    stops: [{ name: 'A' }, { name: 'B' }, { name: 'C' }],
    currentStopIndex: 0,
    currentStatus: 'Not Started'
  };
  updateBusProgress(bus, 1);
  assert.strictEqual(bus.currentStatus, 'On Route');

  updateBusProgress(bus, 2);
  assert.strictEqual(bus.currentStatus, 'At College');
});

console.log(`\nResults: ${passed} passed, ${failed} failed.`);
if (failed > 0) process.exit(1);
