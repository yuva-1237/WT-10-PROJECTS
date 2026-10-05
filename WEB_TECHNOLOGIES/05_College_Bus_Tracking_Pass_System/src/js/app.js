/**
 * College Bus Tracking and Digital Pass System - Application Logic
 * Prathyusha Transport Department - Web Technologies
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'wt_bus_system_data';

  // State
  let transportData = {
    institution: "Prathyusha Engineering College - Transport Department",
    busStatuses: ["Not Started", "On Route", "At College", "Completed"],
    buses: [],
    passes: []
  };

  // DOM Elements
  const portalRoleSwitch = document.getElementById('portalRoleSwitch');
  const studentView = document.getElementById('studentView');
  const adminView = document.getElementById('adminView');

  // Tabs
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabRoutes = document.getElementById('tabRoutes');
  const tabPass = document.getElementById('tabPass');

  // Route Search & Filter
  const routeSearchInput = document.getElementById('routeSearchInput');
  const statusFilter = document.getElementById('statusFilter');
  const routeCountBadge = document.getElementById('routeCountBadge');
  const busesGrid = document.getElementById('busesGrid');

  // Pass Form & Card
  const passForm = document.getElementById('passForm');
  const passStudentId = document.getElementById('passStudentId');
  const passStudentName = document.getElementById('passStudentName');
  const passDept = document.getElementById('passDept');
  const passPhone = document.getElementById('passPhone');
  const passBusSelect = document.getElementById('passBusSelect');
  const passStopSelect = document.getElementById('passStopSelect');
  const passValidUntil = document.getElementById('passValidUntil');

  const cardStudentName = document.getElementById('cardStudentName');
  const cardStudentId = document.getElementById('cardStudentId');
  const cardRoute = document.getElementById('cardRoute');
  const cardStop = document.getElementById('cardStop');
  const cardBusNo = document.getElementById('cardBusNo');
  const cardExpiry = document.getElementById('cardExpiry');
  const cardPassId = document.getElementById('cardPassId');
  const passStatusBadge = document.getElementById('passStatusBadge');

  // Admin Elements
  const kpiTotalBuses = document.getElementById('kpiTotalBuses');
  const kpiOnRouteBuses = document.getElementById('kpiOnRouteBuses');
  const kpiAtCollegeBuses = document.getElementById('kpiAtCollegeBuses');
  const kpiTotalPasses = document.getElementById('kpiTotalPasses');
  const adminBusesTbody = document.getElementById('adminBusesTbody');
  const adminPassesTbody = document.getElementById('adminPassesTbody');
  const btnAddBus = document.getElementById('btnAddBus');
  const btnResetData = document.getElementById('btnResetData');

  // Tracker Modal
  const trackerModal = document.getElementById('trackerModal');
  const trackerBusTitle = document.getElementById('trackerBusTitle');
  const trackerBusSub = document.getElementById('trackerBusSub');
  const trackerStatusCallout = document.getElementById('trackerStatusCallout');
  const trackerTimeline = document.getElementById('trackerTimeline');

  // Bus Modal
  const busModal = document.getElementById('busModal');
  const busForm = document.getElementById('busForm');

  const toast = document.getElementById('toast');

  // --- INITIALIZATION ---
  async function init() {
    await loadInitialData();
    setupEventListeners();
    populateBusDropdowns();
    renderBusesGrid();
    renderDefaultPassPreview();
    renderAdminDashboard();
  }

  async function loadInitialData() {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      try {
        transportData = JSON.parse(cached);
        return;
      } catch (e) {
        console.warn('Storage parsing failed.');
      }
    }

    try {
      const res = await fetch('data/initial_data.json');
      if (res.ok) {
        transportData = await res.json();
        saveData();
      }
    } catch (e) {
      console.warn('Using default seed state.');
    }
  }

  function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transportData));
  }

  function getStatusBadgeClass(status) {
    switch (status) {
      case 'On Route': return 'badge-status-on-route';
      case 'At College': return 'badge-status-at-college';
      case 'Not Started': return 'badge-status-not-started';
      case 'Completed': return 'badge-status-completed';
      default: return 'badge-info';
    }
  }

  function populateBusDropdowns() {
    passBusSelect.innerHTML = '';
    transportData.buses.forEach(b => {
      const opt = document.createElement('option');
      opt.value = b.busNumber;
      opt.textContent = `${b.busNumber} (${b.routeName})`;
      passBusSelect.appendChild(opt);
    });

    updateBoardingStopsDropdown();
  }

  function updateBoardingStopsDropdown() {
    passStopSelect.innerHTML = '';
    const selBusNo = passBusSelect.value;
    const bus = transportData.buses.find(b => b.busNumber === selBusNo);
    if (bus && bus.stops) {
      bus.stops.forEach(st => {
        const opt = document.createElement('option');
        opt.value = st.name;
        opt.textContent = `${st.name} (${st.time})`;
        passStopSelect.appendChild(opt);
      });
    }
  }

  // --- RENDERING ---
  function renderBusesGrid() {
    const query = routeSearchInput.value.trim().toLowerCase();
    const selStatus = statusFilter.value;

    const filtered = transportData.buses.filter(b => {
      const matchesSearch = !query || 
        b.busNumber.toLowerCase().includes(query) || 
        b.routeName.toLowerCase().includes(query) || 
        b.stops.some(s => s.name.toLowerCase().includes(query));
      const matchesStatus = !selStatus || b.currentStatus === selStatus;
      return matchesSearch && matchesStatus;
    });

    routeCountBadge.textContent = `${filtered.length} Buses Active`;
    busesGrid.innerHTML = '';

    if (filtered.length === 0) {
      busesGrid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-muted);">No transit routes match your search filters.</div>`;
      return;
    }

    filtered.forEach(bus => {
      const card = document.createElement('article');
      card.className = 'bus-card';
      const badgeClass = getStatusBadgeClass(bus.currentStatus);
      const stopList = bus.stops.map(s => s.name).join(' → ');

      card.innerHTML = `
        <div>
          <div class="bus-card-header">
            <span class="bus-no-title">${bus.busNumber}</span>
            <span class="badge ${badgeClass}">${bus.currentStatus}</span>
          </div>
          <div class="bus-route-name">${bus.routeName}</div>
          <div class="bus-driver-info">
            Driver: <strong>${bus.driverName}</strong> | 📞 ${bus.driverPhone} | Departs: <strong>${bus.startTime}</strong>
          </div>
          <div class="bus-stops-preview">
            <strong>Route Stops:</strong> ${stopList}
          </div>
        </div>
        <div class="bus-card-footer">
          <span style="font-size:0.8rem; color:var(--text-muted);">Capacity: ${bus.capacity} seats</span>
          <button class="btn btn-primary btn-sm btn-track-live" data-bus="${bus.busNumber}">
            📍 Live Stop Tracker
          </button>
        </div>
      `;
      busesGrid.appendChild(card);
    });
  }

  function renderDefaultPassPreview() {
    if (transportData.passes.length > 0) {
      const p = transportData.passes[0];
      displayPassCard(p);
    }
  }

  function displayPassCard(p) {
    cardStudentName.textContent = p.studentName;
    cardStudentId.textContent = p.studentId;
    cardRoute.textContent = p.route;
    cardStop.textContent = p.boardingStop;
    cardBusNo.textContent = p.busNumber;
    cardExpiry.textContent = p.validUntil;
    cardPassId.textContent = p.passId;

    const todayStr = new Date().toISOString().split('T')[0];
    const isExpired = todayStr > p.validUntil;

    passStatusBadge.textContent = isExpired ? 'EXPIRED' : 'VALID PASS';
    passStatusBadge.className = `badge ${isExpired ? 'badge-danger' : 'badge-success'}`;
  }

  function openTrackerModal(busNumber) {
    const bus = transportData.buses.find(b => b.busNumber === busNumber);
    if (!bus) return;

    trackerBusTitle.textContent = `${bus.busNumber} - Live Route Tracking`;
    trackerBusSub.textContent = `Route: ${bus.routeName} | Driver: ${bus.driverName} (${bus.driverPhone})`;
    trackerStatusCallout.innerHTML = `Current Status: <strong>${bus.currentStatus}</strong> (Departure: ${bus.startTime})`;

    trackerTimeline.innerHTML = '';
    const curIdx = bus.currentStopIndex || 0;

    bus.stops.forEach((st, idx) => {
      const div = document.createElement('div');
      let nodeClass = 'timeline-node';

      if (idx < curIdx) {
        nodeClass += ' passed';
      } else if (idx === curIdx) {
        nodeClass += ' current';
      }

      div.className = nodeClass;
      div.innerHTML = `
        <div>
          <strong>${idx + 1}. ${st.name}</strong>
          ${idx === curIdx ? '<span class="badge badge-info" style="margin-left:0.5rem;">Bus Located Here</span>' : ''}
        </div>
        <div style="font-size:0.85rem; color:var(--text-muted); font-weight:600;">
          ${st.time}
        </div>
      `;
      trackerTimeline.appendChild(div);
    });

    trackerModal.classList.remove('hidden');
  }

  function renderAdminDashboard() {
    // Dynamic KPI stats
    const totalBuses = transportData.buses.length;
    const onRoute = transportData.buses.filter(b => b.currentStatus === 'On Route').length;
    const atCollege = transportData.buses.filter(b => b.currentStatus === 'At College').length;
    const totalPasses = transportData.passes.length;

    kpiTotalBuses.textContent = totalBuses;
    kpiOnRouteBuses.textContent = onRoute;
    kpiAtCollegeBuses.textContent = atCollege;
    kpiTotalPasses.textContent = totalPasses;

    // Fleet Table
    adminBusesTbody.innerHTML = '';
    transportData.buses.forEach(b => {
      const tr = document.createElement('tr');
      const badgeClass = getStatusBadgeClass(b.currentStatus);
      const curStop = b.stops[b.currentStopIndex] ? b.stops[b.currentStopIndex].name : 'Terminal';

      tr.innerHTML = `
        <td><strong>${b.busNumber}</strong></td>
        <td>${b.routeName}</td>
        <td>${b.driverName} (${b.driverPhone})</td>
        <td>${b.startTime}</td>
        <td><strong>${curStop}</strong></td>
        <td><span class="badge ${badgeClass}">${b.currentStatus}</span></td>
        <td>
          <div class="btn-group">
            <button class="btn btn-secondary btn-sm btn-advance-stop" data-bus="${b.busNumber}" title="Simulate bus reaching next stop">
              ▶ Advance Stop
            </button>
            <button class="btn btn-outline btn-sm btn-track-live" data-bus="${b.busNumber}">
              View Route
            </button>
          </div>
        </td>
      `;
      adminBusesTbody.appendChild(tr);
    });

    // Passes Table
    adminPassesTbody.innerHTML = '';
    transportData.passes.forEach(p => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${p.passId}</strong></td>
        <td>${p.studentName} (${p.studentId})</td>
        <td>${p.department || 'CSE'}</td>
        <td>${p.busNumber}</td>
        <td>${p.boardingStop}</td>
        <td>${p.validUntil}</td>
        <td><span class="badge badge-success">${p.status}</span></td>
      `;
      adminPassesTbody.appendChild(tr);
    });
  }

  // --- EVENT LISTENERS ---
  function setupEventListeners() {
    portalRoleSwitch.addEventListener('change', (e) => {
      if (e.target.value === 'student') {
        adminView.classList.add('hidden');
        studentView.classList.remove('hidden');
        renderBusesGrid();
      } else {
        studentView.classList.add('hidden');
        adminView.classList.remove('hidden');
        renderAdminDashboard();
      }
    });

    // Tabs
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        if (btn.dataset.tab === 'tabRoutes') {
          tabRoutes.classList.remove('hidden');
          tabPass.classList.add('hidden');
          renderBusesGrid();
        } else {
          tabRoutes.classList.add('hidden');
          tabPass.classList.remove('hidden');
        }
      });
    });

    routeSearchInput.addEventListener('input', renderBusesGrid);
    statusFilter.addEventListener('change', renderBusesGrid);

    // Dynamic stops on bus select
    passBusSelect.addEventListener('change', updateBoardingStopsDropdown);

    // Pass Generation Form
    passForm.addEventListener('submit', (e) => {
      e.preventDefault();
      document.querySelectorAll('.error-msg').forEach(el => el.textContent = '');

      const sId = passStudentId.value.trim().toUpperCase();
      const sName = passStudentName.value.trim();
      const sDept = passDept.value;
      const sPhone = passPhone.value.trim();
      const busNo = passBusSelect.value;
      const stop = passStopSelect.value;
      const validDate = passValidUntil.value;

      let hasError = false;
      if (!sId || sId.length < 3) {
        document.getElementById('errPassId').textContent = 'Please enter a valid Student ID.';
        hasError = true;
      }
      if (!sName || sName.length < 2) {
        document.getElementById('errPassName').textContent = 'Please enter full student name.';
        hasError = true;
      }
      const phoneRegex = /^[6-9]\d{9}$/;
      if (!phoneRegex.test(sPhone)) {
        document.getElementById('errPassPhone').textContent = 'Please enter a valid 10-digit mobile number.';
        hasError = true;
      }

      // Check if student already holds active pass
      const existing = transportData.passes.find(p => p.studentId === sId && p.status === 'Valid');
      if (existing) {
        document.getElementById('errPassId').textContent = 'Student already holds an active bus pass.';
        hasError = true;
      }

      if (hasError) return;

      const bus = transportData.buses.find(b => b.busNumber === busNo);

      const newPass = {
        passId: `BPASS-${Date.now().toString().slice(-4)}`,
        studentName: sName,
        studentId: sId,
        department: sDept,
        phone: sPhone,
        busNumber: busNo,
        route: bus ? bus.routeName : 'PEC Campus',
        boardingStop: stop,
        issueDate: new Date().toISOString().split('T')[0],
        validUntil: validDate,
        status: 'Valid'
      };

      transportData.passes.unshift(newPass);
      saveData();
      displayPassCard(newPass);
      renderAdminDashboard();
      showToast(`Digital Bus Pass generated for ${sName}!`, 'success');
    });

    // Delegate Live Tracker Modal Trigger
    document.addEventListener('click', (e) => {
      const trackBtn = e.target.closest('.btn-track-live');
      if (trackBtn) {
        openTrackerModal(trackBtn.dataset.bus);
      }
    });

    // Advance Bus Stop in Admin
    adminBusesTbody.addEventListener('click', (e) => {
      const advBtn = e.target.closest('.btn-advance-stop');
      if (advBtn) {
        const busNo = advBtn.dataset.bus;
        const bus = transportData.buses.find(b => b.busNumber === busNo);
        if (bus) {
          const nextIdx = (bus.currentStopIndex || 0) + 1;
          if (nextIdx < bus.stops.length) {
            bus.currentStopIndex = nextIdx;
            if (nextIdx === bus.stops.length - 1) {
              bus.currentStatus = 'At College';
            } else {
              bus.currentStatus = 'On Route';
            }
            showToast(`${bus.busNumber} arrived at ${bus.stops[nextIdx].name}!`, 'info');
          } else {
            bus.currentStopIndex = bus.stops.length - 1;
            bus.currentStatus = 'Completed';
            showToast(`${bus.busNumber} finished its route for today.`, 'info');
          }
          saveData();
          renderAdminDashboard();
          renderBusesGrid();
        }
      }
    });

    // Add Bus
    btnAddBus.addEventListener('click', () => {
      busForm.reset();
      busModal.classList.remove('hidden');
    });

    busForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const busNo = document.getElementById('formBusNo').value.trim().toUpperCase();
      const routeName = document.getElementById('formRouteName').value.trim();
      const driver = document.getElementById('formDriver').value.trim();
      const phone = document.getElementById('formPhone').value.trim();
      const time = document.getElementById('formStartTime').value.trim();
      const cap = parseInt(document.getElementById('formCapacity').value, 10);
      const stopsRaw = document.getElementById('formStopsText').value.split(',');

      const stops = stopsRaw.map((s, idx) => ({
        name: s.trim(),
        time: time
      })).filter(s => s.name.length > 0);

      const newBus = {
        busNumber: busNo,
        routeId: `R-0${transportData.buses.length + 1}`,
        routeName,
        driverName: driver || 'Staff Driver',
        driverPhone: phone || '9840110000',
        capacity: cap || 55,
        startTime: time,
        currentStatus: 'Not Started',
        currentStopIndex: 0,
        stops
      };

      transportData.buses.push(newBus);
      saveData();
      busModal.classList.add('hidden');
      populateBusDropdowns();
      renderBusesGrid();
      renderAdminDashboard();
      showToast(`Bus ${busNo} added to fleet roster.`, 'success');
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
      if (confirm('Reset transportation fleet and pass records to initial state?')) {
        localStorage.removeItem(STORAGE_KEY);
        await loadInitialData();
        populateBusDropdowns();
        renderBusesGrid();
        renderDefaultPassPreview();
        renderAdminDashboard();
        showToast('Transport fleet records restored to academic default.', 'success');
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
