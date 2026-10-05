const assert = require('assert');

// Core Business Logic
const ALLOWED_CATEGORIES = [
  'Classroom', 'Laboratory', 'Wi-Fi', 'Electricity', 
  'Water', 'Hostel', 'Cleanliness', 'Infrastructure', 'Other'
];

const WORKFLOW_ORDER = ['Submitted', 'Assigned', 'In Progress', 'Resolved', 'Closed'];

function calculateComplaintStats(complaints) {
  const total = complaints.length;
  const pending = complaints.filter(c => c.status === 'Submitted' || c.status === 'Assigned').length;
  const inProgress = complaints.filter(c => c.status === 'In Progress').length;
  const resolved = complaints.filter(c => c.status === 'Resolved' || c.status === 'Closed').length;

  return { total, pending, inProgress, resolved };
}

function validateComplaint(data) {
  const errors = [];
  if (!ALLOWED_CATEGORIES.includes(data.category)) {
    errors.push('Invalid maintenance category selected.');
  }
  if (!data.title || data.title.trim().length < 5) {
    errors.push('Complaint title must be at least 5 characters.');
  }
  if (!data.location || data.location.trim().length < 3) {
    errors.push('Campus location is required.');
  }
  if (!data.description || data.description.trim().length < 10) {
    errors.push('Description must be at least 10 characters.');
  }
  return errors;
}

function advanceComplaintStatus(complaint, newStatus, technicianName = null) {
  if (!WORKFLOW_ORDER.includes(newStatus)) {
    return { success: false, error: 'Invalid workflow status.' };
  }

  const curIdx = WORKFLOW_ORDER.indexOf(complaint.status);
  const nextIdx = WORKFLOW_ORDER.indexOf(newStatus);

  if (nextIdx < curIdx) {
    return { success: false, error: 'Cannot revert status backwards in workflow.' };
  }

  complaint.status = newStatus;
  if (technicianName) complaint.assignedTo = technicianName;
  if (newStatus === 'Resolved') complaint.resolvedDate = new Date().toISOString();
  return { success: true, complaint };
}

function submitFeedback(complaint, rating, comment) {
  if (complaint.status !== 'Resolved' && complaint.status !== 'Closed') {
    return { success: false, error: 'Feedback can only be provided for resolved complaints.' };
  }
  const r = parseInt(rating, 10);
  if (isNaN(r) || r < 1 || r > 5) {
    return { success: false, error: 'Rating must be an integer between 1 and 5.' };
  }
  complaint.feedbackRating = r;
  complaint.feedbackComment = comment || '';
  complaint.status = 'Closed';
  return { success: true, complaint };
}

function filterComplaints(complaints, query, category, status) {
  return complaints.filter(c => {
    const q = query.toLowerCase();
    const matchesSearch = !query || 
      c.title.toLowerCase().includes(q) || 
      c.location.toLowerCase().includes(q) || 
      c.id.toLowerCase().includes(q);
    const matchesCat = !category || c.category === category;
    const matchesStatus = !status || c.status === status;
    return matchesSearch && matchesCat && matchesStatus;
  });
}

// TEST SUITE
console.log('Running Tests for 08 College Complaint and Maintenance Portal...');
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

// Test Case 1: Workflow Progression Validation
runTest('Test Case 1: Sequential Workflow Progression (Submitted -> Assigned -> In Progress -> Resolved -> Closed)', () => {
  const cmp = { id: 'CMP-1', status: 'Submitted' };
  
  const step1 = advanceComplaintStatus(cmp, 'Assigned', 'Venkatesan');
  assert.strictEqual(step1.success, true);
  assert.strictEqual(cmp.status, 'Assigned');
  assert.strictEqual(cmp.assignedTo, 'Venkatesan');

  const step2 = advanceComplaintStatus(cmp, 'In Progress');
  assert.strictEqual(step2.success, true);
  assert.strictEqual(cmp.status, 'In Progress');

  const step3 = advanceComplaintStatus(cmp, 'Resolved');
  assert.strictEqual(step3.success, true);
  assert.strictEqual(cmp.status, 'Resolved');
  assert.ok(cmp.resolvedDate);
});

// Test Case 2: Feedback on Resolved Complaints
runTest('Test Case 2: Student Feedback Submission on Resolved Ticket', () => {
  const unresolved = { id: 'CMP-2', status: 'In Progress' };
  const failRes = submitFeedback(unresolved, 5, 'Great');
  assert.strictEqual(failRes.success, false);
  assert.strictEqual(failRes.error, 'Feedback can only be provided for resolved complaints.');

  const resolved = { id: 'CMP-3', status: 'Resolved' };
  const passRes = submitFeedback(resolved, 5, 'Problem fixed perfectly.');
  assert.strictEqual(passRes.success, true);
  assert.strictEqual(resolved.feedbackRating, 5);
  assert.strictEqual(resolved.status, 'Closed');
});

// Test Case 3: Accurate Dashboard Statistics Calculation
runTest('Test Case 3: Dynamic Calculation of Total, Pending, In Progress, and Resolved', () => {
  const mockComplaints = [
    { status: 'Submitted' },
    { status: 'Assigned' },
    { status: 'In Progress' },
    { status: 'In Progress' },
    { status: 'Resolved' },
    { status: 'Closed' }
  ];
  const stats = calculateComplaintStats(mockComplaints);
  assert.strictEqual(stats.total, 6);
  assert.strictEqual(stats.pending, 2); // Submitted + Assigned
  assert.strictEqual(stats.inProgress, 2);
  assert.strictEqual(stats.resolved, 2); // Resolved + Closed
});

// Test Case 4: Category and Input Form Validation
runTest('Test Case 4: Complaint Category & Field Length Validation', () => {
  const valid = { category: 'Wi-Fi', title: 'Slow network', location: 'Lab 2', description: 'Cannot open college portals' };
  assert.strictEqual(validateComplaint(valid).length, 0);

  const invalidCategory = { category: 'Spacecraft', title: 'Broken', location: 'Roof', description: 'Broken' };
  const errors = validateComplaint(invalidCategory);
  assert.ok(errors.includes('Invalid maintenance category selected.'));
  assert.ok(errors.includes('Description must be at least 10 characters.'));
});

// Test Case 5: Multi-Category Search & Filter
runTest('Test Case 5: Multi-Category Search and Filter Filtering', () => {
  const list = [
    { id: 'CMP-01', title: 'Water leakage', category: 'Water', location: 'Block A', status: 'Submitted' },
    { id: 'CMP-02', title: 'Fan issue', category: 'Electricity', location: 'Room 201', status: 'Assigned' }
  ];
  const water = filterComplaints(list, '', 'Water', '');
  assert.strictEqual(water.length, 1);
  assert.strictEqual(water[0].id, 'CMP-01');

  const searchLeak = filterComplaints(list, 'leakage', '', '');
  assert.strictEqual(searchLeak.length, 1);
});

console.log(`\nResults: ${passed} passed, ${failed} failed.`);
if (failed > 0) process.exit(1);
