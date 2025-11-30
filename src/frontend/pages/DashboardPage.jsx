import React from 'react';

function DashboardPage({ username = 'Guest', totalExpenses = 0, monthlyExpenses = 0, categoriesCount = 0, recentTransactions = [] }) {
  const greeting = `Welcome back, ${username}`;
  return (
    <div className="w-full max-w-6xl mx-auto space-y-10">
      <header className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-6 sm:p-10 shadow-lg">
        <div className="max-w-lg space-y-3">
          <p className="text-xs uppercase tracking-[0.35em] text-white/70">Overview</p>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">{greeting}</h2>
          <p className="text-sm sm:text-base text-white/80">
            Track your spending trends and categories at a glance. Keep building healthier financial habits.
          </p>
        </div>
        <div className="absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" aria-hidden="true" />
        <div className="absolute -left-8 top-6 h-24 w-24 rounded-full bg-white/10 blur-xl" aria-hidden="true" />
      </header>

      <section className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Total Expenses</p>
          <p className="text-3xl font-semibold text-slate-900 mt-2">${totalExpenses.toFixed(2)}</p>
          <p className="text-xs text-slate-400 mt-3">Across all time</p>
        </div>
        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-2xl shadow-lg p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-white/80">This Month</p>
          <p className="text-3xl font-semibold mt-2">${monthlyExpenses.toFixed(2)}</p>
          <p className="text-xs text-white/70 mt-3">Month to date spending</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Categories</p>
          <p className="text-3xl font-semibold text-slate-900 mt-2">{categoriesCount}</p>
          <p className="text-xs text-slate-400 mt-3">Active groups for tracking</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Average Transaction</p>
          <p className="text-3xl font-semibold text-slate-900 mt-2">
            ${recentTransactions.length ? (recentTransactions.reduce((sum, tx) => sum + Number(tx.amount || 0), 0) / recentTransactions.length).toFixed(2) : '0.00'}
          </p>
          <p className="text-xs text-slate-400 mt-3">From latest activity</p>
        </div>
      </section>

      <section className="bg-white border border-slate-200 rounded-2xl shadow-sm">
        <div className="px-5 pt-5 pb-3 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Recent Transactions</h3>
            <p className="text-xs text-slate-500">Your latest five transactions across all categories.</p>
          </div>
          <a
            href="/Dev25Expenies/public/expenses"
            className="inline-flex items-center gap-1 text-xs font-medium uppercase tracking-wide text-blue-600 hover:text-blue-700"
          >
            View all
          </a>
        </div>

        {recentTransactions.length > 0 ? (
          <ul className="divide-y divide-slate-100">
            {recentTransactions.map((tx, index) => (
              <li key={index} className="px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="font-medium text-slate-800">{tx.category_name || 'Unknown'}</p>
                  <p className="text-xs text-slate-500">{tx.date}</p>
                </div>
                <div className="text-right sm:text-left">
                  <p className="text-sm font-semibold text-emerald-600">${Number(tx.amount || 0).toFixed(2)}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="px-5 py-10 text-center text-sm text-slate-500">
            No recent transactions found.
          </div>
        )}
      </section>
    </div>
  );
}

export default DashboardPage;
