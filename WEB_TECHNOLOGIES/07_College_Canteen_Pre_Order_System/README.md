# College Canteen Pre-Order System

## Student Name
Yuvathilagan

## Subject
Web Technologies

## Project Type
Application-Based Academic Project

## Objective
To develop a responsive, full-featured web-based College Canteen Pre-Order System that allows students to browse classified food categories, search menu items, manage an interactive shopping cart with dynamic subtotal and tax computations, place orders, receive pickup tokens, and track real-time kitchen preparation statuses.

## Problem Statement
During short college interval breaks and lunch hours, physical canteen food counters experience severe overcrowding, delayed billing lines, chaotic cash handoffs, and food stock uncertainty, causing students to lose valuable class and study time.

## Proposed Solution
A dual-portal web application featuring:
1. Dynamic food catalog categorized into `Breakfast`, `Meals`, `Snacks`, `Drinks`, and `Desserts`.
2. Interactive client-side shopping cart with real-time quantity steppers (`-`, `+`) and item removal.
3. Automated dynamic bill calculation: `Subtotal = Σ(price × qty)`, `GST Tax = 5%`, and `Grand Total = Subtotal + Tax` without hardcoded totals.
4. Unique Order Number and Pickup Token generator (e.g. `ORD-8821`, `T-14`).
5. Live order workflow tracker showing kitchen statuses: `Placed` → `Preparing` → `Ready` → `Collected` → `Cancelled`.
6. Canteen kitchen board with live revenue metrics and status update controls.

