const assert = require('assert');

// Core Business Logic
function calculateScore(answers, questions, passPercentage = 50) {
  let attempted = 0;
  let correctCount = 0;
  let incorrectCount = 0;

  questions.forEach(q => {
    const userAns = answers[q.id];
    if (userAns !== undefined && userAns !== null) {
      attempted++;
      if (userAns === q.correct) {
        correctCount++;
      } else {
        incorrectCount++;
      }
    }
  });

  const total = questions.length;
  const percentage = total > 0 ? ((correctCount / total) * 100).toFixed(1) : 0;
  const isPassed = parseFloat(percentage) >= passPercentage;

  return {
    total,
    attempted,
    unattempted: total - attempted,
    correctCount,
    incorrectCount,
    percentage: parseFloat(percentage),
    isPassed: isPassed ? 'PASS' : 'FAIL'
  };
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function validateQuestion(q) {
  const errors = [];
  if (!q.text || q.text.trim().length < 5) errors.push('Question text must be at least 5 characters.');
  if (!Array.isArray(q.options) || q.options.length !== 4) {
    errors.push('Question must have exactly 4 options.');
  } else {
    q.options.forEach((opt, idx) => {
      if (!opt || opt.trim().length === 0) errors.push(`Option ${String.fromCharCode(65 + idx)} cannot be empty.`);
    });
  }
  if (typeof q.correct !== 'number' || q.correct < 0 || q.correct > 3) {
    errors.push('Correct option index must be an integer between 0 and 3.');
  }
  return errors;
}

function validateExamDuration(minutes) {
  const min = parseInt(minutes, 10);
  if (isNaN(min) || min < 1 || min > 180) {
    return 'Exam duration must be between 1 and 180 minutes.';
  }
  return null;
}

// TEST SUITE
console.log('Running Tests for 02 Online Examination System...');
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

const mockQuestions = [
  { id: 1, text: 'HTML definition', options: ['A', 'B', 'C', 'D'], correct: 0 },
  { id: 2, text: 'CSS margin', options: ['A', 'B', 'C', 'D'], correct: 1 },
  { id: 3, text: 'JS addEventListener', options: ['A', 'B', 'C', 'D'], correct: 1 },
  { id: 4, text: 'typeof null', options: ['A', 'B', 'C', 'D'], correct: 2 }
];

// Test Case 1: Automatic Score Calculation
runTest('Test Case 1: Accurate Score and Statistics Calculation', () => {
  const answers = { 1: 0, 2: 1, 3: 0, 4: 2 }; // 1 correct, 2 correct, 3 wrong, 4 correct -> 3 correct out of 4
  const res = calculateScore(answers, mockQuestions, 50);
  assert.strictEqual(res.total, 4);
  assert.strictEqual(res.attempted, 4);
  assert.strictEqual(res.correctCount, 3);
  assert.strictEqual(res.incorrectCount, 1);
  assert.strictEqual(res.percentage, 75.0);
  assert.strictEqual(res.isPassed, 'PASS');
});

// Test Case 2: Pass/Fail Threshold
runTest('Test Case 2: Pass/Fail Determination on Threshold Boundary', () => {
  const failingAnswers = { 1: 3, 2: 3, 3: 3, 4: 3 }; // 0 correct
  const failRes = calculateScore(failingAnswers, mockQuestions, 50);
  assert.strictEqual(failRes.isPassed, 'FAIL');
  assert.strictEqual(failRes.percentage, 0.0);

  const passingAnswers = { 1: 0, 2: 1 }; // 2 correct out of 4 = 50%
  const passRes = calculateScore(passingAnswers, mockQuestions, 50);
  assert.strictEqual(passRes.percentage, 50.0);
  assert.strictEqual(passRes.isPassed, 'PASS');
});

// Test Case 3: Timer Formatter MM:SS
runTest('Test Case 3: Timer Seconds to MM:SS Formatter', () => {
  assert.strictEqual(formatTime(600), '10:00');
  assert.strictEqual(formatTime(59), '00:59');
  assert.strictEqual(formatTime(0), '00:00');
  assert.strictEqual(formatTime(125), '02:05');
});

// Test Case 4: Question Model Validation
runTest('Test Case 4: Admin Question Validation Check', () => {
  const valid = { text: 'What is CSS?', options: ['Style', 'Code', 'Script', 'Font'], correct: 0 };
  assert.strictEqual(validateQuestion(valid).length, 0);

  const invalid = { text: 'Why?', options: ['A', '', 'C'], correct: 5 };
  const errors = validateQuestion(invalid);
  assert.ok(errors.includes('Question text must be at least 5 characters.'));
  assert.ok(errors.includes('Question must have exactly 4 options.'));
  assert.ok(errors.includes('Correct option index must be an integer between 0 and 3.'));
});

// Test Case 5: Exam Duration Bounds Validation
runTest('Test Case 5: Exam Duration Boundary Check (1 to 180 min)', () => {
  assert.strictEqual(validateExamDuration(10), null);
  assert.strictEqual(validateExamDuration(0), 'Exam duration must be between 1 and 180 minutes.');
  assert.strictEqual(validateExamDuration(200), 'Exam duration must be between 1 and 180 minutes.');
});

console.log(`\nResults: ${passed} passed, ${failed} failed.`);
if (failed > 0) process.exit(1);
