# Screenshots & UI Layout Guide - College Canteen Pre-Order System

This directory documents the dining and order fulfillment interfaces:

1. **Student Food Menu & Live Shopping Cart**:
   - Menu directory categorized into: `Breakfast`, `Meals`, `Snacks`, `Drinks`, `Desserts`.
   - Real-time search by food name and dietary tags.
   - Interactive Food Cards featuring food iconography, description, price (₹), and "+ Add to Cart" buttons.
   - Dynamic Floating Shopping Cart Sidebar / Pane:
     - Real-time quantity steppers (`-`, `+`) for each item.
     - Dynamic subtotal, 5% GST tax calculation, and Grand Total computation.
     - Checkout drawer capturing customer name and 10-digit mobile number.

2. **Order Confirmation & Token Display**:
   - Order receipt view showing generated Order Token (e.g. `ORD-8821`), itemized bill, pickup status badge (`Placed` / `Preparing` / `Ready`), and estimated preparation time.

3. **Canteen Kitchen & Counter Admin Screen**:
   - Live Order Kitchen Board organized by status (`Placed` -> `Preparing` -> `Ready` -> `Collected`).
   - Order status progression action buttons.
   - Add/Edit food menu item modal with pricing and stock toggle.
