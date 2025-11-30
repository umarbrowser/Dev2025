import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { expenseService } from '../services/expenseService';
import ExpenseForm from './ExpenseForm';
import ExpenseList from './ExpenseList';
import './Expenses.css';

export default function Expenses() {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [filter, setFilter] = useState({ category: '', month: '' });

  const loadExpenses = useCallback(() => {
    if (!user) return;
    
    const allExpenses = expenseService.getExpenses(user.id);
    let filtered = allExpenses;

    if (filter.category) {
      filtered = filtered.filter(e => e.category === filter.category);
    }

    if (filter.month) {
      filtered = filtered.filter(e => {
        const expenseMonth = new Date(e.date).toISOString().slice(0, 7);
        return expenseMonth === filter.month;
      });
    }

    setExpenses(filtered.sort((a, b) => new Date(b.date) - new Date(a.date)));
  }, [user, filter]);

  useEffect(() => {
    if (user) {
      loadExpenses();
    }
  }, [user, filter, loadExpenses]);

  const handleAdd = () => {
    setEditingExpense(null);
    setShowForm(true);
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setShowForm(true);
  };

  const handleDelete = (expenseId) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      expenseService.deleteExpense(user.id, expenseId);
      loadExpenses();
    }
  };

  const handleSave = (expenseData) => {
    if (editingExpense) {
      expenseService.updateExpense(user.id, editingExpense.id, expenseData);
    } else {
      expenseService.addExpense(user.id, expenseData);
    }
    setShowForm(false);
    setEditingExpense(null);
    loadExpenses();
  };

  const handleExport = () => {
    const allExpenses = expenseService.getExpenses(user.id);
    const csv = [
      ['Date', 'Category', 'Description', 'Amount'].join(','),
      ...allExpenses.map(e => [
        e.date,
        e.category,
        `"${e.description}"`,
        e.amount
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expenses_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const lines = text.split('\n').filter(line => line.trim());
      const headers = lines[0].split(',');

      const imported = lines.slice(1).map(line => {
        const values = line.split(',');
        return {
          date: values[0]?.trim() || new Date().toISOString().split('T')[0],
          category: values[1]?.trim() || 'Other',
          description: values[2]?.replace(/"/g, '').trim() || '',
          amount: parseFloat(values[3]?.trim() || 0),
        };
      }).filter(e => e.amount > 0);

      imported.forEach(expense => {
        expenseService.addExpense(user.id, expense);
      });

      loadExpenses();
      alert(`Imported ${imported.length} expenses successfully!`);
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const categories = expenseService.getCategories();
  const currentMonth = new Date().toISOString().slice(0, 7);
  const months = [];
  for (let i = 0; i < 12; i++) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    months.push(date.toISOString().slice(0, 7));
  }

  const totalAmount = expenses.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);

  return (
    <div className="expenses-container">
      <div className="expenses-header">
        <h1>My Expenses</h1>
        <div className="header-actions">
          <input
            type="file"
            accept=".csv"
            onChange={handleImport}
            id="import-file"
            style={{ display: 'none' }}
          />
          <label htmlFor="import-file" className="btn-secondary">
            📥 Import CSV
          </label>
          <button onClick={handleExport} className="btn-secondary">
            📤 Export CSV
          </button>
          <button onClick={handleAdd} className="btn-primary">
            + Add Expense
          </button>
        </div>
      </div>

      <div className="filters">
        <select
          value={filter.category}
          onChange={(e) => setFilter({ ...filter, category: e.target.value })}
          className="filter-select"
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <select
          value={filter.month}
          onChange={(e) => setFilter({ ...filter, month: e.target.value })}
          className="filter-select"
        >
          <option value="">All Months</option>
          {months.map(month => (
            <option key={month} value={month}>
              {new Date(month + '-01').toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
            </option>
          ))}
        </select>
        <button
          onClick={() => setFilter({ category: '', month: '' })}
          className="btn-clear"
        >
          Clear Filters
        </button>
      </div>

      <div className="total-amount">
        Total: <span>₦{totalAmount.toFixed(2)}</span>
      </div>

      {showForm && (
        <ExpenseForm
          expense={editingExpense}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditingExpense(null);
          }}
        />
      )}

      <ExpenseList
        expenses={expenses}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}

