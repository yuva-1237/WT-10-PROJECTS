-- Database Schema for College Canteen Pre-Order System
-- SQLite3 compatible DDL

CREATE TABLE IF NOT EXISTS menu_items (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK(category IN ('Breakfast', 'Meals', 'Snacks', 'Drinks', 'Desserts')),
    price REAL NOT NULL CHECK(price > 0),
    icon TEXT,
    in_stock INTEGER NOT NULL DEFAULT 1,
    description TEXT
);

CREATE TABLE IF NOT EXISTS canteen_orders (
    order_id TEXT PRIMARY KEY,
    student_id TEXT NOT NULL,
    student_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    subtotal REAL NOT NULL,
    tax REAL NOT NULL,
    grand_total REAL NOT NULL,
    total_items INTEGER NOT NULL,
    status TEXT NOT NULL CHECK(status IN ('Placed', 'Preparing', 'Ready', 'Collected', 'Cancelled')) DEFAULT 'Placed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id TEXT NOT NULL,
    item_id TEXT NOT NULL,
    item_name TEXT NOT NULL,
    unit_price REAL NOT NULL,
    quantity INTEGER NOT NULL CHECK(quantity > 0),
    total_price REAL NOT NULL,
    FOREIGN KEY(order_id) REFERENCES canteen_orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY(item_id) REFERENCES menu_items(id)
);
