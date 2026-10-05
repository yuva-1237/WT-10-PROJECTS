/**
 * Project 09: College Event Registration System
 * Student: Yuvathilagan
 * Subject: Web Technologies
 * Client Logic: Real-time validation, deadline/capacity guards, dynamic canvas QR generation, CSV export
 */

(function () {
  'use strict';

  // State keys
  const STORAGE_KEY_EVENTS = 'pec_events_data';
  const STORAGE_KEY_REGS = 'pec_event_registrations';

  // Fallback initial data
  const DEFAULT_EVENTS = [
    {
      id: 'EVT-201',
      name: 'HackPEC 2026: 24-Hour National Hackathon',
      description: 'Annual 24-hour national hackathon focused on AI, Web3, and Sustainable Tech solutions. Cash prizes worth ₹1,00,000!',
      date: '2026-11-12',
      time: '09:00 AM - Next Day 09:00 AM',
      venue: 'Campus Innovation Hub & Seminar Hall 1',
      category: 'Technical',
      maxParticipants: 60,
      deadline: '2026-11-05',
      posterIcon: '💻'
    },
    {
      id: 'EVT-202',
      name: 'PrathyuUtsav: Annual Inter-College Cultural Fest',
      description: 'The flagship cultural extravaganza featuring western music bands, classical dance battles, fashion parade, and live DJ night.',
      date: '2026-11-25',
      time: '10:00 AM - 08:00 PM',
      venue: 'Open Air Auditorium (OAA)',
      category: 'Cultural',
      maxParticipants: 150,
      deadline: '2026-11-18',
      posterIcon: '🎭'
    },
    {
      id: 'EVT-203',
      name: 'Hands-on Workshop: Modern Web Apps with Node & Express',
      description: 'Comprehensive practical masterclass on full-stack web applications, database connectivity, and REST API deployment.',
      date: '2026-10-28',
      time: '09:30 AM - 04:30 PM',
      venue: 'IT Computing Lab 2',
      category: 'Workshop',
      maxParticipants: 40,
      deadline: '2026-10-24',
      posterIcon: '⚙️'
    },
    {
      id: 'EVT-204',
      name: 'Inter-Department Cricket Tournament',
      description: 'T20 Knockout tournament across all academic departments. League matches followed by championship finals under floodlights.',
      date: '2026-11-02',
      time: '08:00 AM - 05:00 PM',
      venue: 'College Sports Ground',
      category: 'Sports',
      maxParticipants: 80,
      deadline: '2026-10-29',
      posterIcon: '🏏'
    },
    {
      id: 'EVT-205',
      name: 'Expert Seminar: Career Pathways in Cloud & AI Architecture',
      description: 'Distinguished guest lecture by enterprise cloud architects from Amazon AWS and Microsoft Azure.',
      date: '2026-10-20',
      time: '02:00 PM - 04:30 PM',
      venue: 'Main Auditorium',
      category: 'Seminar',
      maxParticipants: 100,
      deadline: '2026-10-18',
      posterIcon: '🎤'
    }
  ];

  const DEFAULT_REGISTRATIONS = [
    {
      regId: 'REG-EVT-7701',
      eventId: 'EVT-201',
      eventName: 'HackPEC 2026: 24-Hour National Hackathon',
      studentId: 'PEC2023CS001',
      studentName: 'Yuvathilagan M',
      email: 'yuva.pec@gmail.com',
      phone: '9876543210',
      department: 'Computer Science and Engineering',
      registeredDate: '2026-10-02T10:00:00.000Z',
      status: 'Confirmed'
    },
    {
      regId: 'REG-EVT-7702',
      eventId: 'EVT-203',
      eventName: 'Hands-on Workshop: Modern Web Apps with Node & Express',
      studentId: 'PEC2023CS002',
      studentName: 'Kavitha R',
      email: 'kavitha.r@gmail.com',
      phone: '9876543211',
      department: 'Computer Science and Engineering',
      registeredDate: '2026-10-03T14:30:00.000Z',
      status: 'Confirmed'
    }
  ];

  // In-memory state
  let events = [];
  let registrations = [];
  let currentFilterCategory = 'All';
  let searchQuery = '';
  let activeTab = 'events'; // 'events' | 'my-regs' | 'admin'
  let currentRegisteringEventId = null;

  // Initialize
  function init() {
    loadData();
    bindEvents();
    renderStats();
    renderEvents();
  }

  function loadData() {
    const storedEvents = localStorage.getItem(STORAGE_KEY_EVENTS);
    events = storedEvents ? JSON.parse(storedEvents) : [...DEFAULT_EVENTS];

    const storedRegs = localStorage.getItem(STORAGE_KEY_REGS);
    registrations = storedRegs ? JSON.parse(storedRegs) : [...DEFAULT_REGISTRATIONS];
  }

  function saveData() {
    localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify(events));
    localStorage.setItem(STORAGE_KEY_REGS, JSON.stringify(registrations));
    renderStats();
  }

  function showToast(message, type = 'success') {
    const toast = document.getElementById('alertToast');
    if (!toast) return;
    toast.textContent = message;
    toast.className = `alert-toast show ${type}`;
    setTimeout(() => {
      toast.className = 'alert-toast';
    }, 3500);
  }

  // Statistics calculation
  function renderStats() {
    const totalEventsEl = document.getElementById('statTotalEvents');
    const totalRegsEl = document.getElementById('statTotalRegs');
    const activeSeatsEl = document.getElementById('statTotalSeats');

    if (totalEventsEl) totalEventsEl.textContent = events.length;

    const confirmedRegs = registrations.filter(r => r.status === 'Confirmed');
    if (totalRegsEl) totalRegsEl.textContent = confirmedRegs.length;

    const totalSeats = events.reduce((sum, e) => sum + Number(e.maxParticipants), 0);
    if (activeSeatsEl) activeSeatsEl.textContent = totalSeats;
  }

  // Filter and Search Events
  function getFilteredEvents() {
    return events.filter(e => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = !q ||
        e.name.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.venue.toLowerCase().includes(q);

      const matchesCat = (currentFilterCategory === 'All') || (e.category === currentFilterCategory);
      return matchesSearch && matchesCat;
    });
  }

  // Category Badge helper
  function getCategoryBadgeClass(category) {
    switch (category) {
      case 'Technical': return 'badge-tech';
      case 'Cultural': return 'badge-cult';
      case 'Sports': return 'badge-sport';
      case 'Workshop': return 'badge-work';
      case 'Seminar': return 'badge-sem';
      default: return 'badge-tech';
    }
  }

  // Render Event Cards
  function renderEvents() {
    const container = document.getElementById('eventsGrid');
    if (!container) return;

    const filtered = getFilteredEvents();
    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 3rem; background: #fff; border-radius: 12px; border: 1px solid #e9d5ff;">
          <p style="font-size: 1.2rem; color: #64748b;">No events found matching your criteria.</p>
          <button class="btn btn-secondary btn-sm" id="resetFilterBtn" style="margin-top: 1rem;">Reset Search</button>
        </div>
      `;
      const resetBtn = document.getElementById('resetFilterBtn');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          searchQuery = '';
          currentFilterCategory = 'All';
          document.getElementById('eventSearchInput').value = '';
          updateCategoryTabs();
          renderEvents();
        });
      }
      return;
    }

    const todayStr = '2026-10-05'; // Reference evaluation date
    const today = new Date(todayStr);

    container.innerHTML = filtered.map(evt => {
      const confirmedCount = registrations.filter(r => r.eventId === evt.id && r.status === 'Confirmed').length;
      const capacity = Number(evt.maxParticipants);
      const remainingSeats = Math.max(0, capacity - confirmedCount);
      const percentFilled = Math.min(100, Math.round((confirmedCount / capacity) * 100));

      const deadlineDate = new Date(evt.deadline);
      deadlineDate.setHours(23, 59, 59, 999);
      const isExpired = today.getTime() > deadlineDate.getTime();
      const isFull = remainingSeats <= 0;

      let statusBadge = `<span class="badge badge-open">Open for Reg</span>`;
      let disableRegister = false;
      let btnLabel = `Register Now`;

      if (isExpired) {
        statusBadge = `<span class="badge badge-deadline-passed">Deadline Passed</span>`;
        disableRegister = true;
        btnLabel = `Deadline Closed`;
      } else if (isFull) {
        statusBadge = `<span class="badge badge-full">Housefull</span>`;
        disableRegister = true;
        btnLabel = `Seats Filled`;
      }

      return `
        <div class="event-card" data-id="${evt.id}">
          <div class="event-card-header">
            <div class="event-icon">${evt.posterIcon || '📅'}</div>
            <div class="event-meta">
              <div class="badge-row">
                <span class="badge ${getCategoryBadgeClass(evt.category)}">${evt.category}</span>
                ${statusBadge}
              </div>
              <h2 class="event-title">${evt.name}</h2>
            </div>
          </div>
          <div class="event-card-body">
            <p class="event-desc">${evt.description}</p>
            <ul class="event-details-list">
              <li>
                <span class="detail-label">📅 Date & Time:</span>
                <span class="detail-value">${evt.date} (${evt.time})</span>
              </li>
              <li>
                <span class="detail-label">📍 Venue:</span>
                <span class="detail-value">${evt.venue}</span>
              </li>
              <li>
                <span class="detail-label">⏰ Registration Closes:</span>
                <span class="detail-value" style="color: ${isExpired ? '#dc2626' : '#6b21a8'}">${evt.deadline}</span>
              </li>
            </ul>

            <div class="capacity-box">
              <div class="capacity-label">
                <span>Seats Booked: ${confirmedCount} / ${capacity}</span>
                <span>${remainingSeats} Left</span>
              </div>
              <div class="progress-bar-bg">
                <div class="progress-bar-fill ${isFull ? 'danger' : ''}" style="width: ${percentFilled}%"></div>
              </div>
            </div>
          </div>
          <div class="event-card-footer">
            <button class="btn btn-secondary btn-sm" onclick="window.EventApp.viewEventDetails('${evt.id}')">Details</button>
            <button class="btn btn-primary btn-sm" ${disableRegister ? 'disabled' : ''} onclick="window.EventApp.openRegisterModal('${evt.id}')">${btnLabel}</button>
          </div>
        </div>
      `;
    }).join('');
  }

  // Render My Registrations View
  function renderMyRegistrations() {
    const tbody = document.getElementById('myRegsTableBody');
    if (!tbody) return;

    if (registrations.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: #64748b; padding: 2rem;">No registrations made yet.</td></tr>`;
      return;
    }

    tbody.innerHTML = registrations.map(reg => {
      const isConfirmed = reg.status === 'Confirmed';
      return `
        <tr>
          <td><strong style="color: #6b21a8; font-family: monospace;">${reg.regId}</strong></td>
          <td><strong>${reg.eventName}</strong></td>
          <td>${reg.studentName} (${reg.studentId})</td>
          <td>${reg.department}</td>
          <td>${new Date(reg.registeredDate).toLocaleDateString()}</td>
          <td>
            <span class="badge ${isConfirmed ? 'badge-open' : 'badge-full'}">${reg.status}</span>
          </td>
          <td>
            ${isConfirmed ? `
              <button class="btn btn-secondary btn-sm" onclick="window.EventApp.showDigitalPass('${reg.regId}')">View Pass</button>
              <button class="btn btn-danger btn-sm" onclick="window.EventApp.cancelRegistration('${reg.regId}')">Cancel</button>
            ` : `<span style="font-size: 0.8rem; color: #94a3b8;">Cancelled</span>`}
          </td>
        </tr>
      `;
    }).join('');
  }

  // Render Admin View
  function renderAdminView() {
    const tbody = document.getElementById('adminEventsTableBody');
    if (!tbody) return;

    tbody.innerHTML = events.map(evt => {
      const regCount = registrations.filter(r => r.eventId === evt.id && r.status === 'Confirmed').length;
      return `
        <tr>
          <td><strong style="font-family: monospace;">${evt.id}</strong></td>
          <td><strong>${evt.name}</strong></td>
          <td><span class="badge ${getCategoryBadgeClass(evt.category)}">${evt.category}</span></td>
          <td>${evt.date}</td>
          <td>${evt.deadline}</td>
          <td>${regCount} / ${evt.maxParticipants}</td>
          <td>
            <button class="btn btn-secondary btn-sm" onclick="window.EventApp.editEvent('${evt.id}')">Edit</button>
            <button class="btn btn-danger btn-sm" onclick="window.EventApp.deleteEvent('${evt.id}')">Delete</button>
          </td>
        </tr>
      `;
    }).join('');

    renderAdminParticipants();
  }

  function renderAdminParticipants() {
    const tbody = document.getElementById('adminParticipantsTableBody');
    if (!tbody) return;

    if (registrations.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: #64748b;">No participant records found.</td></tr>`;
      return;
    }

    tbody.innerHTML = registrations.map(r => `
      <tr>
        <td><code>${r.regId}</code></td>
        <td>${r.eventName}</td>
        <td>${r.studentName}</td>
        <td>${r.studentId}</td>
        <td>${r.email}</td>
        <td>${r.department}</td>
        <td><span class="badge ${r.status === 'Confirmed' ? 'badge-open' : 'badge-full'}">${r.status}</span></td>
      </tr>
    `).join('');
  }

  // Category Tab Handling
  function updateCategoryTabs() {
    const tabs = document.querySelectorAll('.cat-tab');
    tabs.forEach(tab => {
      if (tab.getAttribute('data-cat') === currentFilterCategory) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });
  }

  // Navigation Handling
  function switchTab(target) {
    activeTab = target;
    document.querySelectorAll('.nav-btn').forEach(btn => {
      if (btn.getAttribute('data-target') === target) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    document.getElementById('eventsCatalogSection').style.display = target === 'events' ? 'block' : 'none';
    document.getElementById('myRegistrationsSection').style.display = target === 'my-regs' ? 'block' : 'none';
    document.getElementById('adminSection').style.display = target === 'admin' ? 'block' : 'none';

    if (target === 'events') renderEvents();
    if (target === 'my-regs') renderMyRegistrations();
    if (target === 'admin') renderAdminView();
  }

  // Modal helpers
  function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.add('open');
  }

  function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.remove('open');
  }

  // Canvas QR Code Generator Simulation
  function drawQRCode(canvasId, text) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const size = canvas.width;
    ctx.clearRect(0, 0, size, size);

    // Draw white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);

    // Seeded random pseudo-QR pattern based on text
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = (hash << 5) - hash + text.charCodeAt(i);
      hash |= 0;
    }

    const gridSize = 16;
    const cellSize = size / gridSize;
    ctx.fillStyle = '#1e1b4b';

    // Corner finder patterns
    function drawFinder(startX, startY) {
      ctx.fillRect(startX * cellSize, startY * cellSize, 4 * cellSize, 4 * cellSize);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect((startX + 1) * cellSize, (startY + 1) * cellSize, 2 * cellSize, 2 * cellSize);
      ctx.fillStyle = '#1e1b4b';
      ctx.fillRect((startX + 1.5) * cellSize, (startY + 1.5) * cellSize, 1 * cellSize, 1 * cellSize);
    }

    drawFinder(1, 1);
    drawFinder(gridSize - 5, 1);
    drawFinder(1, gridSize - 5);

    // Draw data cells
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        // Skip corner finder zones
        if ((r < 6 && c < 6) || (r < 6 && c > gridSize - 7) || (r > gridSize - 7 && c < 6)) {
          continue;
        }
        const val = Math.abs(Math.sin((r * 13 + c * 29 + hash)) * 100);
        if (val > 45) {
          ctx.fillRect(c * cellSize, r * cellSize, cellSize - 0.5, cellSize - 0.5);
        }
      }
    }
  }

  // Core Actions
  function openRegisterModal(eventId) {
    const evt = events.find(e => e.id === eventId);
    if (!evt) return;

    currentRegisteringEventId = eventId;
    document.getElementById('modalEventName').textContent = evt.name;
    document.getElementById('modalEventCategory').textContent = evt.category;
    document.getElementById('modalEventDate').textContent = `${evt.date} (${evt.time})`;
    document.getElementById('modalEventVenue').textContent = evt.venue;

    // Reset form errors
    document.getElementById('regFormErrors').style.display = 'none';
    document.getElementById('regFormErrors').innerHTML = '';
    document.getElementById('eventRegForm').reset();

    openModal('registerModal');
  }

  function handleRegistrationSubmit(e) {
    e.preventDefault();
    const evt = events.find(e => e.id === currentRegisteringEventId);
    if (!evt) return;

    const studentId = document.getElementById('regStudentId').value.trim();
    const studentName = document.getElementById('regStudentName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const phone = document.getElementById('regPhone').value.trim();
    const department = document.getElementById('regDepartment').value;

    const errors = [];

    // Validation
    if (!studentId) errors.push('Student ID is required.');
    if (!studentName || studentName.length < 2) errors.push('Valid Student Name is required.');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) errors.push('Valid email address is required.');
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) errors.push('10-digit mobile number is required.');

    // Deadline check
    const deadline = new Date(evt.deadline);
    deadline.setHours(23, 59, 59, 999);
    const today = new Date('2026-10-05');
    if (today.getTime() > deadline.getTime()) {
      errors.push('Registration deadline for this event has passed.');
    }

    // Capacity check
    const confirmedCount = registrations.filter(r => r.eventId === evt.id && r.status === 'Confirmed').length;
    if (confirmedCount >= Number(evt.maxParticipants)) {
      errors.push('Event has reached maximum participant capacity.');
    }

    // Duplicate check
    const alreadyRegistered = registrations.some(r => r.eventId === evt.id && r.studentId.toUpperCase() === studentId.toUpperCase() && r.status === 'Confirmed');
    if (alreadyRegistered) {
      errors.push(`Student (${studentId}) is already registered for this event.`);
    }

    if (errors.length > 0) {
      const errBox = document.getElementById('regFormErrors');
      errBox.style.display = 'block';
      errBox.innerHTML = errors.map(err => `<div>• ${err}</div>`).join('');
      return;
    }

    // Create Registration
    const regId = `REG-EVT-${Math.floor(1000 + Math.random() * 9000)}`;
    const newReg = {
      regId,
      eventId: evt.id,
      eventName: evt.name,
      studentId: studentId.toUpperCase(),
      studentName,
      email,
      phone,
      department,
      registeredDate: new Date().toISOString(),
      status: 'Confirmed'
    };

    registrations.push(newReg);
    saveData();
    closeModal('registerModal');
    renderEvents();
    showToast(`Registration Successful! ID: ${regId}`, 'success');

    // Show Pass immediately
    showDigitalPass(regId);
  }

  function showDigitalPass(regId) {
    const reg = registrations.find(r => r.regId === regId);
    if (!reg) return;
    const evt = events.find(e => e.id === reg.eventId) || {
      name: reg.eventName,
      date: '2026-11-12',
      time: '10:00 AM',
      venue: 'Main Campus',
      category: 'General'
    };

    document.getElementById('passRegId').textContent = reg.regId;
    document.getElementById('passEventTitle').textContent = reg.eventName;
    document.getElementById('passStudentName').textContent = reg.studentName;
    document.getElementById('passStudentId').textContent = reg.studentId;
    document.getElementById('passDepartment').textContent = reg.department;
    document.getElementById('passDateTime').textContent = `${evt.date} (${evt.time})`;
    document.getElementById('passVenue').textContent = evt.venue;

    drawQRCode('passQrCanvas', `${reg.regId}|${reg.studentId}|${reg.eventName}`);
    openModal('passModal');
  }

  function cancelRegistration(regId) {
    const reg = registrations.find(r => r.regId === regId);
    if (!reg) return;

    if (confirm(`Are you sure you want to cancel registration ${regId} for "${reg.eventName}"?`)) {
      reg.status = 'Cancelled';
      saveData();
      renderMyRegistrations();
      renderEvents();
      showToast(`Registration ${regId} cancelled. Seat released.`, 'warning');
    }
  }

  function viewEventDetails(eventId) {
    const evt = events.find(e => e.id === eventId);
    if (!evt) return;

    const count = registrations.filter(r => r.eventId === evt.id && r.status === 'Confirmed').length;
    alert(`EVENT DETAILS:\n\nName: ${evt.name}\nCategory: ${evt.category}\nDate: ${evt.date}\nTime: ${evt.time}\nVenue: ${evt.venue}\nMax Capacity: ${evt.maxParticipants}\nRegistered: ${count}\nDeadline: ${evt.deadline}\n\nDescription:\n${evt.description}`);
  }

  // Admin: Create/Edit Event
  function openAddEventModal() {
    document.getElementById('adminEventForm').reset();
    document.getElementById('adminEventId').value = '';
    document.getElementById('adminModalTitle').textContent = 'Create New Event';
    openModal('adminEventModal');
  }

  function editEvent(eventId) {
    const evt = events.find(e => e.id === eventId);
    if (!evt) return;

    document.getElementById('adminEventId').value = evt.id;
    document.getElementById('adminEventName').value = evt.name;
    document.getElementById('adminEventCategory').value = evt.category;
    document.getElementById('adminEventDate').value = evt.date;
    document.getElementById('adminEventTime').value = evt.time;
    document.getElementById('adminEventVenue').value = evt.venue;
    document.getElementById('adminEventCapacity').value = evt.maxParticipants;
    document.getElementById('adminEventDeadline').value = evt.deadline;
    document.getElementById('adminEventDesc').value = evt.description;

    document.getElementById('adminModalTitle').textContent = `Edit Event (${evt.id})`;
    openModal('adminEventModal');
  }

  function handleAdminEventSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('adminEventId').value;
    const name = document.getElementById('adminEventName').value.trim();
    const category = document.getElementById('adminEventCategory').value;
    const date = document.getElementById('adminEventDate').value;
    const time = document.getElementById('adminEventTime').value.trim();
    const venue = document.getElementById('adminEventVenue').value.trim();
    const capacity = parseInt(document.getElementById('adminEventCapacity').value, 10);
    const deadline = document.getElementById('adminEventDeadline').value;
    const description = document.getElementById('adminEventDesc').value.trim();

    if (!name || !date || !venue || isNaN(capacity) || capacity < 1 || !deadline) {
      alert('Please fill all mandatory fields properly.');
      return;
    }

    if (id) {
      // Update
      const index = events.findIndex(e => e.id === id);
      if (index !== -1) {
        events[index] = { ...events[index], name, category, date, time, venue, maxParticipants: capacity, deadline, description };
        showToast('Event updated successfully.', 'success');
      }
    } else {
      // Create new
      const newId = `EVT-${Math.floor(200 + Math.random() * 800)}`;
      events.push({
        id: newId,
        name,
        category,
        date,
        time,
        venue,
        maxParticipants: capacity,
        deadline,
        description,
        posterIcon: category === 'Technical' ? '💻' : category === 'Cultural' ? '🎭' : category === 'Sports' ? '🏏' : '📚'
      });
      showToast(`Event created successfully: ${newId}`, 'success');
    }

    saveData();
    closeModal('adminEventModal');
    renderEvents();
    renderAdminView();
  }

  function deleteEvent(eventId) {
    if (confirm(`Are you sure you want to delete event ${eventId}?`)) {
      events = events.filter(e => e.id !== eventId);
      saveData();
      renderEvents();
      renderAdminView();
      showToast(`Event ${eventId} deleted.`, 'danger');
    }
  }

  // Export CSV
  function exportParticipantsCSV() {
    if (registrations.length === 0) {
      alert('No participant registrations available to export.');
      return;
    }

    const headers = ['Registration ID', 'Event Name', 'Student ID', 'Student Name', 'Email', 'Phone', 'Department', 'Date', 'Status'];
    const rows = registrations.map(r => [
      r.regId,
      `"${r.eventName.replace(/"/g, '""')}"`,
      r.studentId,
      `"${r.studentName.replace(/"/g, '""')}"`,
      r.email,
      r.phone,
      `"${r.department.replace(/"/g, '""')}"`,
      r.registeredDate,
      r.status
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Event_Participants_Export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Participant list exported to CSV.', 'success');
  }

  // Bind Listeners
  function bindEvents() {
    // Navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-target');
        switchTab(target);
      });
    });

    // Category Tabs
    document.querySelectorAll('.cat-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        currentFilterCategory = tab.getAttribute('data-cat');
        updateCategoryTabs();
        renderEvents();
      });
    });

    // Search Input
    const searchInput = document.getElementById('eventSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.trim();
        renderEvents();
      });
    }

    // Modal close buttons
    document.querySelectorAll('.modal-close, .btn-modal-cancel').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const modal = e.target.closest('.modal-backdrop');
        if (modal) modal.classList.remove('open');
      });
    });

    // Form Submissions
    const regForm = document.getElementById('eventRegForm');
    if (regForm) regForm.addEventListener('submit', handleRegistrationSubmit);

    const adminForm = document.getElementById('adminEventForm');
    if (adminForm) adminForm.addEventListener('submit', handleAdminEventSubmit);

    const addEventBtn = document.getElementById('addEventBtn');
    if (addEventBtn) addEventBtn.addEventListener('click', openAddEventModal);

    const exportCsvBtn = document.getElementById('exportCsvBtn');
    if (exportCsvBtn) exportCsvBtn.addEventListener('click', exportParticipantsCSV);
  }

  // Expose methods for inline calls
  window.EventApp = {
    openRegisterModal,
    showDigitalPass,
    cancelRegistration,
    viewEventDetails,
    editEvent,
    deleteEvent,
    openAddEventModal
  };

  // Start app on DOMContentLoaded
  document.addEventListener('DOMContentLoaded', init);
})();
