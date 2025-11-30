import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { expenseService } from '../services/expenseService';
import './Stats.css';

export default function Stats() {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));

  const loadExpenses = useCallback(() => {
    if (!user) return;
    
    const allExpenses = expenseService.getExpenses(user.id);
    const filtered = allExpenses.filter(e => {
      const expenseMonth = new Date(e.date).toISOString().slice(0, 7);
      return expenseMonth === selectedMonth;
    });
    setExpenses(filtered);
  }, [user, selectedMonth]);

  useEffect(() => {
    if (user) {
      loadExpenses();
    }
  }, [user, selectedMonth, loadExpenses]);

  const categories = expenseService.getCategories();
  const categoryTotals = categories.map(category => {
    const total = expenses
      .filter(e => e.category === category)
      .reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);
    return { category, total };
  }).filter(item => item.total > 0);

  const totalAmount = expenses.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);
  const maxCategory = categoryTotals.reduce((max, item) => 
    item.total > max.total ? item : max, 
    { category: 'None', total: 0 }
  );

  const months = [];
  for (let i = 0; i < 12; i++) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    months.push(date.toISOString().slice(0, 7));
  }

  return (
    <div className="stats-container">
      <h1>Statistics</h1>
      
      <div className="month-selector">
        <label htmlFor="month-select">Select Month:</label>
        <select
          id="month-select"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="month-select"
        >
          {months.map(month => (
            <option key={month} value={month}>
              {new Date(month + '-01').toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
            </option>
          ))}
        </select>
      </div>

      <div className="stats-grid">
        <div className="stat-card total-card">
          <h2>Total Expenses</h2>
          <p className="stat-value">₦{totalAmount.toFixed(2)}</p>
          <p className="stat-label">{expenses.length} transactions</p>
        </div>

        <div className="stat-card top-category-card">
          <h2>Top Category</h2>
          <p className="stat-value">{maxCategory.category}</p>
          <p className="stat-label">₦{maxCategory.total.toFixed(2)}</p>
        </div>
      </div>

      <div className="category-breakdown">
        <h2>Category Breakdown</h2>
        {categoryTotals.length === 0 ? (
          <p className="no-data">No expenses for this month</p>
        ) : (
          <div className="category-list">
            {categoryTotals
              .sort((a, b) => b.total - a.total)
              .map(({ category, total }) => {
                const percentage = (total / totalAmount) * 100;
                return (
                  <div key={category} className="category-item">
                    <div className="category-header">
                      <span className="category-name">{category}</span>
                      <span className="category-amount">₦{total.toFixed(2)}</span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="category-percentage">{percentage.toFixed(1)}%</div>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}

