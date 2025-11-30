import React from 'react';

function CategoriesPage({ view = 'index', categories = [], categoryStats = [], category, error, baseUrl }) {
  const isIndex = view === 'index';
  const isCreate = view === 'create';
  const isEdit = view === 'edit';

  const title = isIndex ? 'Category Management' : isCreate ? 'Create Category' : 'Edit Category';

  if (!baseUrl) {
    baseUrl = '/Dev25Expenies/public';
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full mb-3">
            Categories
          </p>
          <h2 className="text-3xl font-semibold tracking-tight mb-2 text-slate-900">{title}</h2>
          <p className="text-sm text-slate-500 max-w-2xl">
            Organize your spending with vibrant, color-coded categories. Create and edit categories quickly to keep reports clean.
          </p>
        </div>
        {isIndex && (
          <button
            onClick={() => {
              window.location.href = `${baseUrl}/categories/create`;
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium shadow-sm hover:from-indigo-700 hover:to-purple-700"
          >
            <span>+ Add Category</span>
          </button>
        )}
        {(isCreate || isEdit) && (
          <a
            href={`${baseUrl}/categories`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-slate-200 text-sm text-slate-700 hover:bg-slate-50"
          >
            Back to Categories
          </a>
        )}
      </header>

      {error && (
        <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {error}
        </div>
      )}

      {isIndex && (
        <>
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col justify-between hover:shadow-md transition-shadow"
                style={{ borderLeftWidth: 6, borderLeftColor: cat.color || '#6366f1' }}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-semibold text-slate-900 text-lg">{cat.name}</h3>
                    <span
                      className="inline-flex h-3 w-3 rounded-full"
                      style={{ backgroundColor: cat.color || '#6366f1' }}
                    />
                  </div>
                  {cat.description && (
                    <p className="text-xs text-slate-500 leading-relaxed">{cat.description}</p>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-end gap-2 mt-5">
                  <a
                    href={`${baseUrl}/categories/${cat.id}/edit`}
                    className="text-xs px-3 py-2 rounded-md border border-slate-200 text-slate-700 hover:bg-indigo-50"
                  >
                    Edit
                  </a>
                  <button
                    className="text-xs px-3 py-2 rounded-md border border-rose-200 text-rose-600 hover:bg-rose-50"
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this category?')) {
                        const form = document.createElement('form');
                        form.method = 'POST';
                        form.action = `${baseUrl}/categories/${cat.id}/delete`;
                        document.body.appendChild(form);
                        form.submit();
                      }
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </section>

          {categoryStats.length > 0 && (
            <section className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <h3 className="text-lg font-semibold text-slate-900">Category Insights</h3>
                <p className="text-xs text-slate-500">
                  Based on total spending and number of transactions.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {categoryStats.map((stat, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5"
                  >
                    <p className="text-xs font-medium text-slate-500 uppercase mb-1 tracking-wide">
                      {stat.name}
                    </p>
                    <p className="text-2xl font-semibold text-slate-900">
                      ${Number(stat.total_amount || 0).toFixed(2)}
                    </p>
                    <p className="text-xs text-slate-500 mt-2">
                      {stat.transaction_count} transactions logged
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {(isCreate || isEdit) && (
        <section className="max-w-2xl">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-5">
            <form
              action={
                isCreate
                  ? `${baseUrl}/categories`
                  : `${baseUrl}/categories/${category?.id}/edit`
              }
              method="POST"
              className="space-y-5"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1 sm:col-span-2">
                  <label className="block text-sm font-medium text-slate-700" htmlFor="name">
                    Category Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    defaultValue={category?.name || ''}
                    className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="block text-sm font-medium text-slate-700" htmlFor="description">
                    Description (optional)
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    defaultValue={category?.description || ''}
                    className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-slate-700" htmlFor="color">
                    Color
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      id="color"
                      name="color"
                      type="color"
                      defaultValue={category?.color || '#6366f1'}
                      className="h-12 w-16 rounded-md border border-slate-200 bg-white"
                    />
                    <span className="text-xs text-slate-500">Choose an accent color for this category</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3 pt-2">
                <a
                  href={`${baseUrl}/categories`}
                  className="inline-flex items-center px-4 py-2 rounded-md border border-slate-200 text-sm text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </a>
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 rounded-md bg-gradient-to-r from-indigo-600 to-purple-600 text-sm font-medium text-white shadow-sm hover:from-indigo-700 hover:to-purple-700"
                >
                  {isCreate ? 'Create Category' : 'Update Category'}
                </button>
              </div>
            </form>
          </div>
        </section>
      )}
    </div>
  );
}

export default CategoriesPage;
