/**
 * Hospital Appointment Management System - Application Logic
 * Prathyusha Health Center - Web Technologies
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'wt_hospital_system_data';

  // State
  let hospitalData = {
    hospitalName: "Prathyusha Multi-Speciality Health Center",
    specializations: [
      "Cardiology",
      "Orthopedics",
      "Pediatrics",
      "Neurology",
      "General Medicine",
      "Dermatology"
    ],
    timeSlots: [
      "09:00 AM",
      "10:00 AM",
      "11:00 AM",
      "12:00 PM",
      "02:00 PM",
      "03:00 PM",
      "04:00 PM",
      "05:00 PM"
    ],
    doctors: [],
    appointments: []
  };

  let selectedDoctorForBooking = null;

  // DOM Elements
  const portalRoleSwitch = document.getElementById('portalRoleSwitch');
  const patientView = document.getElementById('patientView');
  const adminView = document.getElementById('adminView');

  // Tabs
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabDoctors = document.getElementById('tabDoctors');
  const tabHistory = document.getElementById('tabHistory');

  // Filters & Search
  const doctorSearchInput = document.getElementById('doctorSearchInput');
  const specFilter = document.getElementById('specFilter');
  const docCountBadge = document.getElementById('docCountBadge');
  const doctorsGrid = document.getElementById('doctorsGrid');

  const historyPhoneFilter = document.getElementById('historyPhoneFilter');
  const historyStatusFilter = document.getElementById('historyStatusFilter');
  const patientAppointmentsTbody = document.getElementById('patientAppointmentsTbody');

  // Admin View
  const kpiTotalApts = document.getElementById('kpiTotalApts');
  const kpiBookedApts = document.getElementById('kpiBookedApts');
  const kpiCompletedApts = document.getElementById('kpiCompletedApts');
  const kpiCancelledApts = document.getElementById('kpiCancelledApts');
  const adminAppointmentsTbody = document.getElementById('adminAppointmentsTbody');
  const btnAddDoctor = document.getElementById('btnAddDoctor');
  const btnResetData = document.getElementById('btnResetData');

  // Booking Modal
  const bookingModal = document.getElementById('bookingModal');
  const bookingForm = document.getElementById('bookingForm');
  const bookingDoctorName = document.getElementById('bookingDoctorName');
  const bookingDoctorSpec = document.getElementById('bookingDoctorSpec');
  const bookDoctorId = document.getElementById('bookDoctorId');
  const bookPatientName = document.getElementById('bookPatientName');
  const bookPatientPhone = document.getElementById('bookPatientPhone');
  const bookPatientEmail = document.getElementById('bookPatientEmail');
  const bookPatientAge = document.getElementById('bookPatientAge');
  const bookPatientGender = document.getElementById('bookPatientGender');
  const bookDate = document.getElementById('bookDate');
  const slotsContainer = document.getElementById('slotsContainer');
  const selectedTimeSlot = document.getElementById('selectedTimeSlot');
  const bookReason = document.getElementById('bookReason');

  // Doctor Modal
  const doctorModal = document.getElementById('doctorModal');
  const doctorForm = document.getElementById('doctorForm');
  const docSpec = document.getElementById('docSpec');

  const toast = document.getElementById('toast');

  // --- INITIALIZATION ---
  async function init() {
    await loadInitialData();
    setupEventListeners();
    populateSpecializations();
    setMinBookingDate();
    renderDoctors();
    renderPatientAppointments();
    renderAdminDashboard();
  }

  async function loadInitialData() {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      try {
        hospitalData = JSON.parse(cached);
        return;
      } catch (e) {
        console.warn('Storage parsing failed.');
      }
    }

    try {
      const res = await fetch('data/initial_data.json');
      if (res.ok) {
        hospitalData = await res.json();
        saveData();
      }
    } catch (e) {
      console.warn('Using default seed state.');
    }
  }

  function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(hospitalData));
  }

  function setMinBookingDate() {
    const today = new Date().toISOString().split('T')[0];
    bookDate.min = today;
    // Default to tomorrow or today
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    bookDate.value = tomorrow.toISOString().split('T')[0];
  }

  function populateSpecializations() {
    specFilter.innerHTML = '<option value="">All Specializations</option>';
    docSpec.innerHTML = '';

    hospitalData.specializations.forEach(sp => {
      const opt1 = document.createElement('option');
      opt1.value = sp;
      opt1.textContent = sp;
      specFilter.appendChild(opt1);

      const opt2 = document.createElement('option');
      opt2.value = sp;
      opt2.textContent = sp;
      docSpec.appendChild(opt2);
    });
  }

  // --- RENDERING ---
  function renderDoctors() {
    const query = doctorSearchInput.value.trim().toLowerCase();
    const selSpec = specFilter.value;

    const filtered = hospitalData.doctors.filter(doc => {
      const matchesSearch = !query || 
        doc.name.toLowerCase().includes(query) || 
        doc.specialization.toLowerCase().includes(query);
      const matchesSpec = !selSpec || doc.specialization === selSpec;
      return matchesSearch && matchesSpec;
    });

    docCountBadge.textContent = `${filtered.length} Doctors Available`;
    doctorsGrid.innerHTML = '';

    if (filtered.length === 0) {
      doctorsGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-muted);">
          No consulting physicians found matching the search criteria.
        </div>`;
      return;
    }

    filtered.forEach(doc => {
      const card = document.createElement('article');
      card.className = 'doctor-card';
      card.innerHTML = `
        <div>
          <div class="doc-header">
            <div class="doc-avatar">🩺</div>
            <div class="doc-info">
              <h3>${doc.name}</h3>
              <div class="doc-spec">${doc.specialization}</div>
              <div class="doc-exp">${doc.experience} Clinical Experience</div>
            </div>
          </div>
          <div class="doc-details">
            <div class="doc-detail-row">
              <span style="color:var(--text-muted);">Available Days:</span>
              <strong>${Array.isArray(doc.availableDays) ? doc.availableDays.join(', ') : doc.availableDays}</strong>
            </div>
            <div class="doc-detail-row">
              <span style="color:var(--text-muted);">Timings:</span>
              <span>${doc.availableTime}</span>
            </div>
            <div class="doc-detail-row">
              <span style="color:var(--text-muted);">Clinic Room:</span>
              <span>${doc.room || 'OPD Suite'}</span>
            </div>
            <div class="doc-detail-row" style="margin-top:0.5rem;">
              <span style="color:var(--text-muted);">Consultation Fee:</span>
              <span class="doc-fee">₹${doc.fee}</span>
            </div>
          </div>
        </div>
        <div class="doc-footer">
          <button class="btn btn-primary btn-block btn-book-slot" data-id="${doc.id}">
            Book Appointment Slot
          </button>
        </div>
      `;
      doctorsGrid.appendChild(card);
    });
  }

  // --- DOUBLE BOOKING PREVENTION & SLOTS RENDERING ---
  function renderTimeSlots() {
    slotsContainer.innerHTML = '';
    selectedTimeSlot.value = '';
    const dateVal = bookDate.value;
    const docId = bookDoctorId.value;

    if (!dateVal || !docId) return;

    // Retrieve already booked slots for this doctor on this date
    const bookedSlotsSet = new Set(
      hospitalData.appointments
        .filter(a => a.doctorId === docId && a.date === dateVal && a.status === 'Booked')
        .map(a => a.time)
    );

    hospitalData.timeSlots.forEach(slot => {
      const isBooked = bookedSlotsSet.has(slot);
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = slot;

      if (isBooked) {
        btn.className = 'slot-btn booked';
        btn.title = 'Slot Already Booked (Double Booking Prevented)';
        btn.disabled = true;
      } else {
        btn.className = 'slot-btn available';
        btn.addEventListener('click', () => {
          document.querySelectorAll('.slot-btn.available').forEach(b => b.classList.remove('selected'));
          btn.classList.add('selected');
          selectedTimeSlot.value = slot;
          document.getElementById('errBookSlot').textContent = '';
        });
      }

      slotsContainer.appendChild(btn);
    });
  }

  function openBookingModal(doctorId) {
    const doc = hospitalData.doctors.find(d => d.id === doctorId);
    if (!doc) return;
    selectedDoctorForBooking = doc;

    bookingDoctorName.textContent = doc.name;
    bookingDoctorSpec.textContent = `${doc.specialization} | Fee: ₹${doc.fee} | ${doc.room}`;
    bookDoctorId.value = doc.id;

    // Reset inputs
    clearErrors();
    selectedTimeSlot.value = '';
    setMinBookingDate();
    renderTimeSlots();

    bookingModal.classList.remove('hidden');
  }

  function renderPatientAppointments() {
    const phoneFilter = historyPhoneFilter.value.trim();
    const statusFilter = historyStatusFilter.value;

    const filtered = hospitalData.appointments.filter(a => {
      const matchesPhone = !phoneFilter || a.patientPhone.includes(phoneFilter);
      const matchesStatus = !statusFilter || a.status === statusFilter;
      return matchesPhone && matchesStatus;
    });

    patientAppointmentsTbody.innerHTML = '';
    if (filtered.length === 0) {
      patientAppointmentsTbody.innerHTML = `
        <tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 2rem;">No appointments found.</td></tr>`;
      return;
    }

    filtered.forEach(apt => {
      const tr = document.createElement('tr');
      const badgeClass = apt.status === 'Booked' ? 'badge-booked' : (apt.status === 'Completed' ? 'badge-completed' : 'badge-cancelled');
      
      tr.innerHTML = `
        <td><strong>${apt.id}</strong></td>
        <td>
          <div><strong>${apt.patientName}</strong> (${apt.patientAge} ${apt.patientGender})</div>
          <div style="font-size:0.775rem; color:var(--text-muted);">${apt.patientPhone} | ${apt.patientEmail}</div>
        </td>
        <td>${apt.doctorName}</td>
        <td><span class="badge" style="background:#e0f2fe; color:#0369a1;">${apt.specialization}</span></td>
        <td><strong>${apt.date}</strong> at ${apt.time}</td>
        <td><span class="badge ${badgeClass}">${apt.status}</span></td>
        <td>
          ${apt.status === 'Booked' ? `<button class="btn btn-danger btn-sm btn-cancel-apt" data-id="${apt.id}">Cancel</button>` : `<span style="color:var(--text-muted); font-size:0.8rem;">No actions</span>`}
        </td>
      `;
      patientAppointmentsTbody.appendChild(tr);
    });
  }

  function renderAdminDashboard() {
    // Dynamic KPI calculations
    const total = hospitalData.appointments.length;
    const booked = hospitalData.appointments.filter(a => a.status === 'Booked').length;
    const completed = hospitalData.appointments.filter(a => a.status === 'Completed').length;
    const cancelled = hospitalData.appointments.filter(a => a.status === 'Cancelled').length;

    kpiTotalApts.textContent = total;
    kpiBookedApts.textContent = booked;
    kpiCompletedApts.textContent = completed;
    kpiCancelledApts.textContent = cancelled;

    adminAppointmentsTbody.innerHTML = '';
    if (hospitalData.appointments.length === 0) {
      adminAppointmentsTbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:2rem;">No records.</td></tr>`;
      return;
    }

    hospitalData.appointments.forEach(apt => {
      const tr = document.createElement('tr');
      const badgeClass = apt.status === 'Booked' ? 'badge-booked' : (apt.status === 'Completed' ? 'badge-completed' : 'badge-cancelled');

      tr.innerHTML = `
        <td><strong>${apt.id}</strong></td>
        <td>${apt.patientName}</td>
        <td>${apt.patientPhone}</td>
        <td>${apt.doctorName}</td>
        <td>${apt.date} - ${apt.time}</td>
        <td><span style="font-size:0.8rem; color:#475569;">${apt.reason || 'General checkup'}</span></td>
        <td><span class="badge ${badgeClass}">${apt.status}</span></td>
        <td>
          <div class="btn-group">
            ${apt.status === 'Booked' ? `
              <button class="btn btn-success btn-sm btn-mark-completed" data-id="${apt.id}" title="Mark Consultation Completed">Complete</button>
              <button class="btn btn-danger btn-sm btn-cancel-admin" data-id="${apt.id}" title="Cancel Consultation">Cancel</button>
            ` : `<span style="font-size:0.775rem; color:var(--text-muted);">-</span>`}
          </div>
        </td>
      `;
      adminAppointmentsTbody.appendChild(tr);
    });
  }

  function clearErrors() {
    document.querySelectorAll('.error-msg').forEach(el => el.textContent = '');
  }

  // --- EVENT LISTENERS ---
  function setupEventListeners() {
    // Portal View Toggle
    portalRoleSwitch.addEventListener('change', (e) => {
      if (e.target.value === 'patient') {
        adminView.classList.add('hidden');
        patientView.classList.remove('hidden');
        renderDoctors();
        renderPatientAppointments();
      } else {
        patientView.classList.add('hidden');
        adminView.classList.remove('hidden');
        renderAdminDashboard();
      }
    });

    // Patient Tabs
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const target = btn.dataset.tab;
        if (target === 'tabDoctors') {
          tabDoctors.classList.remove('hidden');
          tabHistory.classList.add('hidden');
          renderDoctors();
        } else {
          tabDoctors.classList.add('hidden');
          tabHistory.classList.remove('hidden');
          renderPatientAppointments();
        }
      });
    });

    // Doctor filters
    doctorSearchInput.addEventListener('input', renderDoctors);
    specFilter.addEventListener('change', renderDoctors);

    // History filters
    historyPhoneFilter.addEventListener('input', renderPatientAppointments);
    historyStatusFilter.addEventListener('change', renderPatientAppointments);

    // Book button delegation on doctor cards
    doctorsGrid.addEventListener('click', (e) => {
      const bookBtn = e.target.closest('.btn-book-slot');
      if (bookBtn) {
        openBookingModal(bookBtn.dataset.id);
      }
    });

    // Date change updates available slots dynamically
    bookDate.addEventListener('change', renderTimeSlots);

    // Booking form submit
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearErrors();

      const name = bookPatientName.value.trim();
      const phone = bookPatientPhone.value.trim();
      const email = bookPatientEmail.value.trim();
      const age = parseInt(bookPatientAge.value, 10);
      const gender = bookPatientGender.value;
      const date = bookDate.value;
      const time = selectedTimeSlot.value;
      const reason = bookReason.value.trim();
      const docId = bookDoctorId.value;

      let hasError = false;
      if (!name || name.length < 2) {
        document.getElementById('errBookName').textContent = 'Please enter a valid patient name.';
        hasError = true;
      }
      const phoneRegex = /^[6-9]\d{9}$/;
      if (!phoneRegex.test(phone)) {
        document.getElementById('errBookPhone').textContent = 'Please enter a valid 10-digit mobile number.';
        hasError = true;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        document.getElementById('errBookEmail').textContent = 'Please enter a valid email address.';
        hasError = true;
      }
      if (!date) {
        document.getElementById('errBookDate').textContent = 'Please select a date.';
        hasError = true;
      }
      if (!time) {
        document.getElementById('errBookSlot').textContent = 'Please select an available time slot from the list above.';
        hasError = true;
      }

      if (hasError) return;

      // Double-Booking Check Guard
      const isAlreadyBooked = hospitalData.appointments.some(
        a => a.doctorId === docId && a.date === date && a.time === time && a.status === 'Booked'
      );

      if (isAlreadyBooked) {
        document.getElementById('errBookSlot').textContent = 'This time slot was just booked by another patient! Please pick another slot.';
        renderTimeSlots();
        return;
      }

      const newApt = {
        id: `APT-${Date.now().toString().slice(-5)}`,
        patientName: name,
        patientEmail: email,
        patientPhone: phone,
        patientAge: age,
        patientGender: gender,
        doctorId: docId,
        doctorName: selectedDoctorForBooking.name,
        specialization: selectedDoctorForBooking.specialization,
        date,
        time,
        reason: reason || 'General medical consultation',
        status: 'Booked',
        createdAt: new Date().toISOString()
      };

      hospitalData.appointments.unshift(newApt);
      saveData();
      bookingModal.classList.add('hidden');
      renderDoctors();
      renderPatientAppointments();
      renderAdminDashboard();
      showToast(`Appointment successfully booked for ${name}! Token: ${newApt.id}`, 'success');

      // Switch to history tab to view confirmed booking
      tabBtns[1].click();
    });

    // Patient cancel appointment
    patientAppointmentsTbody.addEventListener('click', (e) => {
      const cancelBtn = e.target.closest('.btn-cancel-apt');
      if (cancelBtn) {
        const id = cancelBtn.dataset.id;
        if (confirm(`Are you sure you want to cancel appointment ${id}? This slot will be released for other patients.`)) {
          const apt = hospitalData.appointments.find(a => a.id === id);
          if (apt) {
            apt.status = 'Cancelled';
            saveData();
            renderPatientAppointments();
            renderAdminDashboard();
            showToast(`Appointment ${id} cancelled. Time slot is now free.`, 'info');
          }
        }
      }
    });

    // Admin table actions
    adminAppointmentsTbody.addEventListener('click', (e) => {
      const compBtn = e.target.closest('.btn-mark-completed');
      const cancelBtn = e.target.closest('.btn-cancel-admin');

      if (compBtn) {
        const apt = hospitalData.appointments.find(a => a.id === compBtn.dataset.id);
        if (apt) {
          apt.status = 'Completed';
          saveData();
          renderAdminDashboard();
          renderPatientAppointments();
          showToast(`Appointment ${apt.id} marked as Completed.`, 'success');
        }
      } else if (cancelBtn) {
        const apt = hospitalData.appointments.find(a => a.id === cancelBtn.dataset.id);
        if (apt && confirm(`Cancel appointment ${apt.id}?`)) {
          apt.status = 'Cancelled';
          saveData();
          renderAdminDashboard();
          renderPatientAppointments();
          showToast(`Appointment ${apt.id} cancelled.`, 'info');
        }
      }
    });

    // Add Doctor
    btnAddDoctor.addEventListener('click', () => {
      doctorForm.reset();
      doctorModal.classList.remove('hidden');
    });

    doctorForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const newDoc = {
        id: `DOC00${hospitalData.doctors.length + 1}`,
        name: document.getElementById('docName').value.trim(),
        specialization: document.getElementById('docSpec').value,
        experience: document.getElementById('docExp').value.trim(),
        availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        availableTime: document.getElementById('docTime').value.trim(),
        room: document.getElementById('docRoom').value.trim(),
        fee: parseInt(document.getElementById('docFee').value, 10) || 500
      };

      hospitalData.doctors.push(newDoc);
      saveData();
      doctorModal.classList.add('hidden');
      renderDoctors();
      showToast(`Doctor ${newDoc.name} registered.`, 'success');
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
      if (confirm('Reset hospital appointments and doctors to initial sample state?')) {
        localStorage.removeItem(STORAGE_KEY);
        await loadInitialData();
        populateSpecializations();
        renderDoctors();
        renderPatientAppointments();
        renderAdminDashboard();
        showToast('Hospital records reset to default.', 'success');
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
