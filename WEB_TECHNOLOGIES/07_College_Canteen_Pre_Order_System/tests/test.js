const assert = require('assert');

// Core Business Logic
function calculateCartTotals(cartItems, gstPercent = 5) {
  let subtotal = 0;
  let totalQuantity = 0;

  cartItems.forEach(item => {
    subtotal += item.price * item.quantity;
    totalQuantity += item.quantity;
  });

  const tax = Math.round((subtotal * gstPercent) / 100);
  const grandTotal = subtotal + tax;

  return {
    subtotal,
    totalQuantity,
    tax,
    grandTotal
  };
}

function addToCart(cart, menuItem) {
  const existing = cart.find(i => i.id === menuItem.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      id: menuItem.id,
      name: menuItem.name,
      price: menuItem.price,
      quantity: 1
    });
  }
  return cart;
}

function updateCartQuantity(cart, itemId, newQty) {
  if (newQty <= 0) {
    return cart.filter(i => i.id !== itemId);
  }
  const item = cart.find(i => i.id === itemId);
  if (item) item.quantity = newQty;
  return cart;
}

function placeOrder(cart, customer) {
  if (!cart || cart.length === 0) {
    return { success: false, error: 'Cannot place order with empty cart.' };
  }
  if (!customer.name || customer.name.trim().length < 2) {
    return { success: false, error: 'Customer name is required.' };
  }
  const phoneRegex = /^[6-9]\d{9}$/;
  if (!phoneRegex.test(customer.phone)) {
    return { success: false, error: 'Valid 10-digit mobile number is required.' };
  }

  const totals = calculateCartTotals(cart);
  const order = {
    orderId: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
    studentName: customer.name,
    studentId: customer.id || 'PEC001',
    phone: customer.phone,
    items: [...cart],
    ...totals,
    status: 'Placed',
    createdAt: new Date().toISOString()
  };

  return { success: true, order };
}

function filterMenu(menu, query, category) {
  return menu.filter(item => {
    const matchesSearch = !query || 
      item.name.toLowerCase().includes(query.toLowerCase()) || 
      item.description.toLowerCase().includes(query.toLowerCase());
    const matchesCat = !category || item.category === category;
    return matchesSearch && matchesCat;
  });
}

// TEST SUITE
console.log('Running Tests for 07 College Canteen Pre-Order System...');
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

// Test Case 1: Dynamic Shopping Cart Total Calculation
runTest('Test Case 1: Dynamic Cart Subtotal, Tax and Grand Total Calculation', () => {
  const cart = [
    { id: '1', name: 'Dosa', price: 50, quantity: 2 }, // 100
    { id: '2', name: 'Coffee', price: 20, quantity: 3 } // 60
  ];
  // Subtotal = 160. Total Qty = 5. Tax (5%) = 8. Grand Total = 168
  const totals = calculateCartTotals(cart, 5);
  assert.strictEqual(totals.subtotal, 160);
  assert.strictEqual(totals.totalQuantity, 5);
  assert.strictEqual(totals.tax, 8);
  assert.strictEqual(totals.grandTotal, 168);
});

// Test Case 2: Cart Item Quantity Changes and Removal
runTest('Test Case 2: Cart Quantity Increment, Decrement and Removal', () => {
  let cart = [];
  const dosa = { id: 'FOOD-1', name: 'Dosa', price: 50 };
  addToCart(cart, dosa);
  assert.strictEqual(cart.length, 1);
  assert.strictEqual(cart[0].quantity, 1);

  addToCart(cart, dosa); // Increment
  assert.strictEqual(cart[0].quantity, 2);

  updateCartQuantity(cart, 'FOOD-1', 1); // Decrement
  assert.strictEqual(cart[0].quantity, 1);

  cart = updateCartQuantity(cart, 'FOOD-1', 0); // Remove on 0
  assert.strictEqual(cart.length, 0);
});

// Test Case 3: Empty Cart Order Prevention
runTest('Test Case 3: Rejection of Order Placement with Empty Cart', () => {
  const customer = { name: 'Yuva', phone: '9840112233' };
  const res = placeOrder([], customer);
  assert.strictEqual(res.success, false);
  assert.strictEqual(res.error, 'Cannot place order with empty cart.');
});

// Test Case 4: Customer Details Form Validation
runTest('Test Case 4: Form Validation for Customer Contact and Name', () => {
  const cart = [{ id: '1', name: 'Tea', price: 15, quantity: 1 }];
  const invalidPhone = { name: 'Yuva', phone: '123' };
  const res1 = placeOrder(cart, invalidPhone);
  assert.strictEqual(res1.success, false);
  assert.strictEqual(res1.error, 'Valid 10-digit mobile number is required.');

  const validCustomer = { name: 'Yuva', phone: '9840112233' };
  const res2 = placeOrder(cart, validCustomer);
  assert.strictEqual(res2.success, true);
  assert.strictEqual(res2.order.status, 'Placed');
  assert.ok(res2.order.orderId.startsWith('ORD-'));
});

// Test Case 5: Menu Category Filtering
runTest('Test Case 5: Menu Category Filtering (Breakfast vs Drinks)', () => {
  const menu = [
    { name: 'Idli', category: 'Breakfast', description: 'Steamed' },
    { name: 'Biryani', category: 'Meals', description: 'Rice' },
    { name: 'Coffee', category: 'Drinks', description: 'Filter' }
  ];
  const breakfastItems = filterMenu(menu, '', 'Breakfast');
  assert.strictEqual(breakfastItems.length, 1);
  assert.strictEqual(breakfastItems[0].name, 'Idli');

  const drinkSearch = filterMenu(menu, 'filter', '');
  assert.strictEqual(drinkSearch.length, 1);
  assert.strictEqual(drinkSearch[0].name, 'Coffee');
});

console.log(`\nResults: ${passed} passed, ${failed} failed.`);
if (failed > 0) process.exit(1);