## Technologies Used
- **Frontend Structure**: Semantic HTML5 (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`, `<form>`, `<table>`)
- **Styling**: Vanilla CSS3 (Culinary Warm Coral/Amber Theme, CSS Grid, Flexbox, Sticky Sidebar Shopping Cart, Badges)
- **Programming & DOM**: Vanilla JavaScript (ES6+, Shopping Cart State Management, Math Calculations, Array Filtering, LocalStorage Sync)
- **Local Server**: Node.js HTTP server (`server.js`) on dedicated port 3007
- **Database Architecture**: SQLite3 DDL with Foreign Key Cascades (`database/schema.sql`)

## Features
- **Student Food Order Portal**:
  - Filter menu items by category pills (`All`, `Breakfast`, `Meals`, `Snacks`, `Drinks`, `Desserts`).
  - Search food items by keyword in real time.
  - Add food items to cart with out-of-stock disabling.
  - Interactive shopping cart pane with live item count, quantity steppers, item deletion, subtotal, 5% tax, and grand total.
  - Checkout dialog with client-side name and phone number validation.
  - Order token generation.
  - "My Orders" tab displaying live kitchen preparation status.
- **Canteen Kitchen & Counter Admin**:
  - Live metric cards: Total Orders Today, Orders in Kitchen, Orders Ready for Pickup, and Gross Revenue.
  - Kitchen management table with live order progression buttons (`Start Cooking`, `Mark Ready`, `Mark Collected`, `Cancel`).
  - Add new menu item modal with pricing, category, and stock toggles.

## Web Technologies Concepts Demonstrated
- **Dynamic Shopping Cart State**: Managing an array of cart objects `{ id, name, price, qty }`, updating prices and counts dynamically on every user action.
- **Mathematical Computation & Currency Formatting**: Calculating subtotals, applying percentage taxes (`Math.round((subtotal * 5) / 100)`), and formatting floating-point currencies via `.toFixed(2)`.
- **DOM Event Delegation**: Capturing quantity button clicks inside dynamic cart rows using `e.target.closest('.btn-qty-inc')` and `e.target.closest('.btn-qty-dec')`.
- **Form Handling & Regex Validation**: Validating that checkout orders cannot be placed with an empty cart or invalid phone numbers (`/^[6-9]\d{9}$/`).
- **Data Persistence**: Serializing orders and menu items into `localStorage` with seed JSON fallback.

## Project Structure
```text
07_College_Canteen_Pre_Order_System/
├── README.md
├── package.json
├── server.js
├── index.html
├── src/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── app.js
│   └── assets/
├── data/
│   └── initial_data.json
├── database/
│   ├── schema.sql
│   └── init_db.js
├── screenshots/
│   └── README.md
└── tests/
    └── test.js
```

## Installation
Runs directly with native Node.js without third-party npm packages:
```bash
cd WEB_TECHNOLOGIES/07_College_Canteen_Pre_Order_System
```

## How to Run
### Option 1: Development Server
```bash
npm start
```
Then navigate to:
```text
http://localhost:3007
```

### Option 2: Direct Browser Execution
Open `index.html` directly in any modern web browser.

## Usage
1. **Browse Food**: In the Student Portal, click any category pill (e.g. `Snacks`) or search for an item (e.g. "Dosa").
2. **Add to Cart**: Click `+ Add to Tray` on any food card. Observe the floating shopping cart update with the item, dynamic subtotal, 5% GST, and grand total.
3. **Adjust Quantities**: Use the `+` and `-` buttons in the cart to increment or decrement quantities. Notice the total recalculates instantly.
4. **Place Order**: Click `Proceed to Order`, fill in your name and 10-digit mobile number, and submit.
5. **Track Token**: Your order token is generated and appears under `My Orders` with status `Placed`.
6. **Kitchen Updates**: Switch active portal to **Canteen Staff & Kitchen** and click `🍳 Start Cooking` followed by `🔔 Mark Ready`. Switch back to the Student Portal to see the status update to `Ready`.

## Sample Test Cases
### Test Case 1: Dynamic Bill Calculation
- **Input**: 2 × Masala Dosa (@ ₹50 = ₹100), 1 × Filter Coffee (@ ₹20 = ₹20)
- **Calculation**: Subtotal = `₹120`, GST (5%) = `₹6`, Grand Total = `₹126`, Total Items = `3`
- **Expected Outcome**: Cart displays Subtotal: `₹120.00`, Tax: `₹6.00`, Grand Total: `₹126.00`, Item Count: `3 Items`.

### Test Case 2: Quantity Reduction to Zero
- **Input**: Item with quantity 1 in cart; user clicks `-` button.
- **Expected Outcome**: Item is removed from the cart array, cart count decrements, and total recalculates.

### Test Case 3: Empty Cart Checkout Prevention
- **Input**: User attempts to click `Proceed to Order` with an empty cart.
- **Expected Outcome**: Button is disabled (`disabled` attribute applied), preventing empty submissions.

### Test Case 4: Customer Details Form Validation
- **Input**: Customer phone entered as `12345`
- **Expected Outcome**: Order submission blocked with error: "Please enter a valid 10-digit mobile number."

### Test Case 5: Kitchen Status Progression
- **Input**: Kitchen staff clicks `🍳 Start Cooking` on order `ORD-8801`.
- **Expected Outcome**: Order status transitions to `Preparing`, badge updates to blue, and student order status synchronizes immediately.

## Limitations
- Actual online banking/credit card payment processing is simulated with instant virtual confirmation.
- Thermal receipt printer hardware integration is represented via web print stylesheets.

## Future Enhancements
- Integration of UPI QR payment generation (Google Pay, PhonePe, Paytm).
- Sound alert / chime in the kitchen terminal when new orders are placed.
- Automated daily inventory ingredient stock decrement based on recipe bills of materials.

## Viva Questions
1. **Q: How does the shopping cart dynamically calculate the grand total in JavaScript?**
   *A:* By looping over the `cart` array, multiplying each item's `price` by its `qty`, summing these products to calculate `subtotal`, computing the 5% GST tax `Math.round(subtotal * 0.05)`, and adding the tax to the subtotal: `grandTotal = subtotal + tax`.

2. **Q: How does the application prevent hardcoding of prices and counts?**
   *A:* All prices are defined as numeric properties in the menu dataset, cart quantities are tracked in state, and totals are computed strictly through mathematical reduction algorithms whenever an item is added, incremented, or removed.

3. **Q: What happens when an item's quantity reaches zero in the cart?**
   *A:* The decrement handler detects `newQty <= 0` and executes `Array.prototype.filter()` to remove that item's object from the cart array, followed by a full UI refresh.

4. **Q: How does the sticky cart sidebar function in CSS?**
   *A:* By setting `position: sticky; top: 5rem;` on `.cart-card`, allowing the tray to stay pinned in the viewport while the long food catalog scrolls vertically on desktop screens.

5. **Q: How is the category filter implemented?**
   *A:* Category pills store a `data-category` attribute. When clicked, active styling is updated, `activeCategory` state is set, and `renderMenu()` filters items using `item.category === activeCategory`.

6. **Q: What is the purpose of disabled buttons on out-of-stock items?**
   *A:* Setting `disabled` on items where `inStock === false` prevents students from adding unavailable food to their trays, eliminating kitchen order cancellations.

7. **Q: How are customer phone numbers validated before order placement?**
   *A:* Using the regular expression `/^[6-9]\d{9}$/`, which verifies that the input consists of exactly 10 digits beginning with 6, 7, 8, or 9.

8. **Q: How does localStorage maintain persistence for placed orders?**
   *A:* Orders are prepended to `canteenData.orders` and immediately saved to `localStorage` using `JSON.stringify(canteenData)`, ensuring order tokens persist across page refreshes.
