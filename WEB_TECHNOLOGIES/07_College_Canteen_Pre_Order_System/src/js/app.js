/**
 * College Canteen Pre-Order System - Application Logic
 * Prathyusha Annapoorna Food Court - Web Technologies
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'wt_canteen_system_data';

  // State
  let canteenData = {
    canteenName: "Prathyusha Annapoorna Food Court",
    gstRatePercent: 5,
    categories: ["Breakfast", "Meals", "Snacks", "Drinks", "Desserts"],
    orderStatuses: ["Placed", "Preparing", "Ready", "Collected", "Cancelled"],
    menu: [],
    orders: []
  };

  let cart = []; // [ { id, name, price, qty } ]
  let activeCategory = '';

  // DOM Elements
  const portalRoleSwitch = document.getElementById('portalRoleSwitch');
  const studentView = document.getElementById('studentView');
  const canteenView = document.getElementById('canteenView');

  // Tabs
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabMenu = document.getElementById('tabMenu');
  const tabMyOrders = document.getElementById('tabMyOrders');

  // Menu & Filter Elements
  const foodSearchInput = document.getElementById('foodSearchInput');
  const categoryPills = document.getElementById('categoryPills');
  const foodGrid = document.getElementById('foodGrid');

  // Cart Elements
  const cartCountBadge = document.getElementById('cartCountBadge');
  const cartItemsList = document.getElementById('cartItemsList');
  const billSubtotal = document.getElementById('billSubtotal');
  const billTax = document.getElementById('billTax');
  const billGrandTotal = document.getElementById('billGrandTotal');
  const btnProceedCheckout = document.getElementById('btnProceedCheckout');

  // My Orders
  const myOrdersCountBadge = document.getElementById('myOrdersCountBadge');
  const myOrdersTbody = document.getElementById('myOrdersTbody');

  // Canteen Admin Elements
  const kpiTotalOrders = document.getElementById('kpiTotalOrders');
  const kpiPreparingOrders = document.getElementById('kpiPreparingOrders');
  const kpiReadyOrders = document.getElementById('kpiReadyOrders');
  const kpiTotalRevenue = document.getElementById('kpiTotalRevenue');
  const kitchenOrdersTbody = document.getElementById('kitchenOrdersTbody');
  const btnAddMenuItem = document.getElementById('btnAddMenuItem');
  const btnResetData = document.getElementById('btnResetData');

  // Checkout Modal
  const checkoutModal = document.getElementById('checkoutModal');
  const checkoutForm = document.getElementById('checkoutForm');
  const modalCheckoutTotal = document.getElementById('modalCheckoutTotal');
  const modalCheckoutQty = document.getElementById('modalCheckoutQty');
  const custName = document.getElementById('custName');
  const custId = document.getElementById('custId');
  const custPhone = document.getElementById('custPhone');

  // Menu Item Modal
  const menuItemModal = document.getElementById('menuItemModal');
  const menuItemForm = document.getElementById('menuItemForm');

  const toast = document.getElementById('toast');

  // --- INITIALIZATION ---
  async function init() {
    await loadInitialData();
    setupEventListeners();
    renderMenu();
    updateCartUI();
    renderMyOrders();
    renderKitchenDashboard();
  }

  async function loadInitialData() {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      try {
        canteenData = JSON.parse(cached);
        return;
      } catch (e) {
        console.warn('Storage parsing failed.');
      }
    }

    try {
      const res = await fetch('data/initial_data.json');
      if (res.ok) {
        canteenData = await res.json();
        saveData();
      }
    } catch (e) {
      console.warn('Using default seed state.');
    }
  }

  function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(canteenData));
  }

  function getStatusBadgeClass(status) {
    switch (status) {
      case 'Placed': return 'badge-status-placed';
      case 'Preparing': return 'badge-status-preparing';
      case 'Ready': return 'badge-status-ready';
      case 'Collected': return 'badge-status-collected';
      case 'Cancelled': return 'badge-status-cancelled';
      default: return 'badge-info';
    }
  }

  // --- SHOPPING CART & DYNAMIC CALCULATIONS ---
  function computeCartTotals() {
    let subtotal = 0;
    let totalItems = 0;

    cart.forEach(item => {
      subtotal += item.price * item.qty;
      totalItems += item.qty;
    });

    const tax = Math.round((subtotal * canteenData.gstRatePercent) / 100);
    const grandTotal = subtotal + tax;

    return { subtotal, totalItems, tax, grandTotal };
  }

  function updateCartUI() {
    const totals = computeCartTotals();

    cartCountBadge.textContent = `${totals.totalItems} Items`;
    billSubtotal.textContent = `₹${totals.subtotal.toFixed(2)}`;
    billTax.textContent = `₹${totals.tax.toFixed(2)}`;
    billGrandTotal.textContent = `₹${totals.grandTotal.toFixed(2)}`;

    btnProceedCheckout.disabled = cart.length === 0;
    btnProceedCheckout.textContent = cart.length === 0 ? 'Tray is Empty' : `Proceed to Order (₹${totals.grandTotal.toFixed(2)}) →`;

    cartItemsList.innerHTML = '';
    if (cart.length === 0) {
      cartItemsList.innerHTML = `
        <div style="text-align: center; padding: 2rem 1rem; color: var(--text-muted); font-size: 0.85rem;">
          Your food tray is empty.<br>Select items from the menu to pre-order!
        </div>`;
      return;
    }

    cart.forEach(item => {
      const row = document.createElement('div');
      row.className = 'cart-item-row';
      row.innerHTML = `
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">₹${item.price} each &bull; <strong>₹${item.price * item.qty}</strong></div>
        </div>
        <div class="cart-item-controls">
          <button class="qty-btn btn-qty-dec" data-id="${item.id}">-</button>
          <span class="item-qty-num">${item.qty}</span>
          <button class="qty-btn btn-qty-inc" data-id="${item.id}">+</button>
          <button class="del-item-btn" data-id="${item.id}" title="Remove item">&times;</button>
        </div>
      `;
      cartItemsList.appendChild(row);
    });
  }

  function addItemToCart(foodId) {
    const food = canteenData.menu.find(m => m.id === foodId);
    if (!food || !food.inStock) {
      showToast('Item currently out of stock.', 'danger');
      return;
    }

    const existing = cart.find(i => i.id === foodId);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({
        id: food.id,
        name: food.name,
        price: food.price,
        qty: 1
      });
    }

    updateCartUI();
    showToast(`Added ${food.name} to tray!`, 'success');
  }

  // --- RENDERING MENU ---
  function renderMenu() {
    const query = foodSearchInput.value.trim().toLowerCase();

    const filtered = canteenData.menu.filter(food => {
      const matchesSearch = !query || 
        food.name.toLowerCase().includes(query) || 
        food.description.toLowerCase().includes(query);
      const matchesCat = !activeCategory || food.category === activeCategory;
      return matchesSearch && matchesCat;
    });

    foodGrid.innerHTML = '';
    if (filtered.length === 0) {
      foodGrid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-muted);">No delicious menu items found.</div>`;
      return;
    }

    filtered.forEach(food => {
      const card = document.createElement('article');
      card.className = 'food-card';

      card.innerHTML = `
        <div>
          <div class="food-header">
            <span class="food-icon">${food.icon || '🍲'}</span>
            <div>
              <div class="food-title">${food.name}</div>
              <span class="food-category">${food.category}</span>
            </div>
          </div>
          <p class="food-desc">${food.description}</p>
        </div>
        <div class="food-footer">
          <span class="food-price">₹${food.price}</span>
          <button class="btn btn-primary btn-sm btn-add-food" data-id="${food.id}" ${!food.inStock ? 'disabled' : ''}>
            ${food.inStock ? '+ Add to Tray' : 'Out of Stock'}
          </button>
        </div>
      `;
      foodGrid.appendChild(card);
    });
  }

  function renderMyOrders() {
    myOrdersCountBadge.textContent = `${canteenData.orders.length} Orders Placed`;
    myOrdersTbody.innerHTML = '';

    if (canteenData.orders.length === 0) {
      myOrdersTbody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 2rem; color: var(--text-muted);">No active or past canteen orders found.</td></tr>`;
      return;
    }

    canteenData.orders.forEach(order => {
      const tr = document.createElement('tr');
      const badgeClass = getStatusBadgeClass(order.status);
      const itemsList = order.items.map(i => `${i.name} (${i.qty})`).join(', ');

      const timeFormatted = new Date(order.orderTime || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      tr.innerHTML = `
        <td><strong>${order.orderId}</strong></td>
        <td><span class="badge" style="background:#fee2e2; color:#b91c1c; font-size:0.85rem; font-weight:700;">${order.tokenNumber || 'T-01'}</span></td>
        <td><span style="font-size:0.85rem;">${itemsList}</span></td>
        <td><strong>₹${order.grandTotal.toFixed(2)}</strong></td>
        <td>${timeFormatted}</td>
        <td><span class="badge ${badgeClass}">${order.status}</span></td>
      `;
      myOrdersTbody.appendChild(tr);
    });
  }

  function renderKitchenDashboard() {
    // Dynamic KPI calculations
    const total = canteenData.orders.length;
    const preparing = canteenData.orders.filter(o => o.status === 'Preparing').length;
    const ready = canteenData.orders.filter(o => o.status === 'Ready').length;
    let rev = 0;
    canteenData.orders.forEach(o => {
      if (o.status !== 'Cancelled') rev += o.grandTotal;
    });

    kpiTotalOrders.textContent = total;
    kpiPreparingOrders.textContent = preparing;
    kpiReadyOrders.textContent = ready;
    kpiTotalRevenue.textContent = `₹${rev.toFixed(2)}`;

    kitchenOrdersTbody.innerHTML = '';
    if (canteenData.orders.length === 0) {
      kitchenOrdersTbody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 2rem; color: var(--text-muted);">No kitchen orders yet.</td></tr>`;
      return;
    }

    canteenData.orders.forEach(order => {
      const tr = document.createElement('tr');
      const badgeClass = getStatusBadgeClass(order.status);
      const itemsDetail = order.items.map(i => `<div>&bull; ${i.name} &times; <strong>${i.qty}</strong> (₹${i.price * i.qty})</div>`).join('');

      tr.innerHTML = `
        <td><strong>${order.orderId}</strong></td>
        <td><span class="badge badge-primary">${order.tokenNumber || 'T-01'}</span></td>
        <td>
          <div><strong>${order.studentName}</strong></div>
          <div style="font-size:0.775rem; color:var(--text-muted);">${order.phone}</div>
        </td>
        <td><div style="font-size:0.825rem;">${itemsDetail}</div></td>
        <td><strong>₹${order.grandTotal.toFixed(2)}</strong></td>
        <td><span class="badge ${badgeClass}">${order.status}</span></td>
        <td>
          <div class="btn-group">
            ${order.status === 'Placed' ? `
              <button class="btn btn-secondary btn-sm btn-order-status" data-id="${order.orderId}" data-status="Preparing">🍳 Start Cooking</button>
            ` : ''}
            ${order.status === 'Preparing' ? `
              <button class="btn btn-success btn-sm btn-order-status" data-id="${order.orderId}" data-status="Ready">🔔 Mark Ready</button>
            ` : ''}
            ${order.status === 'Ready' ? `
              <button class="btn btn-outline btn-sm btn-order-status" data-id="${order.orderId}" data-status="Collected">✅ Collected</button>
            ` : ''}
            ${order.status !== 'Collected' && order.status !== 'Cancelled' ? `
              <button class="btn btn-danger btn-sm btn-order-status" data-id="${order.orderId}" data-status="Cancelled">✕</button>
            ` : ''}
          </div>
        </td>
      `;
      kitchenOrdersTbody.appendChild(tr);
    });
  }

  // --- EVENT LISTENERS ---
  function setupEventListeners() {
    // Portal switcher
    portalRoleSwitch.addEventListener('change', (e) => {
      if (e.target.value === 'student') {
        canteenView.classList.add('hidden');
        studentView.classList.remove('hidden');
        renderMenu();
        updateCartUI();
        renderMyOrders();
      } else {
        studentView.classList.add('hidden');
        canteenView.classList.remove('hidden');
        renderKitchenDashboard();
      }
    });

    // Student Tabs
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        if (btn.dataset.tab === 'tabMenu') {
          tabMenu.classList.remove('hidden');
          tabMyOrders.classList.add('hidden');
          renderMenu();
        } else {
          tabMenu.classList.add('hidden');
          tabMyOrders.classList.remove('hidden');
          renderMyOrders();
        }
      });
    });

    // Category pills filter
    categoryPills.addEventListener('click', (e) => {
      const pill = e.target.closest('.pill-btn');
      if (pill) {
        document.querySelectorAll('.pill-btn').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        activeCategory = pill.dataset.category;
        renderMenu();
      }
    });

    foodSearchInput.addEventListener('input', renderMenu);

    // Food grid add to cart button
    foodGrid.addEventListener('click', (e) => {
      const addBtn = e.target.closest('.btn-add-food');
      if (addBtn) {
        addItemToCart(addBtn.dataset.id);
      }
    });

    // Cart Steppers & Remove
    cartItemsList.addEventListener('click', (e) => {
      const incBtn = e.target.closest('.btn-qty-inc');
      const decBtn = e.target.closest('.btn-qty-dec');
      const delBtn = e.target.closest('.del-item-btn');

      if (incBtn) {
        const item = cart.find(i => i.id === incBtn.dataset.id);
        if (item) {
          item.qty += 1;
          updateCartUI();
        }
      } else if (decBtn) {
        const item = cart.find(i => i.id === decBtn.dataset.id);
        if (item) {
          item.qty -= 1;
          if (item.qty <= 0) {
            cart = cart.filter(i => i.id !== item.id);
          }
          updateCartUI();
        }
      } else if (delBtn) {
        cart = cart.filter(i => i.id !== delBtn.dataset.id);
        updateCartUI();
        showToast('Item removed from tray.', 'info');
      }
    });

    // Open Checkout Modal
    btnProceedCheckout.addEventListener('click', () => {
      if (cart.length === 0) return;
      const totals = computeCartTotals();
      modalCheckoutTotal.textContent = `₹${totals.grandTotal.toFixed(2)}`;
      modalCheckoutQty.textContent = totals.totalItems;
      document.querySelectorAll('.error-msg').forEach(el => el.textContent = '');
      checkoutModal.classList.remove('hidden');
    });

    // Checkout Form Submit (Place Order)
    checkoutForm.addEventListener('submit', (e) => {
      e.preventDefault();
      document.querySelectorAll('.error-msg').forEach(el => el.textContent = '');

      const name = custName.value.trim();
      const id = custId.value.trim();
      const phone = custPhone.value.trim();

      let hasError = false;
      if (!name || name.length < 2) {
        document.getElementById('errCustName').textContent = 'Please enter your full name.';
        hasError = true;
      }
      const phoneRegex = /^[6-9]\d{9}$/;
      if (!phoneRegex.test(phone)) {
        document.getElementById('errCustPhone').textContent = 'Please enter a valid 10-digit mobile number.';
        hasError = true;
      }

      if (hasError) return;

      const totals = computeCartTotals();
      const orderToken = `T-${Math.floor(10 + Math.random() * 90)}`;
      const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;

      const newOrder = {
        orderId,
        studentName: name,
        studentId: id,
        phone,
        items: [...cart],
        ...totals,
        tokenNumber: orderToken,
        orderTime: new Date().toISOString(),
        status: 'Placed'
      };

      canteenData.orders.unshift(newOrder);
      saveData();

      // Reset cart
      cart = [];
      updateCartUI();
      checkoutModal.classList.add('hidden');
      renderMyOrders();
      renderKitchenDashboard();

      showToast(`Order ${orderId} placed successfully! Token: ${orderToken}`, 'success');

      // Switch to my orders tab to view token
      tabBtns[1].click();
    });

    // Kitchen order status actions
    kitchenOrdersTbody.addEventListener('click', (e) => {
      const statusBtn = e.target.closest('.btn-order-status');
      if (statusBtn) {
        const orderId = statusBtn.dataset.id;
        const newStatus = statusBtn.dataset.status;
        const order = canteenData.orders.find(o => o.orderId === orderId);
        if (order) {
          order.status = newStatus;
          saveData();
          renderKitchenDashboard();
          renderMyOrders();
          showToast(`Order ${orderId} updated to "${newStatus}".`, 'info');
        }
      }
    });

    // Add Menu Item
    btnAddMenuItem.addEventListener('click', () => {
      menuItemForm.reset();
      menuItemModal.classList.remove('hidden');
    });

    menuItemForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('itemName').value.trim();
      const cat = document.getElementById('itemCategory').value;
      const price = parseFloat(document.getElementById('itemPrice').value);
      const icon = document.getElementById('itemIcon').value.trim();
      const stock = document.getElementById('itemStock').value === 'true';
      const desc = document.getElementById('itemDesc').value.trim();

      const newItem = {
        id: `FOOD-0${canteenData.menu.length + 1}`,
        name,
        category: cat,
        price,
        icon: icon || '🍲',
        inStock: stock,
        description: desc
      };

      canteenData.menu.push(newItem);
      saveData();
      menuItemModal.classList.add('hidden');
      renderMenu();
      showToast(`Added ${name} to canteen menu!`, 'success');
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
      if (confirm('Reset canteen food court menu and orders to initial sample state?')) {
        localStorage.removeItem(STORAGE_KEY);
        await loadInitialData();
        cart = [];
        renderMenu();
        updateCartUI();
        renderMyOrders();
        renderKitchenDashboard();
        showToast('Canteen food records restored to academic default.', 'success');
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
