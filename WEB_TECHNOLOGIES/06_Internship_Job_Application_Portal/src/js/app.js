/**
 * Internship and Job Application Portal - Application Logic
 * Prathyusha Career & Placement Portal - Web Technologies
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'wt_jobs_system_data';

  const PIPELINE_STAGES = ['Applied', 'Under Review', 'Shortlisted', 'Interview', 'Selected'];

  // State
  let portalData = {
    portalName: "Prathyusha Career & Placement Portal",
    jobTypes: ["Full-Time", "Internship", "Remote / Hybrid"],
    locations: ["Chennai", "Bangalore", "Hyderabad", "Remote"],
    applicationStatuses: [
      "Applied",
      "Under Review",
      "Shortlisted",
      "Interview",
      "Selected",
      "Rejected"
    ],
    jobs: [],
    applications: []
  };

  let activeJobForApply = null;

  // DOM Elements
  const portalRoleSwitch = document.getElementById('portalRoleSwitch');
  const studentView = document.getElementById('studentView');
  const recruiterView = document.getElementById('recruiterView');
  const studentProfileSelect = document.getElementById('studentProfileSelect');

  // Tabs
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabJobs = document.getElementById('tabJobs');
  const tabMyApps = document.getElementById('tabMyApps');

  // Search & Filters
  const jobSearchInput = document.getElementById('jobSearchInput');
  const jobTypeFilter = document.getElementById('jobTypeFilter');
  const locationFilter = document.getElementById('locationFilter');
  const jobCountBadge = document.getElementById('jobCountBadge');
  const jobsGrid = document.getElementById('jobsGrid');
  const myAppsBadge = document.getElementById('myAppsBadge');
  const myApplicationsContainer = document.getElementById('myApplicationsContainer');

  // Recruiter Dashboard
  const kpiOpenings = document.getElementById('kpiOpenings');
  const kpiTotalApps = document.getElementById('kpiTotalApps');
  const kpiShortlisted = document.getElementById('kpiShortlisted');
  const kpiSelected = document.getElementById('kpiSelected');
  const adminJobSelectFilter = document.getElementById('adminJobSelectFilter');
  const adminStatusSelectFilter = document.getElementById('adminStatusSelectFilter');
  const adminAppsTbody = document.getElementById('adminAppsTbody');
  const btnPostJob = document.getElementById('btnPostJob');
  const btnResetData = document.getElementById('btnResetData');

  // Apply Modal
  const applyModal = document.getElementById('applyModal');
  const applyForm = document.getElementById('applyForm');
  const applyJobTitle = document.getElementById('applyJobTitle');
  const applyJobCompany = document.getElementById('applyJobCompany');
  const applyJobId = document.getElementById('applyJobId');
  const applyEligibilityNote = document.getElementById('applyEligibilityNote');
  const appStudentId = document.getElementById('appStudentId');
  const appStudentName = document.getElementById('appStudentName');
  const appEmail = document.getElementById('appEmail');
  const appPhone = document.getElementById('appPhone');
  const appCgpa = document.getElementById('appCgpa');
  const appResume = document.getElementById('appResume');

  // Job Modal
  const jobModal = document.getElementById('jobModal');
  const postJobForm = document.getElementById('postJobForm');

  const toast = document.getElementById('toast');

  // --- INITIALIZATION ---
  async function init() {
    await loadInitialData();
    setupEventListeners();
    populateRecruiterJobDropdown();
    renderJobsGrid();
    renderMyApplications();
    renderRecruiterDashboard();
  }

  async function loadInitialData() {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      try {
        portalData = JSON.parse(cached);
        return;
      } catch (e) {
        console.warn('Storage parsing failed.');
      }
    }

    try {
      const res = await fetch('data/initial_data.json');
      if (res.ok) {
        portalData = await res.json();
        saveData();
      }
    } catch (e) {
      console.warn('Using default seed state.');
    }
  }

  function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(portalData));
  }

  function getActiveStudent() {
    const text = studentProfileSelect.options[studentProfileSelect.selectedIndex].text;
    const parts = text.split(' - ');
    const id = parts[0];
    const nameWithDept = parts[1].split(' (');
    const name = nameWithDept[0];
    const cgpa = nameWithDept[1] ? nameWithDept[1].split(' ')[1] : '8.50';

    return {
      id,
      name,
      email: `${name.toLowerCase().replace(/\s+/g, '.')}@pec.edu`,
      phone: '9840112233',
      cgpa
    };
  }

  function getStatusBadgeClass(status) {
    switch (status) {
      case 'Applied': return 'badge-status-applied';
      case 'Under Review': return 'badge-status-under-review';
      case 'Shortlisted': return 'badge-status-shortlisted';
      case 'Interview': return 'badge-status-interview';
      case 'Selected': return 'badge-status-selected';
      case 'Rejected': return 'badge-status-rejected';
      default: return 'badge-info';
    }
  }

  function populateRecruiterJobDropdown() {
    adminJobSelectFilter.innerHTML = '<option value="">All Job Openings</option>';
    portalData.jobs.forEach(j => {
      const opt = document.createElement('option');
      opt.value = j.id;
      opt.textContent = `${j.company} - ${j.title}`;
      adminJobSelectFilter.appendChild(opt);
    });
  }

  // --- RENDERING ---
  function renderJobsGrid() {
    const query = jobSearchInput.value.trim().toLowerCase();
    const type = jobTypeFilter.value;
    const loc = locationFilter.value;
    const curStudent = getActiveStudent();

    const filtered = portalData.jobs.filter(j => {
      const matchesSearch = !query || 
        j.title.toLowerCase().includes(query) || 
        j.company.toLowerCase().includes(query) || 
        j.requiredSkills.some(s => s.toLowerCase().includes(query));
      const matchesType = !type || j.jobType === type;
      const matchesLoc = !loc || j.location === loc;
      return matchesSearch && matchesType && matchesLoc;
    });

    jobCountBadge.textContent = `${filtered.length} Opportunities Open`;
    jobsGrid.innerHTML = '';

    if (filtered.length === 0) {
      jobsGrid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-muted);">No job vacancies found matching current filters.</div>`;
      return;
    }

    filtered.forEach(job => {
      const card = document.createElement('article');
      card.className = 'job-card';

      const hasApplied = portalData.applications.some(a => 
        a.jobId === job.id && a.studentId === curStudent.id
      );

      const todayStr = new Date().toISOString().split('T')[0];
      const isExpired = todayStr > job.deadline;

      card.innerHTML = `
        <div>
          <div class="job-card-header">
            <div>
              <div class="job-title">${job.title}</div>
              <div class="company-name">🏢 ${job.company}</div>
            </div>
            <span class="badge" style="background:#e0f2fe; color:#0369a1;">${job.jobType}</span>
          </div>

          <div class="job-meta-row">
            <span>📍 ${job.location}</span>
            <span>💰 ${job.stipend || 'Competitive'}</span>
            <span>📅 Deadline: <strong>${job.deadline}</strong></span>
          </div>

          <div class="skills-container">
            ${job.requiredSkills.map(sk => `<span class="skill-chip">${sk}</span>`).join('')}
          </div>

          <p class="job-desc">${job.description}</p>

          <div style="font-size:0.8rem; color:var(--text-muted); margin-bottom: 0.75rem;">
            <strong>Eligibility:</strong> ${job.eligibility}
          </div>
        </div>

        <div class="job-footer">
          <div>
            ${isExpired ? '<span class="badge badge-danger">Application Closed</span>' : (hasApplied ? '<span class="badge badge-success">✓ Already Applied</span>' : '<span class="badge badge-info">Accepting Applications</span>')}
          </div>
          <button class="btn btn-primary btn-sm btn-apply-job" data-id="${job.id}" ${hasApplied || isExpired ? 'disabled' : ''}>
            ${hasApplied ? 'Applied' : (isExpired ? 'Closed' : 'Apply Now →')}
          </button>
        </div>
      `;
      jobsGrid.appendChild(card);
    });
  }

  function renderMyApplications() {
    const curStudent = getActiveStudent();
    const myApps = portalData.applications.filter(a => a.studentId === curStudent.id);

    myAppsBadge.textContent = `${myApps.length} Applications`;
    myApplicationsContainer.innerHTML = '';

    if (myApps.length === 0) {
      myApplicationsContainer.innerHTML = `
        <div style="text-align: center; padding: 3rem; color: var(--text-muted);">
          You have not applied for any placement positions yet. Browse open jobs and apply!
        </div>`;
      return;
    }

    myApps.forEach(app => {
      const card = document.createElement('div');
      card.className = 'application-card';
      const badgeClass = getStatusBadgeClass(app.status);

      // Render Multi-step progress pipeline
      let pipelineHtml = '';
      if (app.status === 'Rejected') {
        pipelineHtml = `
          <div class="status-pipeline">
            <div class="pipeline-step completed"><div class="step-bubble">✓</div>Applied</div>
            <div class="pipeline-step completed"><div class="step-bubble">✓</div>Under Review</div>
            <div class="pipeline-step rejected"><div class="step-bubble">✗</div>Rejected</div>
          </div>
        `;
      } else {
        const curStageIdx = PIPELINE_STAGES.indexOf(app.status);
        pipelineHtml = `
          <div class="status-pipeline">
            ${PIPELINE_STAGES.map((stage, idx) => {
              let stateClass = '';
              if (idx < curStageIdx) stateClass = 'completed';
              else if (idx === curStageIdx) stateClass = 'active';

              return `
                <div class="pipeline-step ${stateClass}">
                  <div class="step-bubble">${idx < curStageIdx ? '✓' : idx + 1}</div>
                  ${stage}
                </div>
              `;
            }).join('')}
          </div>
        `;
      }

      card.innerHTML = `
        <div class="app-card-top">
          <div>
            <h3 style="color:var(--primary); font-size:1.15rem; margin-bottom: 0.2rem;">${app.jobTitle}</h3>
            <div style="font-weight:600; color:var(--text-main);">🏢 ${app.company}</div>
          </div>
          <div>
            <span class="badge ${badgeClass}" style="font-size:0.85rem;">Status: ${app.status}</span>
          </div>
        </div>

        <div style="font-size:0.825rem; color:var(--text-muted); display:flex; gap:1.5rem; flex-wrap:wrap;">
          <span>Application ID: <strong>${app.id}</strong></span>
          <span>Applied Date: <strong>${app.appliedDate}</strong></span>
          <span>Submitted Resume: <code>${app.resumeFilename || 'Resume.pdf'}</code></span>
        </div>

        ${pipelineHtml}
      `;
      myApplicationsContainer.appendChild(card);
    });
  }

  function renderRecruiterDashboard() {
    // Dynamic KPI stats
    const totalOpenings = portalData.jobs.length;
    const totalApps = portalData.applications.length;
    const shortlisted = portalData.applications.filter(a => a.status === 'Shortlisted').length;
    const selected = portalData.applications.filter(a => a.status === 'Selected').length;

    kpiOpenings.textContent = totalOpenings;
    kpiTotalApps.textContent = totalApps;
    kpiShortlisted.textContent = shortlisted;
    kpiSelected.textContent = selected;

    // Filter table
    const selJob = adminJobSelectFilter.value;
    const selStatus = adminStatusSelectFilter.value;

    const filtered = portalData.applications.filter(a => {
      const matchJob = !selJob || a.jobId === selJob;
      const matchStatus = !selStatus || a.status === selStatus;
      return matchJob && matchStatus;
    });

    adminAppsTbody.innerHTML = '';
    if (filtered.length === 0) {
      adminAppsTbody.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 2rem; color: var(--text-muted);">No candidate applications matching filter criteria.</td></tr>`;
      return;
    }

    filtered.forEach(app => {
      const tr = document.createElement('tr');
      const badgeClass = getStatusBadgeClass(app.status);

      tr.innerHTML = `
        <td><strong>${app.id}</strong></td>
        <td>
          <div><strong>${app.studentName}</strong> (${app.studentId})</div>
          <div style="font-size:0.775rem; color:var(--text-muted);">${app.email} | ${app.phone}</div>
        </td>
        <td>
          <div><strong>${app.jobTitle}</strong></div>
          <div style="font-size:0.775rem; color:var(--text-muted);">${app.company}</div>
        </td>
        <td><span class="badge" style="background:#dcfce7; color:#166534;">${app.cgpa || '8.50'}</span></td>
        <td><a href="#" style="color:var(--accent); font-size:0.8rem;" onclick="alert('Viewing candidate resume: ${app.resumeFilename}'); return false;">📄 ${app.resumeFilename || 'Resume.pdf'}</a></td>
        <td>${app.appliedDate}</td>
        <td><span class="badge ${badgeClass}">${app.status}</span></td>
        <td>
          <div class="btn-group">
            <button class="btn btn-secondary btn-sm btn-status-change" data-id="${app.id}" data-status="Shortlisted" title="Shortlist candidate">⭐ Shortlist</button>
            <button class="btn btn-outline btn-sm btn-status-change" data-id="${app.id}" data-status="Interview" title="Call for Interview">🎙️ Interview</button>
            <button class="btn btn-success btn-sm btn-status-change" data-id="${app.id}" data-status="Selected" title="Issue Select Offer">🎯 Select</button>
            <button class="btn btn-danger btn-sm btn-status-change" data-id="${app.id}" data-status="Rejected" title="Reject Candidate">✕</button>
          </div>
        </td>
      `;
      adminAppsTbody.appendChild(tr);
    });
  }

  // --- MODAL CONTROLS ---
  function openApplyModal(jobId) {
    const job = portalData.jobs.find(j => j.id === jobId);
    if (!job) return;
    activeJobForApply = job;

    applyJobTitle.textContent = job.title;
    applyJobCompany.textContent = `${job.company} | ${job.location} | ${job.jobType}`;
    applyEligibilityNote.textContent = job.eligibility;
    applyJobId.value = job.id;

    // Populate Student Data
    const student = getActiveStudent();
    appStudentId.value = student.id;
    appStudentName.value = student.name;
    appEmail.value = student.email;
    appPhone.value = student.phone;
    appCgpa.value = student.cgpa;

    clearValidationErrors();
    applyModal.classList.remove('hidden');
  }

  function clearValidationErrors() {
    document.querySelectorAll('.error-msg').forEach(el => el.textContent = '');
  }

  // --- EVENT LISTENERS ---
  function setupEventListeners() {
    // Portal switch
    portalRoleSwitch.addEventListener('change', (e) => {
      if (e.target.value === 'student') {
        recruiterView.classList.add('hidden');
        studentView.classList.remove('hidden');
        renderJobsGrid();
        renderMyApplications();
      } else {
        studentView.classList.add('hidden');
        recruiterView.classList.remove('hidden');
        populateRecruiterJobDropdown();
        renderRecruiterDashboard();
      }
    });

    studentProfileSelect.addEventListener('change', () => {
      renderJobsGrid();
      renderMyApplications();
    });

    // Tabs
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        if (btn.dataset.tab === 'tabJobs') {
          tabJobs.classList.remove('hidden');
          tabMyApps.classList.add('hidden');
          renderJobsGrid();
        } else {
          tabJobs.classList.add('hidden');
          tabMyApps.classList.remove('hidden');
          renderMyApplications();
        }
      });
    });

    // Job search & filters
    jobSearchInput.addEventListener('input', renderJobsGrid);
    jobTypeFilter.addEventListener('change', renderJobsGrid);
    locationFilter.addEventListener('change', renderJobsGrid);

    // Recruiter filters
    adminJobSelectFilter.addEventListener('change', renderRecruiterDashboard);
    adminStatusSelectFilter.addEventListener('change', renderRecruiterDashboard);

    // Apply button click delegation
    jobsGrid.addEventListener('click', (e) => {
      const applyBtn = e.target.closest('.btn-apply-job');
      if (applyBtn) {
        openApplyModal(applyBtn.dataset.id);
      }
    });

    // Application Form Submit
    applyForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearValidationErrors();

      const name = appStudentName.value.trim();
      const email = appEmail.value.trim();
      const phone = appPhone.value.trim();
      const cgpa = appCgpa.value.trim();
      const sId = appStudentId.value;

      let hasError = false;
      if (!name || name.length < 2) {
        document.getElementById('errAppName').textContent = 'Please enter full candidate name.';
        hasError = true;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        document.getElementById('errAppEmail').textContent = 'Please enter a valid email address.';
        hasError = true;
      }
      const phoneRegex = /^[6-9]\d{9}$/;
      if (!phoneRegex.test(phone)) {
        document.getElementById('errAppPhone').textContent = 'Please enter a valid 10-digit mobile number.';
        hasError = true;
      }

      // Resume file check
      const file = appResume.files[0];
      if (!file) {
        document.getElementById('errAppResume').textContent = 'Please upload your resume file.';
        hasError = true;
      } else {
        const ext = file.name.split('.').pop().toLowerCase();
        if (!['pdf', 'docx', 'doc'].includes(ext)) {
          document.getElementById('errAppResume').textContent = 'Resume must be in PDF or DOCX format.';
          hasError = true;
        }
      }

      if (hasError) return;

      const newApp = {
        id: `APP-${Date.now().toString().slice(-4)}`,
        jobId: activeJobForApply.id,
        jobTitle: activeJobForApply.title,
        company: activeJobForApply.company,
        studentId: sId,
        studentName: name,
        email,
        phone,
        cgpa: cgpa || '8.50',
        resumeFilename: file.name,
        appliedDate: new Date().toISOString().split('T')[0],
        status: 'Applied'
      };

      portalData.applications.unshift(newApp);
      saveData();
      applyModal.classList.add('hidden');
      renderJobsGrid();
      renderMyApplications();
      renderRecruiterDashboard();
      showToast(`Application submitted successfully to ${activeJobForApply.company}!`, 'success');

      // Switch to applications tab
      tabBtns[1].click();
    });

    // Recruiter status change actions
    adminAppsTbody.addEventListener('click', (e) => {
      const statusBtn = e.target.closest('.btn-status-change');
      if (statusBtn) {
        const appId = statusBtn.dataset.id;
        const newStatus = statusBtn.dataset.status;
        const app = portalData.applications.find(a => a.id === appId);
        if (app) {
          app.status = newStatus;
          saveData();
          renderRecruiterDashboard();
          renderMyApplications();
          showToast(`Candidate ${app.studentName} updated to "${newStatus}".`, 'info');
        }
      }
    });

    // Post Job
    btnPostJob.addEventListener('click', () => {
      postJobForm.reset();
      jobModal.classList.remove('hidden');
    });

    postJobForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('postTitle').value.trim();
      const company = document.getElementById('postCompany').value.trim();
      const type = document.getElementById('postType').value;
      const location = document.getElementById('postLocation').value.trim();
      const skillsRaw = document.getElementById('postSkills').value.split(',');
      const stipend = document.getElementById('postSalary').value.trim();
      const eligibility = document.getElementById('postEligibility').value.trim();
      const deadline = document.getElementById('postDeadline').value;
      const description = document.getElementById('postDescription').value.trim();

      const skills = skillsRaw.map(s => s.trim()).filter(s => s.length > 0);

      const newJob = {
        id: `JOB-${Date.now().toString().slice(-3)}`,
        title,
        company,
        location,
        jobType: type,
        requiredSkills: skills,
        eligibility,
        deadline,
        stipend,
        description
      };

      portalData.jobs.unshift(newJob);
      saveData();
      jobModal.classList.add('hidden');
      populateRecruiterJobDropdown();
      renderJobsGrid();
      renderRecruiterDashboard();
      showToast(`New vacancy posted: ${title} at ${company}!`, 'success');
    });

    // Close Modals
    document.querySelectorAll('[data-close]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const modalId = e.currentTarget.getAttribute('data-close');
        document.getElementById(modalId).classList.add('hidden');
      });
    });

    // Reset Data
    btnResetData.addEventListener('click', async () => {
      if (confirm('Reset campus placement job board and application roster to initial state?')) {
        localStorage.removeItem(STORAGE_KEY);
        await loadInitialData();
        populateRecruiterJobDropdown();
        renderJobsGrid();
        renderMyApplications();
        renderRecruiterDashboard();
        showToast('Placement portal restored to academic default.', 'success');
      }
    });
  }

  function showToast(msg, type = 'info') {
    toast.textContent = msg;
    toast.className = `toast ${type}`;
    toast.classList.remove('hidden');
    setTimeout(() => {
      toast.classList.add('hidden');
    }, 3200);
  }

  document.addEventListener('DOMContentLoaded', init);
})();
