# Dev25Expenses 💰

A modern expense tracking application built with React and Vite. This is a React transformation of the original PHP/MySQL expense tracking system.

## ✨ Features

- 🔐 **Secure Authentication** - Register and login with password protection
- ➕ **Easy Expense Management** - Add, edit, and delete expenses effortlessly
- 📊 **Smart Categorization** - Organize expenses by categories (Food, Transport, Shopping, Bills, Entertainment, Health, Education, Other)
- 📈 **Visual Reports** - Monthly and category-based statistics with progress bars
- 📁 **CSV Import/Export** - Bulk import expenses or export your data
- 📱 **Mobile-Friendly** - Responsive design works on all devices
- 🎨 **Modern UI** - Beautiful gradient design with smooth animations

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

3. **Open your browser**
   Navigate to `http://localhost:5173` (or the port shown in terminal)

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── Login.jsx       # Login page
│   ├── Register.jsx   # Registration page
│   ├── Expenses.jsx    # Main expenses list and management
│   ├── ExpenseForm.jsx # Add/Edit expense form
│   ├── ExpenseList.jsx # Expense list display
│   ├── Stats.jsx       # Statistics and reports
│   ├── Navbar.jsx      # Navigation bar
│   └── ProtectedRoute.jsx # Route protection
├── contexts/           # React contexts
│   └── AuthContext.jsx # Authentication context
├── services/          # Business logic services
│   ├── authService.js  # Authentication service
│   └── expenseService.js # Expense management service
├── App.jsx            # Main app component with routing
└── main.jsx           # App entry point
```

## 🔧 Technology Stack

- **React 19** - UI library
- **React Router DOM** - Client-side routing
- **Vite** - Build tool and dev server
- **localStorage** - Data persistence (can be easily swapped with a backend API)

## 💾 Data Storage

Currently, the app uses `localStorage` for data persistence. This means:
- Data is stored in the browser
- Data persists across sessions
- Each user's data is isolated by user ID
- To connect to a backend API, modify the service files in `src/services/`

## 🎯 Usage

1. **Register/Login**: Create an account or login with existing credentials
2. **Add Expenses**: Click "Add Expense" to record a new expense
3. **Filter**: Use category and month filters to find specific expenses
4. **View Statistics**: Navigate to Statistics to see spending breakdowns
5. **Export Data**: Click "Export CSV" to download your expenses
6. **Import Data**: Click "Import CSV" to bulk import expenses

## 📝 CSV Format

The CSV import/export uses the following format:
```csv
Date,Category,Description,Amount
2024-01-15,Food,"Lunch at restaurant",25.50
2024-01-16,Transport,"Uber ride",12.00
```

## 🔒 Security Notes

- Passwords are currently stored in plain text in localStorage (for demo purposes)
- In production, implement proper password hashing and backend authentication
- Consider using environment variables for sensitive configuration

## 📄 License

Apache-2.0

## 👥 Original Team

- **Saifullah**
- **Umar**

---

Built with ❤️ using React and Vite
