const assert = require('assert');

// Core Business Logic
function validateResumeFile(filename) {
  if (!filename) return false;
  const ext = filename.split('.').pop().toLowerCase();
  return ['pdf', 'docx', 'doc'].includes(ext);
}

function checkDeadline(deadlineStr, referenceDateStr = '2026-10-05') {
  const dl = new Date(deadlineStr);
  const ref = new Date(referenceDateStr);
  dl.setHours(23, 59, 59, 999);
  ref.setHours(0, 0, 0, 0);
  return ref.getTime() <= dl.getTime();
}

function submitApplication(existingApps, appData, job) {
  const errors = [];
  if (!appData.studentId || appData.studentId.trim().length < 3) errors.push('Student ID is required.');
  if (!appData.studentName || appData.studentName.trim().length < 2) errors.push('Student name is required.');
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(appData.email)) errors.push('Valid email address is required.');

  if (!validateResumeFile(appData.resumeFilename)) {
    errors.push('Resume must be a valid PDF or DOCX file.');
  }

  // Check deadline
  if (!checkDeadline(job.deadline, appData.appliedDate)) {
    errors.push('The deadline to apply for this job has passed.');
  }

  // Check duplicate
  const alreadyApplied = existingApps.some(a => 
    a.jobId === job.id && a.studentId === appData.studentId
  );
  if (alreadyApplied) {
    errors.push('You have already applied for this job.');
  }

  if (errors.length > 0) return { success: false, errors };

  const newApp = {
    ...appData,
    id: `APP-${Date.now().toString().slice(-4)}`,
    jobId: job.id,
    jobTitle: job.title,
    company: job.company,
    status: 'Applied'
  };

  return { success: true, application: newApp };
}

function filterJobs(jobs, query, type, location) {
  return jobs.filter(j => {
    const q = query.toLowerCase();
    const matchesSearch = !query || 
      j.title.toLowerCase().includes(q) || 
      j.company.toLowerCase().includes(q) || 
      j.requiredSkills.some(s => s.toLowerCase().includes(q));
    const matchesType = !type || j.jobType === type;
    const matchesLoc = !location || j.location === location;
    return matchesSearch && matchesType && matchesLoc;
  });
}

function updateApplicationStatus(application, newStatus) {
  const validStatuses = ['Applied', 'Under Review', 'Shortlisted', 'Interview', 'Selected', 'Rejected'];
  if (!validStatuses.includes(newStatus)) {
    return { success: false, error: 'Invalid application status.' };
  }
  application.status = newStatus;
  return { success: true, application };
}

// TEST SUITE
console.log('Running Tests for 06 Internship and Job Application Portal...');
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

const mockJob = {
  id: 'JOB-101',
  title: 'Web Dev Intern',
  company: 'Zoho',
  location: 'Chennai',
  jobType: 'Internship',
  requiredSkills: ['JavaScript', 'HTML5', 'Node.js'],
  deadline: '2026-11-15'
};

// Test Case 1: Successful Job Application
runTest('Test Case 1: Valid Application Submission', () => {
  const appData = {
    studentId: 'PEC2023CS010',
    studentName: 'Yuvathilagan',
    email: 'yuva@gmail.com',
    phone: '9840112233',
    resumeFilename: 'Yuva_Resume.pdf',
    appliedDate: '2026-10-05'
  };
  const res = submitApplication([], appData, mockJob);
  assert.strictEqual(res.success, true);
  assert.strictEqual(res.application.status, 'Applied');
  assert.strictEqual(res.application.jobId, 'JOB-101');
});

// Test Case 2: Prevention of Duplicate Application
runTest('Test Case 2: Rejection of Duplicate Job Application', () => {
  const existing = [{ jobId: 'JOB-101', studentId: 'PEC2023CS010' }];
  const duplicateApp = {
    studentId: 'PEC2023CS010',
    studentName: 'Yuvathilagan',
    email: 'yuva@gmail.com',
    resumeFilename: 'Resume.pdf',
    appliedDate: '2026-10-05'
  };
  const res = submitApplication(existing, duplicateApp, mockJob);
  assert.strictEqual(res.success, false);
  assert.ok(res.errors.includes('You have already applied for this job.'));
});

// Test Case 3: Resume Format Validation
runTest('Test Case 3: Resume File Extension Validation (PDF / DOCX)', () => {
  assert.strictEqual(validateResumeFile('resume.pdf'), true);
  assert.strictEqual(validateResumeFile('cv.docx'), true);
  assert.strictEqual(validateResumeFile('executable.exe'), false);
  assert.strictEqual(validateResumeFile('image.png'), false);
});

// Test Case 4: Deadline Expiration Enforcement
runTest('Test Case 4: Rejection of Application After Deadline', () => {
  const expiredJob = { ...mockJob, deadline: '2026-09-30' };
  const appData = {
    studentId: 'PEC2023CS020',
    studentName: 'Sanjay',
    email: 'sanjay@gmail.com',
    resumeFilename: 'Resume.pdf',
    appliedDate: '2026-10-05'
  };
  const res = submitApplication([], appData, expiredJob);
  assert.strictEqual(res.success, false);
  assert.ok(res.errors.includes('The deadline to apply for this job has passed.'));
});

// Test Case 5: Multi-Criteria Filtering and Status Workflow
runTest('Test Case 5: Real Filtering & Status Transition Workflow', () => {
  const jobs = [mockJob, { id: 'JOB-102', title: 'Data Analyst', company: 'TCS', location: 'Hyderabad', jobType: 'Full-Time', requiredSkills: ['SQL', 'Python'], deadline: '2026-11-20' }];
  const interns = filterJobs(jobs, '', 'Internship', '');
  assert.strictEqual(interns.length, 1);
  assert.strictEqual(interns[0].id, 'JOB-101');

  const app = { status: 'Applied' };
  const transRes = updateApplicationStatus(app, 'Shortlisted');
  assert.strictEqual(transRes.success, true);
  assert.strictEqual(app.status, 'Shortlisted');
});

console.log(`\nResults: ${passed} passed, ${failed} failed.`);
if (failed > 0) process.exit(1);
