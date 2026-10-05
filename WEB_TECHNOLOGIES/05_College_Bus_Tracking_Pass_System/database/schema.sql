-- Database Schema for College Bus Tracking and Pass System
-- SQLite3 compatible DDL

CREATE TABLE IF NOT EXISTS buses (
    bus_number TEXT PRIMARY KEY,
    route_id TEXT NOT NULL,
    route_name TEXT NOT NULL,
    driver_name TEXT NOT NULL,
    driver_phone TEXT NOT NULL,
    capacity INTEGER NOT NULL DEFAULT 55,
    start_time TEXT NOT NULL,
    current_status TEXT CHECK(current_status IN ('Not Started', 'On Route', 'At College', 'Completed')) DEFAULT 'Not Started'
);

CREATE TABLE IF NOT EXISTS bus_stops (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    bus_number TEXT NOT NULL,
    stop_sequence INTEGER NOT NULL,
    stop_name TEXT NOT NULL,
    scheduled_time TEXT NOT NULL,
    FOREIGN KEY(bus_number) REFERENCES buses(bus_number) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS bus_passes (
    pass_id TEXT PRIMARY KEY,
    student_id TEXT NOT NULL,
    student_name TEXT NOT NULL,
    department TEXT NOT NULL,
    phone TEXT NOT NULL,
    bus_number TEXT NOT NULL,
    route TEXT NOT NULL,
    boarding_stop TEXT NOT NULL,
    issue_date DATE NOT NULL,
    valid_until DATE NOT NULL,
    status TEXT CHECK(status IN ('Valid', 'Expired')) DEFAULT 'Valid',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(bus_number) REFERENCES buses(bus_number)
);
