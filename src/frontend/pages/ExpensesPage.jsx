import React, { useMemo, useState, useEffect } from 'react';

function ExpensesPage({
  categories = [],
  expenses = [],
  baseUrl = '/Dev25Expenies/public',
  filters = {},
  error,
  success,
  monthlyTotal = 0,
  categoryTotals = []
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(filters.category_id ?? '');
  const [selectedDate, setSelectedDate] = useState(filters.date ?? '');
  const [flashMessage, setFlashMessage] = useState(error || success || '');
  const [flashVariant, setFlashVariant] = useState(error ? 'error' : success ? 'success' : null);

  useEffect(() => {
    setSelectedCategory(filters.category_id ?? '');
    setSelectedDate(filters.date ?? '');
  }, [filters.category_id, filters.date]);

  useEffect(() => {
    if (error || success) {
      setFlashMessage(error || success);
      setFlashVariant(error ? 'error' : 'success');

      const timeout = setTimeout(() => {
        setFlashMessage('');
        setFlashVariant(null);
      }, 5000);

      return () => clearTimeout(timeout);
    }
  }, [error, success]);

  const modalTarget = useMemo(() => {
    if (!isModalOpen) {
      return null;
    }

    if (editingExpense) {
      return {
        title: 'Edit Expense',
        action: `${baseUrl}/expenses/${editingExpense.id}/update`,
        defaults: {
          amount: editingExpense.amount ?? '',
          category_id: editingExpense.category_id ?? '',
          date: editingExpense.date ?? ''
        }
      };
    }

    return {
      title: 'Add New Expense',
      action: `${baseUrl}/expenses`,
      defaults: {
        amount: '',
        category_id: categories.length > 0 ? categories[0].id : '',
        date: new Date().toISOString().split('T')[0]
      }
    };
  }, [isModalOpen, editingExpense, baseUrl, categories]);

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingExpense(null);
  };

  const openCreateModal = () => {
    setEditingExpense(null);
    setIsModalOpen(true);
  };

  const openEditModal = (expense) => {
    setEditingExpense(expense);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) {
      return;
    }

    const form = document.createElement('form');
    form.method = 'POST';
    form.action = `${baseUrl}/expenses/${id}/delete`;
    document.body.appendChild(form);
    form.submit();
  };

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (selectedCategory) params.append('category', selectedCategory);
    if (selectedDate) params.append('date', selectedDate);

    const query = params.toString();
    const target = query
      ? `${baseUrl}/expenses?${query}`
      : `${baseUrl}/expenses`;

    window.location.href = target;
  };

  const totalCategorySpend = categoryTotals.reduce((sum, cat) => sum + Number(cat.total || cat.total_amount || 0), 0);

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full mb-3">Spending Overview</p>
          <h2 className="text-3xl font-semibold tracking-tight mb-2 text-slate-900">Expenses</h2>
          <p className="text-sm text-slate-500 max-w-2xl">Manage, filter, and analyze your spending with colorful insights. Tap actions to quickly add, edit, or export expenses.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium shadow-sm hover:from-blue-700 hover:to-indigo-700"
          >
            <span>+ Add Expense</span>
          </button>
          <a
            href={`${baseUrl}/expenses/export`}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-blue-100 text-sm text-blue-700 bg-blue-50/60 hover:bg-blue-100/70"
          >
            Export CSV
          </a>
        </div>
      </header>

      {flashMessage && (
        <div
          className={`rounded-md px-3 py-2 text-sm flex items-center justify-between ${
            flashVariant === 'error'
              ? 'border border-rose-200 bg-rose-50 text-rose-700'
              : 'border border-emerald-200 bg-emerald-50 text-emerald-700'
          }`}
        >
          <span>{flashMessage}</span>
          <button
            onClick={() => {
              setFlashMessage('');
              setFlashVariant(null);
            }}
            className="text-xs font-medium uppercase tracking-wide"
          >
            Close
          </button>
        </div>
      )}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-2xl shadow-lg p-5">
          <p className="text-xs uppercase tracking-wide text-blue-100">Month to date</p>
          <p className="text-3xl font-semibold mt-1">${Number(monthlyTotal || 0).toFixed(2)}</p>
          <p className="text-xs text-blue-100 mt-2">Total spending for the current month.</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <p className="text-xs uppercase tracking-wide text-slate-500">Categories tracked</p>
          <p className="text-3xl font-semibold text-slate-900 mt-1">{categories.length}</p>
          <p className="text-xs text-slate-500 mt-2">Active categories available for expense logging.</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <p className="text-xs uppercase tracking-wide text-slate-500">Top category</p>
          {categoryTotals.length > 0 ? (
            <div className="mt-1">
              <p className="text-lg font-semibold text-slate-900">{categoryTotals[0].name}</p>
              <p className="text-sm text-slate-500">${Number(categoryTotals[0].total).toFixed(2)} spent</p>
            </div>
          ) : (
            <p className="text-sm text-slate-500 mt-1">No data yet.</p>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <p className="text-xs uppercase tracking-wide text-slate-500">Average per expense</p>
          <p className="text-3xl font-semibold text-slate-900 mt-1">
            ${expenses.length ? (expenses.reduce((sum, expense) => sum + Number(expense.amount || 0), 0) / expenses.length).toFixed(2) : '0.00'}
          </p>
          <p className="text-xs text-slate-500 mt-2">Across current filtered list</p>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[2fr,1fr]">
        <div className="flex flex-wrap gap-3 items-center bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
        <select
          value={selectedCategory}
          onChange={(event) => setSelectedCategory(event.target.value)}
          className="border border-slate-200 rounded-md px-3 py-2 text-sm bg-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 flex-1 min-w-[180px]"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={selectedDate}
          onChange={(event) => setSelectedDate(event.target.value)}
          className="border border-slate-200 rounded-md px-3 py-2 text-sm bg-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />

        <button
          onClick={applyFilters}
          className="inline-flex items-center px-3 py-2 rounded-md border border-blue-100 text-sm text-blue-700 bg-blue-50/60 hover:bg-blue-100/70"
        >
          Apply Filters
        </button>

        <a
          href={`${baseUrl}/expenses`}
          className="inline-flex items-center px-3 py-2 rounded-md border border-slate-200 text-sm text-slate-700 hover:bg-slate-50"
        >
          Clear
        </a>

        <form
          action={`${baseUrl}/expenses/import`}
          method="POST"
          encType="multipart/form-data"
          className="inline-flex items-center gap-2"
        >
          <label className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-slate-200 text-sm text-slate-700 hover:bg-slate-50 cursor-pointer">
            Import CSV
            <input
              type="file"
              name="csv_file"
              accept=".csv"
              className="hidden"
              onChange={(event) => {
                if (event.target.files?.length) {
                  event.target.form?.submit();
                }
              }}
            />
          </label>
        </form>

        </div>

        <aside className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">Category breakdown</p>
            <p className="text-sm text-slate-500">Hover to see where your money goes.</p>
          </div>
          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {categoryTotals.length > 0 ? (
              categoryTotals.slice(0, 6).map((cat, idx) => {
                const value = Number(cat.total || cat.total_amount || 0);
                const percentage = totalCategorySpend ? Math.round((value / totalCategorySpend) * 100) : 0;

                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-medium text-slate-600">
                      <span>{cat.name}</span>
                      <span>${value.toFixed(2)}</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
                        style={{ width: `${percentage}%` }}
                        title={`${percentage}%`}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-slate-500">No breakdown available yet.</p>
            )}
          </div>
        </aside>
      </section>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {expenses.length > 0 ? (
          expenses.map((expense) => (
            <div
              key={expense.id}
              className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex items-start justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <h3 className="font-semibold text-slate-900">
                  {expense.category_name || 'Unknown'}
                </h3>
                <p className="text-xs text-slate-500 mt-1">{expense.date}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-rose-600">
                  ${Number(expense.amount || 0).toFixed(2)}
                </p>
                <div className="flex gap-1 mt-2 justify-end">
                  <button
                    onClick={() => openEditModal(expense)}
                    className="text-xs px-2 py-1 rounded-md border border-slate-200 hover:bg-blue-50 text-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(expense.id)}
                    className="text-xs px-2 py-1 rounded-md border border-rose-200 text-rose-600 hover:bg-rose-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-500">No expenses found.</p>
        )}
      </section>

      {isModalOpen && modalTarget && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center px-4">
          <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{modalTarget.title}</h3>
                <p className="text-xs text-slate-500">
                  {editingExpense
                    ? 'Update the expense details below.'
                    : 'Fill in the details to add a new expense.'}
                </p>
              </div>
              <button
                onClick={closeModal}
                className="text-slate-400 hover:text-slate-600"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <form
              key={editingExpense ? editingExpense.id : 'new'}
              action={modalTarget.action}
              method="POST"
              className="space-y-4"
            >
              <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-700" htmlFor="expense-amount">
                  Amount
                </label>
                <input
                  id="expense-amount"
                  name="amount"
                  type="number"
                  step="0.01"
                  defaultValue={modalTarget.defaults.amount}
                  required
                  className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-700" htmlFor="expense-category">
                  Category
                </label>
                <select
                  id="expense-category"
                  name="category_id"
                  defaultValue={modalTarget.defaults.category_id}
                  required
                  className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="" disabled>
                    Select a category
                  </option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-700" htmlFor="expense-date">
                  Date
                </label>
                <input
                  id="expense-date"
                  name="date"
                  type="date"
                  defaultValue={modalTarget.defaults.date}
                  required
                  className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="inline-flex items-center px-3 py-2 rounded-md border border-slate-200 text-sm text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center px-3 py-2 rounded-md bg-blue-600 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
                >
                  {editingExpense ? 'Update Expense' : 'Save Expense'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ExpensesPage;
