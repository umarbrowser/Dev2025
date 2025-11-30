-- Dev25Expenses Database Schema
-- This file contains the complete database structure for the expense tracking application

-- Create Users table
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create Categories table
-- Stores expense categories with custom colors and descriptions
CREATE TABLE IF NOT EXISTS categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT NULL,
    color VARCHAR(7) DEFAULT '#6366f1',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create Transactions table (for expenses)
-- Stores all expense transactions linked to users and categories
CREATE TABLE IF NOT EXISTS transactions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    category_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create Receipts table
-- Stores receipt information and file attachments for transactions
CREATE TABLE IF NOT EXISTS receipts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    transaction_id INT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    date DATE NOT NULL,
    file_path VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert default categories with descriptions and colors
INSERT INTO categories (name, description, color) VALUES 
    ('Food & Dining', 'Restaurants, groceries, and food-related expenses', '#ef4444'),
    ('Transportation', 'Gas, public transport, car maintenance, and travel costs', '#3b82f6'),
    ('Utilities', 'Electricity, water, gas, internet, and phone bills', '#f59e0b'),
    ('Rent', 'Housing rent, mortgage payments, and property taxes', '#8b5cf6'),
    ('Entertainment', 'Movies, games, subscriptions, and leisure activities', '#10b981'),
    ('Shopping', 'Clothing, electronics, and general shopping', '#f97316'),
    ('Healthcare', 'Medical expenses, insurance, and health-related costs', '#06b6d4'),
    ('Education', 'School fees, books, courses, and educational materials', '#84cc16'),
    ('Travel', 'Vacation expenses, hotels, and travel-related costs', '#ec4899'),
    ('Others', 'Miscellaneous expenses and uncategorized items', '#6b7280');

-- Database Setup Notes:
-- 1. This schema creates a complete expense tracking system
-- 2. Users can create custom categories with colors and descriptions
-- 3. Receipts can be attached to transactions with file uploads
-- 4. All tables include proper foreign key constraints
-- 5. Default categories are provided with attractive colors
-- 6. File uploads are stored in /public/uploads/receipts/ directory
