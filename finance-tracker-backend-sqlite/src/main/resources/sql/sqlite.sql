-- =============================================
-- SQLite SQL Setup for Finance Tracker
-- Includes constraints, relationships, and CRUD
-- =============================================

-- Enable foreign key support
PRAGMA foreign_keys = ON;

-- =============================
-- USERS TABLE (unique emails)
-- =============================
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
);

-- =============================
-- BUDGETS TABLE
-- Tracks budget per user/category/period
-- =============================
CREATE TABLE budgets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    category TEXT NOT NULL,
    budget_amount REAL NOT NULL CHECK (budget_amount >= 0),
    start_date TEXT NOT NULL,
    end_date TEXT NOT NULL,
    -- Constraint: user, category, and start_date combo is unique (one budget per category per user per period)
    UNIQUE (user_id, category, start_date),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =============================
-- SAVINGS TABLE
-- Tracks savings goals per user
-- =============================
CREATE TABLE savings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    goal_name TEXT NOT NULL,
    target_amount REAL NOT NULL CHECK (target_amount > 0),
    current_amount REAL NOT NULL DEFAULT 0 CHECK (current_amount >= 0),
    start_date TEXT NOT NULL,
    end_date TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =============================
-- EXPENSE TABLE
-- Records expenses per user
-- =============================
CREATE TABLE expense (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    expense_date TEXT NOT NULL,
    category TEXT NOT NULL,
    amount REAL NOT NULL CHECK (amount >= 0),
    description TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =============================
-- SAMPLE CRUD OPERATIONS
-- (for manual/local SQL testing)
-- =============================

-- Insert user
INSERT INTO users (name, email, password) VALUES ('Alice', 'alice@email.com', 'pass123');

-- Insert budget
INSERT INTO budgets (user_id, category, budget_amount, start_date, end_date)
VALUES (1, 'Food', 25000, '2025-11-01', '2025-11-30');

-- Insert savings
INSERT INTO savings (user_id, goal_name, target_amount, current_amount, start_date, end_date)
VALUES (1, 'Vacation', 100000, 12000, '2025-01-01', '2025-12-31');

-- Insert expense
INSERT INTO expense (user_id, expense_date, category, amount, description)
VALUES (1, '2025-11-02', 'Food', 1300, 'Lunch with friends');

-- Select user expenses
SELECT * FROM expense WHERE user_id = 1 ORDER BY expense_date DESC;

-- Update budget amount
UPDATE budgets SET budget_amount = 30000 WHERE id = 1;

-- Update savings progress
UPDATE savings SET current_amount = 15000 WHERE id = 1;

-- Delete expense
DELETE FROM expense WHERE id = 1;

-- Delete user (cascades to all their budgets/savings/expenses)
DELETE FROM users WHERE id = 1;
