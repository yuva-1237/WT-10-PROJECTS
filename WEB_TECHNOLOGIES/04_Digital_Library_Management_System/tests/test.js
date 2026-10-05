const assert = require('assert');

// Core Calculation & Business Logic
function calculateFine(dueDateStr, returnDateStr, ratePerDay = 5) {
  const due = new Date(dueDateStr);
  const ret = new Date(returnDateStr);
  const diffTime = ret.getTime() - due.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays > 0) {
    return {
      lateDays: diffDays,
      fine: diffDays * ratePerDay
    };
  }
  return { lateDays: 0, fine: 0 };
}

function issueBook(book, studentId, studentName, issueDateStr, loanDays = 14) {
  if (book.availableCopies <= 0) {
    return { success: false, error: 'No copies available for issue.' };
  }

  book.availableCopies -= 1;
  const issueDate = new Date(issueDateStr);
  const dueDate = new Date(issueDate);
  dueDate.setDate(dueDate.getDate() + loanDays);

  const issueRecord = {
    id: `ISS-${Date.now()}`,
    bookId: book.id,
    bookTitle: book.title,
    studentId,
    studentName,
    issueDate: issueDate.toISOString().split('T')[0],
    dueDate: dueDate.toISOString().split('T')[0],
    returnDate: null,
    finePaid: 0,
    status: 'Issued'
  };

  return { success: true, issueRecord };
}

function returnBook(book, issueRecord, returnDateStr, ratePerDay = 5) {
  if (issueRecord.status === 'Returned') {
    return { success: false, error: 'Book already marked as returned.' };
  }

  const { lateDays, fine } = calculateFine(issueRecord.dueDate, returnDateStr, ratePerDay);
  issueRecord.returnDate = returnDateStr;
  issueRecord.lateDays = lateDays;
  issueRecord.finePaid = fine;
  issueRecord.status = 'Returned';

  if (book.availableCopies < book.quantity) {
    book.availableCopies += 1;
  }

  return { success: true, lateDays, fine };
}

function filterBooks(books, query, category) {
  return books.filter(b => {
    const q = query.toLowerCase();
    const matchesSearch = !query || 
      b.title.toLowerCase().includes(q) || 
      b.author.toLowerCase().includes(q) || 
      b.isbn.toLowerCase().includes(q);
    const matchesCat = !category || b.category === category;
    return matchesSearch && matchesCat;
  });
}

// TEST SUITE
console.log('Running Tests for 04 Digital Library Management System...');
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

// Test Case 1: Dynamic Fine Calculation for Overdue Book
runTest('Test Case 1: Dynamic Fine Calculation (5 days overdue at ₹5/day)', () => {
  const result = calculateFine('2026-10-10', '2026-10-15', 5);
  assert.strictEqual(result.lateDays, 5);
  assert.strictEqual(result.fine, 25);
});

// Test Case 2: Zero Fine for On-Time Return
runTest('Test Case 2: Zero Fine for On-Time or Early Book Return', () => {
  const onTime = calculateFine('2026-10-10', '2026-10-10', 5);
  assert.strictEqual(onTime.lateDays, 0);
  assert.strictEqual(onTime.fine, 0);

  const early = calculateFine('2026-10-10', '2026-10-06', 5);
  assert.strictEqual(early.lateDays, 0);
  assert.strictEqual(early.fine, 0);
});

// Test Case 3: Available Copies Decrement on Issue
runTest('Test Case 3: Available Copies Decrement Upon Issue', () => {
  const book = { id: 'BK-1', title: 'Web Tech', quantity: 3, availableCopies: 3 };
  const res = issueBook(book, 'STU01', 'Yuva', '2026-10-01', 14);
  assert.strictEqual(res.success, true);
  assert.strictEqual(book.availableCopies, 2);
  assert.strictEqual(res.issueRecord.dueDate, '2026-10-15');
});

// Test Case 4: Stock Depletion Protection
runTest('Test Case 4: Issue Rejection when Available Copies is 0', () => {
  const outOfStockBook = { id: 'BK-2', title: 'AI Systems', quantity: 1, availableCopies: 0 };
  const res = issueBook(outOfStockBook, 'STU02', 'Kavitha', '2026-10-01', 14);
  assert.strictEqual(res.success, false);
  assert.strictEqual(res.error, 'No copies available for issue.');
});

// Test Case 5: Stock Increment and Return Tracking
runTest('Test Case 5: Available Copies Restored on Return', () => {
  const book = { id: 'BK-1', title: 'Web Tech', quantity: 3, availableCopies: 2 };
  const issueRecord = { id: 'ISS-1', dueDate: '2026-10-10', status: 'Issued' };
  const res = returnBook(book, issueRecord, '2026-10-12', 5); // 2 days late
  assert.strictEqual(res.success, true);
  assert.strictEqual(book.availableCopies, 3);
  assert.strictEqual(res.lateDays, 2);
  assert.strictEqual(res.fine, 10);
});

console.log(`\nResults: ${passed} passed, ${failed} failed.`);
if (failed > 0) process.exit(1);
