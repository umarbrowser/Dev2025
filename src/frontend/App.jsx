import React, { useMemo, useState } from 'react';
import DashboardPage from './pages/DashboardPage.jsx';
import ExpensesPage from './pages/ExpensesPage.jsx';
import CategoriesPage from './pages/CategoriesPage.jsx';
import ReceiptsPage from './pages/ReceiptsPage.jsx';
import AuthPage from './pages/AuthPage.jsx';

function App({ page, initialProps }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const baseUrl = initialProps?.baseUrl ?? '/Dev25Expenies/public';

  const navLinks = useMemo(
    () => [
      { href: `${baseUrl}/`, label: 'Dashboard', key: 'dashboard' },
      { href: `${baseUrl}/expenses`, label: 'Expenses', key: 'expenses' },
      { href: `${baseUrl}/categories`, label: 'Categories', key: 'categories' },
      { href: `${baseUrl}/receipts`, label: 'Receipts', key: 'receipts' }
    ],
    [baseUrl]
  );

  const renderPage = () => {
    switch (page) {
      case 'dashboard':
        return <DashboardPage {...initialProps} />;
      case 'expenses':
        return <ExpensesPage {...initialProps} />;
      case 'categories':
        return <CategoriesPage {...initialProps} />;
      case 'receipts':
        return <ReceiptsPage {...initialProps} />;
      case 'auth':
        return <AuthPage {...initialProps} />;
      default:
        return <div className="p-8">Unknown page: {page}</div>;
    }
  };

  const toggleSidebar = () => setSidebarOpen((open) => !open);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col md:flex-row">
      {page !== 'auth' && (
        <>
          <button
            type="button"
            onClick={toggleSidebar}
            className="md:hidden inline-flex items-center gap-2 px-4 py-3 text-sm font-medium text-slate-700 bg-white shadow-sm border-b border-slate-200"
          >
            <span className="text-lg">☰</span>
            <span>Menu</span>
          </button>

          <aside
            className={`md:static fixed inset-y-0 left-0 z-40 w-72 bg-white border-r border-slate-200 shadow-lg md:shadow-sm flex flex-col transform transition-transform duration-200 ease-in-out md:translate-x-0 ${
              sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <div className="px-6 py-5 border-b border-slate-200">
              <h1 className="text-xl font-semibold tracking-tight">Dev25Expenies</h1>
              <p className="text-sm text-slate-500">Expense manager</p>
            </div>
            <nav className="flex-1 px-4 py-6 space-y-1 text-sm">
              {navLinks.map((link) => (
                <a
                  key={link.key}
                  href={link.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`block px-3 py-2 rounded-lg transition-colors font-medium ${
                    page === link.key
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <div className="px-6 py-4 border-t border-slate-200 text-xs text-slate-400 space-y-3">
              <a
                href={`${baseUrl}/logout`}
                className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
              >
                Logout
              </a>
              <p className="text-[11px] text-slate-400">
                &copy; {new Date().getFullYear()} Dev25Expenies
              </p>
            </div>
          </aside>

          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </>
      )}

      <main className="flex-1 w-full">
        <div className="w-full max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 xl:px-10 lg:py-10">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}

export default App;
