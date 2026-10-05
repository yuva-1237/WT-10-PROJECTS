/**
 * College Complaint and Maintenance Portal - Application Logic
 * Prathyusha Campus Maintenance Cell - Web Technologies
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'wt_complaint_system_data';

  const WORKFLOW_STAGES = ['Submitted', 'Assigned', 'In Progress', 'Resolved', 'Closed'];

  // State
  let complaintData = {
    institution: "Prathyusha Engineering College - Campus Maintenance Cell",
    categories: [
      "Classroom", "Laboratory", "Wi-Fi", "Electricity", 
      "Water", "Hostel", "Cleanliness", "Infrastructure", "Other"
    ],
    workflowStatuses: ["Submitted", "Assigned", "In Progress", "Resolved", "Closed"],
    technicians: [],
    complaints: []
  };

  let activeTicketForAssign = null;
  let activeTicketForFeedback = null;
  let uploadedImageBase64 = null;

  // DOM Elements
  const portalRoleSwitch = document.getElementById('portalRoleSwitch');
  const studentView = document.getElementById('studentView');
  const adminView = document.getElementById('adminView');
  const studentUserSelect = document.getElementById('studentUserSelect');

  // Tabs
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabLodge = document.getElementById('tabLodge');
  const tabTrack = document.getElementById('tabTrack');

  // Student Form
  const complaintForm = document.getElementById('complaintForm');
  const formCategory = document.getElementById('formCategory');
  const formPriority = document.getElementById('formPriority');
  const formLocation = document.getElementById('formLocation');
  const formContactPhone = document.getElementById('formContactPhone');
  const formTitle = document.getElementById('formTitle');
  const formDescription = document.getElementById('formDescription');
  const formImage = document.getElementById('formImage');
  const imagePreviewContainer = document.getElementById('imagePreviewContainer');
  const studentTicketCountBadge = document.getElementById('studentTicketCountBadge');
  const studentTicketsContainer = document.getElementById('studentTicketsContainer');

  // Admin Elements
  const kpiTotalComplaints = document.getElementById('kpiTotalComplaints');
  const kpiPendingComplaints = document.getElementById('kpiPendingComplaints');
  const kpiInProgressComplaints = document.getElementById('kpiInProgressComplaints');
  const kpiResolvedComplaints = document.getElementById('kpiResolvedComplaints');
  const adminSearchInput = document.getElementById('adminSearchInput');
  const adminCategoryFilter = document.getElementById('adminCategoryFilter');
  const adminStatusFilter = document.getElementById('adminStatusFilter');
  const adminComplaintsTbody = document.getElementById('adminComplaintsTbody');
  const btnResetData = document.getElementById('btnResetData');

  // Assign Modal
  const assignModal = document.getElementById('assignModal');
  const assignForm = document.getElementById('assignForm');
  const assignModalTitle = document.getElementById('assignModalTitle');
  const assignModalSub = document.getElementById('assignModalSub');
  const assignTicketId = document.getElementById('assignTicketId');
  const technicianSelect = document.getElementById('technicianSelect');

  // Feedback Modal
  const feedbackModal = document.getElementById('feedbackModal');
  const feedbackForm = document.getElementById('feedbackForm');
  const feedbackTicketSub = document.getElementById('feedbackTicketSub');
  const feedbackTicketId = document.getElementById('feedbackTicketId');
  const starRatingBox = document.getElementById('starRatingBox');
  const feedbackRatingVal = document.getElementById('feedbackRatingVal');
  const feedbackComment = document.getElementById('feedbackComment');

  const toast = document.getElementById('toast');

  // --- INITIALIZATION ---
  async function init() {
    await loadInitialData();
    setupEventListeners();
    populateTechnicianDropdown();
    renderStudentTickets();
    renderAdminDashboard();
  }

  async function loadInitialData() {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      try {
        complaintData = JSON.parse(cached);
        return;
      } catch (e) {
        console.warn('Storage parsing failed.');
      }
    }

    try {
      const res = await fetch('data/initial_data.json');
      if (res.ok) {
        complaintData = await res.json();
        saveData();
      }
    } catch (e) {
      console.warn('Using default seed state.');
    }
  }

  function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(complaintData));
  }

  function getActiveStudent() {
    const text = studentUserSelect.options[studentUserSelect.selectedIndex].text;
    const parts = text.split(' - ');
    const id = parts[0];
    const name = parts[1].split(' (')[0];
    return { id, name };
  }

  function getStatusBadgeClass(status) {
    switch (status) {
      case 'Submitted': return 'badge-status-submitted';
      case 'Assigned': return 'badge-status-assigned';
      case 'In Progress': return 'badge-status-in-progress';
      case 'Resolved': return 'badge-status-resolved';
      case 'Closed': return 'badge-status-closed';
      default: return 'badge-info';
    }
  }

  function populateTechnicianDropdown() {
    technicianSelect.innerHTML = '';
    complaintData.technicians.forEach(t => {
      const opt = document.createElement('option');
      opt.value = t.name;
      opt.textContent = `${t.name} (${t.department})`;
      technicianSelect.appendChild(opt);
    });
  }

  // --- RENDERING STUDENT TICKETS ---
  function renderStudentTickets() {
    const curStudent = getActiveStudent();
    const myTickets = complaintData.complaints.filter(c => c.studentId === curStudent.id);

    studentTicketCountBadge.textContent = `${myTickets.length} Tickets`;
    studentTicketsContainer.innerHTML = '';

    if (myTickets.length === 0) {
      studentTicketsContainer.innerHTML = `
        <div style="text-align: center; padding: 3rem; color: var(--text-muted);">
          No maintenance complaints logged for this student.
        </div>`;
      return;
    }

    myTickets.forEach(t => {
      const card = document.createElement('div');
      card.className = 'ticket-card';
      const statusBadge = getStatusBadgeClass(t.status);
      const curStageIdx = WORKFLOW_STAGES.indexOf(t.status);

      // Workflow 5-step visual bar
      const workflowHtml = `
        <div class="workflow-progress-bar">
          ${WORKFLOW_STAGES.map((st, idx) => {
            let cls = '';
            if (idx < curStageIdx) cls = 'completed';
            else if (idx === curStageIdx) cls = 'active';

            return `
              <div class="wf-step ${cls}">
                <div class="wf-bubble">${idx < curStageIdx ? '✓' : idx + 1}</div>
                ${st}
              </div>
            `;
          }).join('')}
        </div>
      `;

      card.innerHTML = `
        <div class="ticket-top">
          <div>
            <span class="ticket-id">${t.id}</span> &bull; <span class="badge" style="background:#fee2e2; color:#991b1b;">${t.category}</span>
            <h3 class="ticket-title">${t.title}</h3>
          </div>
          <div>
            <span class="badge ${statusBadge}">${t.status}</span>
          </div>
        </div>

        <div class="ticket-meta">
          <span>📍 <strong>${t.location}</strong></span>
          <span>Priority: <span class="badge priority-${t.priority.toLowerCase()}">${t.priority}</span></span>
          <span>Assigned Staff: <strong>${t.assignedTo || 'Pending Assignment'}</strong></span>
          <span>Submitted: ${new Date(t.submittedDate).toLocaleDateString()}</span>
        </div>

        <p style="font-size:0.875rem; color:var(--text-body); margin-bottom: 0.75rem;">${t.description}</p>

        ${t.imageName ? `<div style="font-size:0.8rem; color:var(--text-muted); margin-bottom:0.5rem;">📎 Attached Image: <code>${t.imageName}</code></div>` : ''}

        ${workflowHtml}

        ${t.status === 'Resolved' ? `
          <div style="margin-top: 1rem; padding-top: 0.75rem; border-top: 1px solid #f1f5f9; display: flex; justify-content: flex-end;">
            <button class="btn btn-primary btn-sm btn-give-feedback" data-id="${t.id}">
              ⭐ Provide Service Feedback & Close Ticket
            </button>
          </div>
        ` : ''}

        ${t.status === 'Closed' && t.feedbackRating ? `
          <div style="background:#f8fafc; padding:0.75rem; border-radius:var(--radius); margin-top:0.75rem; font-size:0.85rem;">
            <strong>Your Feedback:</strong> ${'★'.repeat(t.feedbackRating)}${'☆'.repeat(5 - t.feedbackRating)} - "${t.feedbackComment}"
          </div>
        ` : ''}
      `;
      studentTicketsContainer.appendChild(card);
    });
  }

  // --- RENDERING ADMIN DASHBOARD ---
  function renderAdminDashboard() {
    // Dynamic KPI stats calculation
    const total = complaintData.complaints.length;
    const pending = complaintData.complaints.filter(c => c.status === 'Submitted' || c.status === 'Assigned').length;
    const inProgress = complaintData.complaints.filter(c => c.status === 'In Progress').length;
    const resolved = complaintData.complaints.filter(c => c.status === 'Resolved' || c.status === 'Closed').length;

    kpiTotalComplaints.textContent = total;
    kpiPendingComplaints.textContent = pending;
    kpiInProgressComplaints.textContent = inProgress;
    kpiResolvedComplaints.textContent = resolved;

    // Filters
    const query = adminSearchInput.value.trim().toLowerCase();
    const cat = adminCategoryFilter.value;
    const stat = adminStatusFilter.value;

    const filtered = complaintData.complaints.filter(c => {
      const matchSearch = !query || 
        c.id.toLowerCase().includes(query) || 
        c.title.toLowerCase().includes(query) || 
        c.location.toLowerCase().includes(query);
      const matchCat = !cat || c.category === cat;
      const matchStat = !stat || c.status === stat;
      return matchSearch && matchCat && matchStat;
    });

    adminComplaintsTbody.innerHTML = '';
    if (filtered.length === 0) {
      adminComplaintsTbody.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 2rem; color: var(--text-muted);">No maintenance complaints match the criteria.</td></tr>`;
      return;
    }

    filtered.forEach(c => {
      const tr = document.createElement('tr');
      const statusBadge = getStatusBadgeClass(c.status);

      tr.innerHTML = `
        <td><strong>${c.id}</strong></td>
        <td>
          <div><strong>${c.studentName}</strong></div>
          <div style="font-size:0.775rem; color:var(--text-muted);">${c.phone}</div>
        </td>
        <td><span class="badge" style="background:#fee2e2; color:#991b1b;">${c.category}</span></td>
        <td>
          <div style="font-weight:600;">${c.title}</div>
          <div style="font-size:0.775rem; color:var(--text-muted);">📍 ${c.location}</div>
        </td>
        <td><span class="badge priority-${c.priority.toLowerCase()}">${c.priority}</span></td>
        <td><strong>${c.assignedTo || '<em style="color:#64748b;">Unassigned</em>'}</strong></td>
        <td><span class="badge ${statusBadge}">${c.status}</span></td>
        <td>
          <div class="btn-group">
            ${c.status === 'Submitted' ? `
              <button class="btn btn-primary btn-sm btn-assign-trigger" data-id="${c.id}" title="Assign Technician">👨‍🔧 Assign</button>
            ` : ''}
            ${c.status === 'Assigned' ? `
              <button class="btn btn-secondary btn-sm btn-advance-work" data-id="${c.id}" data-next="In Progress" title="Start Maintenance Work">▶ Start Work</button>
            ` : ''}
            ${c.status === 'In Progress' ? `
              <button class="btn btn-success btn-sm btn-advance-work" data-id="${c.id}" data-next="Resolved" title="Mark Defect Fixed">✓ Resolved</button>
            ` : ''}
            ${c.status === 'Resolved' || c.status === 'Closed' ? `
              <span style="font-size:0.8rem; color:var(--success);">Completed</span>
            ` : ''}
          </div>
        </td>
      `;
      adminComplaintsTbody.appendChild(tr);
    });
  }

  // --- MODAL CONTROLS ---
  function openAssignModal(ticketId) {
    const ticket = complaintData.complaints.find(c => c.id === ticketId);
    if (!ticket) return;
    activeTicketForAssign = ticket;

    assignTicketId.value = ticket.id;
    assignModalTitle.textContent = `Assign Staff: ${ticket.id}`;
    assignModalSub.textContent = `Category: ${ticket.category} | Issue: ${ticket.title}`;
    assignModal.classList.remove('hidden');
  }

  function openFeedbackModal(ticketId) {
    const ticket = complaintData.complaints.find(c => c.id === ticketId);
    if (!ticket) return;
    activeTicketForFeedback = ticket;

    feedbackTicketId.value = ticket.id;
    feedbackTicketSub.textContent = `Ticket: ${ticket.id} (${ticket.title}) - Resolved by ${ticket.assignedTo}`;
    feedbackComment.value = '';
    setStarRating(5);
    feedbackModal.classList.remove('hidden');
  }

  function setStarRating(num) {
    feedbackRatingVal.value = num;
    document.querySelectorAll('.star-rating .star').forEach(star => {
      const r = parseInt(star.dataset.rating, 10);
      if (r <= num) star.classList.add('active');
      else star.classList.remove('active');
    });
  }

  function clearValidationErrors() {
    document.querySelectorAll('.error-msg').forEach(el => el.textContent = '');
  }

  // --- EVENT LISTENERS ---
  function setupEventListeners() {
    // Portal switcher
    portalRoleSwitch.addEventListener('change', (e) => {
      if (e.target.value === 'student') {
        adminView.classList.add('hidden');
        studentView.classList.remove('hidden');
        renderStudentTickets();
      } else {
        studentView.classList.add('hidden');
        adminView.classList.remove('hidden');
        renderAdminDashboard();
      }
    });

    studentUserSelect.addEventListener('change', renderStudentTickets);

    // Tabs
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        if (btn.dataset.tab === 'tabLodge') {
          tabLodge.classList.remove('hidden');
          tabTrack.classList.add('hidden');
        } else {
          tabLodge.classList.add('hidden');
          tabTrack.classList.remove('hidden');
          renderStudentTickets();
        }
      });
    });

    // Optional Image input preview
    formImage.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (evt) => {
          uploadedImageBase64 = evt.target.result;
          imagePreviewContainer.innerHTML = `<img src="${uploadedImageBase64}" alt="Defect Preview">`;
          imagePreviewContainer.classList.remove('hidden');
        };
        reader.readAsDataURL(file);
      } else {
        uploadedImageBase64 = null;
        imagePreviewContainer.innerHTML = '';
        imagePreviewContainer.classList.add('hidden');
      }
    });

    // Complaint Form Submission
    complaintForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearValidationErrors();

      const cat = formCategory.value;
      const priority = formPriority.value;
      const loc = formLocation.value.trim();
      const phone = formContactPhone.value.trim();
      const title = formTitle.value.trim();
      const desc = formDescription.value.trim();
      const curStudent = getActiveStudent();

      let hasError = false;
      if (!loc || loc.length < 3) {
        document.getElementById('errLocation').textContent = 'Please specify campus building, floor, or room.';
        hasError = true;
      }
      const phoneRegex = /^[6-9]\d{9}$/;
      if (!phoneRegex.test(phone)) {
        document.getElementById('errPhone').textContent = 'Please enter a valid 10-digit mobile number.';
        hasError = true;
      }
      if (!title || title.length < 5) {
        document.getElementById('errTitle').textContent = 'Title must be at least 5 characters.';
        hasError = true;
      }
      if (!desc || desc.length < 10) {
        document.getElementById('errDescription').textContent = 'Description must be at least 10 characters.';
        hasError = true;
      }

      if (hasError) return;

      const newId = `CMP-${Math.floor(3000 + Math.random() * 7000)}`;

      const newComplaint = {
        id: newId,
        studentId: curStudent.id,
        studentName: curStudent.name,
        department: "Computer Science and Engineering",
        phone,
        category: cat,
        location: loc,
        title,
        description: desc,
        imageName: formImage.files[0] ? formImage.files[0].name : null,
        priority,
        assignedTo: null,
        status: "Submitted",
        submittedDate: new Date().toISOString(),
        resolvedDate: null,
        feedbackRating: null,
        feedbackComment: null
      };

      complaintData.complaints.unshift(newComplaint);
      saveData();

      complaintForm.reset();
      imagePreviewContainer.classList.add('hidden');
      uploadedImageBase64 = null;

      renderStudentTickets();
      renderAdminDashboard();
      showToast(`Complaint ticket ${newId} logged successfully!`, 'success');

      // Switch to tracking tab
      tabBtns[1].click();
    });

    // Student Feedback Trigger
    studentTicketsContainer.addEventListener('click', (e) => {
      const fbBtn = e.target.closest('.btn-give-feedback');
      if (fbBtn) {
        openFeedbackModal(fbBtn.dataset.id);
      }
    });

    // Star rating selection
    starRatingBox.addEventListener('click', (e) => {
      const star = e.target.closest('.star');
      if (star) {
        const rating = parseInt(star.dataset.rating, 10);
        setStarRating(rating);
      }
    });

    // Feedback Form Submit
    feedbackForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!activeTicketForFeedback) return;

      const rating = parseInt(feedbackRatingVal.value, 10);
      const comment = feedbackComment.value.trim();

      activeTicketForFeedback.feedbackRating = rating;
      activeTicketForFeedback.feedbackComment = comment;
      activeTicketForFeedback.status = 'Closed';

      saveData();
      feedbackModal.classList.add('hidden');
      renderStudentTickets();
      renderAdminDashboard();
      showToast(`Feedback submitted! Ticket ${activeTicketForFeedback.id} marked as Closed.`, 'success');
    });

    // Admin Filters
    adminSearchInput.addEventListener('input', renderAdminDashboard);
    adminCategoryFilter.addEventListener('change', renderAdminDashboard);
    adminStatusFilter.addEventListener('change', renderAdminDashboard);

    // Admin table actions (Assign & Advance)
    adminComplaintsTbody.addEventListener('click', (e) => {
      const assignBtn = e.target.closest('.btn-assign-trigger');
      const advanceBtn = e.target.closest('.btn-advance-work');

      if (assignBtn) {
        openAssignModal(assignBtn.dataset.id);
      } else if (advanceBtn) {
        const ticketId = advanceBtn.dataset.id;
        const nextStatus = advanceBtn.dataset.next;
        const ticket = complaintData.complaints.find(c => c.id === ticketId);
        if (ticket) {
          ticket.status = nextStatus;
          if (nextStatus === 'Resolved') ticket.resolvedDate = new Date().toISOString();
          saveData();
          renderAdminDashboard();
          renderStudentTickets();
          showToast(`Ticket ${ticketId} progressed to "${nextStatus}".`, 'info');
        }
      }
    });

    // Assign Form Submit
    assignForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!activeTicketForAssign) return;

      const staff = technicianSelect.value;
      activeTicketForAssign.assignedTo = staff;
      activeTicketForAssign.status = 'Assigned';

      saveData();
      assignModal.classList.add('hidden');
      renderAdminDashboard();
      renderStudentTickets();
      showToast(`Ticket ${activeTicketForAssign.id} assigned to ${staff}!`, 'success');
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
      if (confirm('Reset campus maintenance complaints to initial academic default state?')) {
        localStorage.removeItem(STORAGE_KEY);
        await loadInitialData();
        populateTechnicianDropdown();
        renderStudentTickets();
        renderAdminDashboard();
        showToast('Maintenance records restored to default.', 'success');
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
