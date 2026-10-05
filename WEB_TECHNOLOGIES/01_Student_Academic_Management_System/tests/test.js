const assert = require('assert');

// Core Calculation & Validation Logic
function calculateGrade(total) {
  if (total >= 90) return { grade: 'O', point: 10 };
  if (total >= 80) return { grade: 'A+', point: 9 };
  if (total >= 70) return { grade: 'A', point: 8 };
  if (total >= 60) return { grade: 'B+', point: 7 };
  if (total >= 50) return { grade: 'B', point: 6 };
  if (total >= 45) return { grade: 'C', point: 5 };
  return { grade: 'U', point: 0 };
}

function calculateCGPA(records, subjectsMap) {
  let totalPoints = 0;
  let totalCredits = 0;
  records.forEach(rec => {
    const total = (rec.internal || 0) + (rec.external || 0);
    const { point } = calculateGrade(total);
    const credits = subjectsMap[rec.subjectCode]?.credits || 3;
    totalPoints += point * credits;
    totalCredits += credits;
  });
  return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';
}

function validateStudent(student, existingIds = []) {
  const errors = [];
  if (!student.id || student.id.trim().length < 3) errors.push('Student ID must be at least 3 characters.');
  if (existingIds.includes(student.id.trim())) errors.push('Student ID already exists.');
  if (!student.name || student.name.trim().length < 2) errors.push('Student Name is required.');
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(student.email)) errors.push('Invalid email address format.');
  const phoneRegex = /^[6-9]\d{9}$/;
  if (!phoneRegex.test(student.phone)) errors.push('Phone must be a valid 10-digit number starting with 6-9.');
  return errors;
}

function validateMarks(internal, external) {
  const errors = [];
  if (isNaN(internal) || internal < 0 || internal > 40) errors.push('Internal mark must be between 0 and 40.');
  if (isNaN(external) || external < 0 || external > 60) errors.push('External mark must be between 0 and 60.');
  return errors;
}

// RUN TESTS
console.log('Running Tests for 01 Student Academic Management System...');
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

// Test Case 1: Grade Calculation
runTest('Test Case 1: Dynamic Grade Calculation', () => {
  assert.strictEqual(calculateGrade(95).grade, 'O');
  assert.strictEqual(calculateGrade(95).point, 10);
  assert.strictEqual(calculateGrade(82).grade, 'A+');
  assert.strictEqual(calculateGrade(74).grade, 'A');
  assert.strictEqual(calculateGrade(65).grade, 'B+');
  assert.strictEqual(calculateGrade(52).grade, 'B');
  assert.strictEqual(calculateGrade(46).grade, 'C');
  assert.strictEqual(calculateGrade(30).grade, 'U');
});

// Test Case 2: CGPA Calculation
runTest('Test Case 2: Accurate Weighted CGPA Calculation', () => {
  const subjectsMap = {
    'CS3401': { credits: 4 },
    'CS3491': { credits: 4 },
    'GE3451': { credits: 2 }
  };
  const records = [
    { subjectCode: 'CS3401', internal: 38, external: 56 }, // 94 -> O (10) * 4 = 40
    { subjectCode: 'CS3491', internal: 32, external: 50 }, // 82 -> A+ (9) * 4 = 36
    { subjectCode: 'GE3451', internal: 35, external: 55 }  // 90 -> O (10) * 2 = 20
  ];
  // Total points: 40 + 36 + 20 = 96. Total credits: 10. CGPA = 9.60
  const cgpa = calculateCGPA(records, subjectsMap);
  assert.strictEqual(cgpa, '9.60');
});

// Test Case 3: Form Validation for Student Registration
runTest('Test Case 3: Form Validation for Student Fields', () => {
  const valid = { id: 'PEC2023CS100', name: 'Ravi Teja', email: 'ravi@gmail.com', phone: '9840112233' };
  assert.strictEqual(validateStudent(valid, []).length, 0);

  const invalidEmail = { id: 'PEC2023CS101', name: 'Ravi', email: 'invalid-email', phone: '9840112233' };
  assert.ok(validateStudent(invalidEmail, []).includes('Invalid email address format.'));

  const invalidPhone = { id: 'PEC2023CS102', name: 'Ravi', email: 'ravi@gmail.com', phone: '123' };
  assert.ok(validateStudent(invalidPhone, []).includes('Phone must be a valid 10-digit number starting with 6-9.'));
});

// Test Case 4: Duplicate Student ID Prevention
runTest('Test Case 4: Duplicate Student ID Rejection', () => {
  const existing = ['PEC2023CS001', 'PEC2023CS002'];
  const duplicate = { id: 'PEC2023CS001', name: 'Clone User', email: 'clone@gmail.com', phone: '9876543210' };
  const errors = validateStudent(duplicate, existing);
  assert.ok(errors.includes('Student ID already exists.'));
});

// Test Case 5: Mark Limits Validation
runTest('Test Case 5: Internal (<=40) and External (<=60) Mark Boundary Validation', () => {
  assert.strictEqual(validateMarks(35, 55).length, 0);
  assert.ok(validateMarks(45, 50).includes('Internal mark must be between 0 and 40.'));
  assert.ok(validateMarks(30, 65).includes('External mark must be between 0 and 60.'));
  assert.ok(validateMarks(-5, 20).includes('Internal mark must be between 0 and 40.'));
});

console.log(`\nResults: ${passed} passed, ${failed} failed.`);
if (failed > 0) process.exit(1);
