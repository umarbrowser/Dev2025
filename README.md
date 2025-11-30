# Dev25Expenses 💰

Dev25Expenses is a refreshed expense management platform that blends a modern React + Tailwind UI with the original PHP/MySQL backend. Track spending, manage categories, and review insights in a single cohesive workflow.

## ✨ Highlights

- 🔐 **Session-Based Authentication** – PHP backend handles registration, login, and session security.
- ➕ **Expense Management Made Easy** – Add, edit, delete, and filter expenses without leaving the dashboard.
- 📊 **Category Intelligence** – See which categories drive your spending with ranked breakdowns.
- 📈 **Actionable Insights** – Live totals for all-time, month-to-date, and average transactions, plus recent activity feeds.
- 📁 **CSV Import & Export** – Move data in bulk and keep external backups in sync.
- 📱 **Responsive UI** – Tailwind-powered layout adapts gracefully from mobile to large desktops.
- 🎨 **Polished Experience** – Gradient hero treatments, interactive cards, and thoughtful micro-interactions.

## 🏛 Architecture at a Glance

```
PHP (Controllers, Models)  →  View::render(page, props)
                                  ↓
                      React + Vite frontend bundle
                                  ↓
                         Tailwind-styled pages
```

The PHP controllers authenticate users, collect data from MySQL, and pass props into a single React entry point. React pages (built with Vite) render the dashboard, expenses, categories, receipts, and auth flows.

## 🚀 Quick Start

### Prerequisites
- PHP 8+ with MySQL (XAMPP/LAMP/MAMP all work)
- Node.js 18+ and npm

### 1. Install frontend dependencies
```bash
npm install
```

### 2. Run the Vite dev server (React hot reload)
```bash
npm run dev
```
Visit the URL printed in the terminal (defaults to http://localhost:5173). During development, make sure your PHP server also serves `/public` so API routes and sessions continue working.

### 3. Build production assets
```bash
npm run build
```
The compiled bundle is emitted to `public/assets/dist/` and automatically loaded by the PHP layout.

### 4. Serve the PHP application
- Configure Apache/Nginx (or start XAMPP) to point to `/public`.
- Import the database schema under `database/` into MySQL.

## 📁 Project Structure

```
src/
├── app/
│   ├── Controllers/        # PHP controllers (Home, Expense, Category, Receipt, Auth)
│   ├── Classes/            # Shared PHP classes (Expense logic, View helper)
│   └── Views/              # Layout shell mounting the React app
├── frontend/
│   ├── App.jsx             # Shell with sidebar navigation & routing
│   ├── main.jsx            # React bootstrap reading props from PHP
│   ├── pages/              # Dashboard, Expenses, Categories, Receipts, Auth
│   └── index.css           # Tailwind entrypoint
public/
└── assets/dist/            # Vite build output consumed by PHP layout
```

## 🔧 Technology Stack
- **Frontend:** React 18, Vite 5, Tailwind CSS 3, SWC React plugin
- **Backend:** PHP 8, MySQL/MariaDB, native sessions
- **Tooling:** npm scripts for dev/build, PostCSS + Autoprefixer, Apache/Nginx for serving PHP

## 🎯 How to Use
1. **Register or Log In** – Secure authentication is handled by the PHP backend.
2. **Record Expenses** – Use the React forms to capture amount, category, and date.
3. **Filter & Search** – Narrow results by date or category to surface specific spending.
4. **Review Insights** – Check the dashboard cards for totals, averages, and recent history.
5. **Manage Categories & Receipts** – Create or edit supporting data right from the sidebar.
6. **CSV Import/Export** – Sync data with spreadsheets or other systems as needed.

## 📝 CSV Template

```
Date,Category,Description,Amount
2024-02-01,Food,"Lunch at noodle bar",18.50
2024-02-02,Transport,"Bus pass",9.75
```

Ensure categories in the CSV already exist in the system to avoid import errors.




## 👥 Original Team
Esther · Anas · Manga


