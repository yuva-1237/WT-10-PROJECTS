-- Database Schema for College Event Registration System
-- SQLite3 compatible DDL

CREATE TABLE IF NOT EXISTS events (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    event_date DATE NOT NULL,
    time TEXT NOT NULL,
    venue TEXT NOT NULL,
    category TEXT NOT NULL CHECK(category IN ('Technical', 'Cultural', 'Sports', 'Workshop', 'Seminar')),
    maximum_participants INTEGER NOT NULL CHECK(maximum_participants > 0),
    registration_deadline DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS event_registrations (
    reg_id TEXT PRIMARY KEY,
    event_id TEXT NOT NULL,
    student_id TEXT NOT NULL,
    student_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    department TEXT NOT NULL,
    status TEXT NOT NULL CHECK(status IN ('Confirmed', 'Cancelled')) DEFAULT 'Confirmed',
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(event_id) REFERENCES events(id) ON DELETE CASCADE,
    UNIQUE(event_id, student_id)
);
