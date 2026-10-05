const assert = require('assert');

// Core Business Logic
function isSlotAvailable(appointments, doctorId, date, time) {
  return !appointments.some(apt => 
    apt.doctorId === doctorId &&
    apt.date === date &&
    apt.time === time &&
    apt.status === 'Booked'
  );
}

function bookAppointment(appointments, newApt) {
  const errors = validateAppointment(newApt);
  if (errors.length > 0) return { success: false, errors };

  if (!isSlotAvailable(appointments, newApt.doctorId, newApt.date, newApt.time)) {
    return { success: false, errors: ['Selected time slot is already booked for this doctor. Please pick another slot.'] };
  }

  const booked = {
    ...newApt,
    id: `APT-${Date.now()}`,
    status: 'Booked'
  };
  return { success: true, appointment: booked };
}

function cancelAppointment(appointments, aptId) {
  const apt = appointments.find(a => a.id === aptId);
  if (!apt) return { success: false, error: 'Appointment not found.' };
  if (apt.status === 'Cancelled') return { success: false, error: 'Appointment is already cancelled.' };
  apt.status = 'Cancelled';
  return { success: true, appointment: apt };
}

function filterDoctors(doctors, query, specialization) {
  return doctors.filter(doc => {
    const matchesSearch = !query || 
      doc.name.toLowerCase().includes(query.toLowerCase()) || 
      doc.specialization.toLowerCase().includes(query.toLowerCase());
    const matchesSpec = !specialization || doc.specialization === specialization;
    return matchesSearch && matchesSpec;
  });
}

function validateAppointment(apt) {
  const errors = [];
  if (!apt.patientName || apt.patientName.trim().length < 2) errors.push('Patient name is required.');
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(apt.patientEmail)) errors.push('Valid email is required.');
  const phoneRegex = /^[6-9]\d{9}$/;
  if (!phoneRegex.test(apt.patientPhone)) errors.push('Valid 10-digit mobile number starting with 6-9 is required.');
  if (!apt.doctorId) errors.push('Doctor selection is required.');
  if (!apt.date) errors.push('Appointment date is required.');
  if (!apt.time) errors.push('Appointment time slot is required.');
  return errors;
}

// TEST SUITE
console.log('Running Tests for 03 Hospital Appointment Management System...');
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

// Test Case 1: Double-Booking Prevention
runTest('Test Case 1: Double-Booking Prevention for Same Doctor, Date and Slot', () => {
  const appointments = [
    { id: 'APT-1', doctorId: 'DOC001', date: '2026-10-15', time: '10:00 AM', status: 'Booked' }
  ];
  assert.strictEqual(isSlotAvailable(appointments, 'DOC001', '2026-10-15', '10:00 AM'), false);
  assert.strictEqual(isSlotAvailable(appointments, 'DOC001', '2026-10-15', '11:00 AM'), true);
  assert.strictEqual(isSlotAvailable(appointments, 'DOC002', '2026-10-15', '10:00 AM'), true);

  const duplicateApt = {
    patientName: 'Anita',
    patientEmail: 'anita@gmail.com',
    patientPhone: '9840112233',
    doctorId: 'DOC001',
    date: '2026-10-15',
    time: '10:00 AM'
  };
  const result = bookAppointment(appointments, duplicateApt);
  assert.strictEqual(result.success, false);
  assert.ok(result.errors.includes('Selected time slot is already booked for this doctor. Please pick another slot.'));
});

// Test Case 2: Slot Re-availability on Cancellation
runTest('Test Case 2: Slot Becomes Available Upon Cancellation', () => {
  const appointments = [
    { id: 'APT-1', doctorId: 'DOC001', date: '2026-10-15', time: '10:00 AM', status: 'Booked' }
  ];
  cancelAppointment(appointments, 'APT-1');
  assert.strictEqual(appointments[0].status, 'Cancelled');
  assert.strictEqual(isSlotAvailable(appointments, 'DOC001', '2026-10-15', '10:00 AM'), true);
});

// Test Case 3: Validation of Patient Form Fields
runTest('Test Case 3: Form Validation for Contact, Email and Required Fields', () => {
  const invalid = { patientName: '', patientEmail: 'bad-email', patientPhone: '123' };
  const errs = validateAppointment(invalid);
  assert.ok(errs.includes('Patient name is required.'));
  assert.ok(errs.includes('Valid email is required.'));
  assert.ok(errs.includes('Valid 10-digit mobile number starting with 6-9 is required.'));
});

// Test Case 4: Doctor Search and Specialization Filter
runTest('Test Case 4: Multi-Criteria Doctor Search and Filtering', () => {
  const doctors = [
    { id: '1', name: 'Dr. Rajesh Varma', specialization: 'Cardiology' },
    { id: '2', name: 'Dr. Priya Sundaram', specialization: 'Orthopedics' },
    { id: '3', name: 'Dr. Arvind', specialization: 'Pediatrics' }
  ];
  const ortho = filterDoctors(doctors, '', 'Orthopedics');
  assert.strictEqual(ortho.length, 1);
  assert.strictEqual(ortho[0].name, 'Dr. Priya Sundaram');

  const searchRajesh = filterDoctors(doctors, 'rajesh', '');
  assert.strictEqual(searchRajesh.length, 1);
  assert.strictEqual(searchRajesh[0].id, '1');
});

// Test Case 5: Transition between Appointment Statuses
runTest('Test Case 5: Appointment Status Transition Consistency', () => {
  const appointments = [
    { id: 'APT-99', doctorId: 'DOC001', date: '2026-10-20', time: '09:00 AM', status: 'Booked' }
  ];
  const res1 = cancelAppointment(appointments, 'APT-99');
  assert.strictEqual(res1.success, true);
  // Re-cancellation should fail
  const res2 = cancelAppointment(appointments, 'APT-99');
  assert.strictEqual(res2.success, false);
  assert.strictEqual(res2.error, 'Appointment is already cancelled.');
});

console.log(`\nResults: ${passed} passed, ${failed} failed.`);
if (failed > 0) process.exit(1);
