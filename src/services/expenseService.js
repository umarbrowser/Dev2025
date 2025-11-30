// Expense service using localStorage
export const expenseService = {
  getExpenses(userId) {
    const expensesStr = localStorage.getItem(`expenses_${userId}`);
    return expensesStr ? JSON.parse(expensesStr) : [];
  },

  addExpense(userId, expense) {
    const expenses = this.getExpenses(userId);
    const newExpense = {
      id: Date.now().toString(),
      ...expense,
      date: expense.date || new Date().toISOString().split('T')[0],
    };
    expenses.push(newExpense);
    localStorage.setItem(`expenses_${userId}`, JSON.stringify(expenses));
    return newExpense;
  },

  updateExpense(userId, expenseId, updatedExpense) {
    const expenses = this.getExpenses(userId);
    const index = expenses.findIndex(e => e.id === expenseId);
    if (index !== -1) {
      expenses[index] = { ...expenses[index], ...updatedExpense };
      localStorage.setItem(`expenses_${userId}`, JSON.stringify(expenses));
      return expenses[index];
    }
    return null;
  },

  deleteExpense(userId, expenseId) {
    const expenses = this.getExpenses(userId);
    const filtered = expenses.filter(e => e.id !== expenseId);
    localStorage.setItem(`expenses_${userId}`, JSON.stringify(filtered));
    return true;
  },

  getCategories() {
    return [
      'Food',
      'Transport',
      'Shopping',
      'Bills',
      'Entertainment',
      'Health',
      'Education',
      'Other',
    ];
  },
};


