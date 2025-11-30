import './ExpenseList.css';

export default function ExpenseList({ expenses, onEdit, onDelete }) {
  if (expenses.length === 0) {
    return (
      <div className="empty-state">
        <p>No expenses found. Add your first expense to get started!</p>
      </div>
    );
  }

  return (
    <div className="expense-list">
      {expenses.map(expense => (
        <div key={expense.id} className="expense-item">
          <div className="expense-info">
            <div className="expense-date">
              {new Date(expense.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </div>
            <div className="expense-details">
              <h3>{expense.description}</h3>
              <span className="expense-category">{expense.category}</span>
            </div>
          </div>
          <div className="expense-amount">
            ₦{parseFloat(expense.amount).toFixed(2)}
          </div>
          <div className="expense-actions">
            <button
              onClick={() => onEdit(expense)}
              className="btn-edit"
              title="Edit"
            >
              ✏️
            </button>
            <button
              onClick={() => onDelete(expense.id)}
              className="btn-delete"
              title="Delete"
            >
              🗑️
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}


