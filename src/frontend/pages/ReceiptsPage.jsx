import React from 'react';

function ReceiptsPage({ view = 'index', receipts = [], totalReceipts = 0, monthlyTotal = 0, transactions = [], receipt, error, baseUrl }) {
  const isIndex = view === 'index';
  const isCreate = view === 'create';
  const isEdit = view === 'edit';
  const isView = view === 'view';

  if (!baseUrl) {
    baseUrl = '/Dev25Expenies/public';
  }

  const title = isIndex
    ? 'Receipt Management'
    : isCreate
    ? 'Add Receipt'
    : isEdit
    ? 'Edit Receipt'
    : 'Receipt Details';

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-rose-600 bg-rose-50 px-3 py-1 rounded-full mb-3">
            Receipts
          </p>
          <h2 className="text-3xl font-semibold tracking-tight mb-2 text-slate-900">{title}</h2>
          <p className="text-sm text-slate-500 max-w-2xl">
            Keep your supporting documents organized and linked to transactions. Upload files, review details, and stay audit ready.
          </p>
        </div>
        {isIndex && (
          <a
            href={`${baseUrl}/receipts/create`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-gradient-to-r from-rose-600 to-pink-600 text-white text-sm font-medium shadow-sm hover:from-rose-700 hover:to-pink-700"
          >
            + Add Receipt
          </a>
        )}
        {(isCreate || isEdit || isView) && (
          <a
            href={`${baseUrl}/receipts`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-slate-200 text-sm text-slate-700 hover:bg-slate-50"
          >
            Back to Receipts
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
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Total Receipts</p>
              <p className="text-3xl font-semibold text-slate-900 mt-2">{totalReceipts}</p>
              <p className="text-xs text-slate-400 mt-2">All documents added so far</p>
            </div>
            <div className="bg-gradient-to-br from-rose-600 to-pink-600 text-white rounded-2xl shadow-lg p-5">
              <p className="text-xs font-medium uppercase tracking-wide text-white/80">This Month</p>
              <p className="text-3xl font-semibold mt-2">
                ${Number(monthlyTotal || 0).toFixed(2)}
              </p>
              <p className="text-xs text-white/70 mt-2">Receipt value captured in the current month</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Average Receipt</p>
              <p className="text-3xl font-semibold text-slate-900 mt-2">
                ${receipts.length ? (receipts.reduce((sum, r) => sum + Number(r.total_amount || 0), 0) / receipts.length).toFixed(2) : '0.00'}
              </p>
              <p className="text-xs text-slate-400 mt-2">Across visible results</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Documents with files</p>
              <p className="text-3xl font-semibold text-slate-900 mt-2">
                {receipts.filter((r) => !!r.file_path).length}
              </p>
              <p className="text-xs text-slate-400 mt-2">Receipts containing uploads</p>
            </div>
          </section>

          <section className="grid gap-4 lg:grid-cols-[2fr,1fr]">
            <div className="flex flex-col gap-3 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:flex-row sm:flex-wrap sm:items-center">
              <div className="flex flex-col sm:flex-1 min-w-[180px] gap-1">
                <label className="text-xs uppercase font-semibold text-slate-500">From</label>
                <input
                  type="date"
                  id="date-from"
                  className="border border-slate-200 rounded-md px-3 py-2 text-sm bg-white shadow-sm focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>
              <div className="flex flex-col sm:flex-1 min-w-[180px] gap-1">
                <label className="text-xs uppercase font-semibold text-slate-500">To</label>
                <input
                  type="date"
                  id="date-to"
                  className="border border-slate-200 rounded-md px-3 py-2 text-sm bg-white shadow-sm focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>
              <div className="inline-flex gap-2">
                <button
                  className="inline-flex items-center px-4 py-2 rounded-md bg-gradient-to-r from-rose-600 to-pink-600 text-sm font-medium text-white shadow-sm hover:from-rose-700 hover:to-pink-700"
                  onClick={() => {
                    const from = document.getElementById('date-from').value;
                    const to = document.getElementById('date-to').value;
                    let url = `${baseUrl}/receipts?`;
                    if (from) url += `date_from=${from}&`;
                    if (to) url += `date_to=${to}&`;
                    window.location.href = url.endsWith('&') || url.endsWith('?') ? url.slice(0, -1) : url;
                  }}
                >
                  Filter
                </button>
                <a
                  href={`${baseUrl}/receipts`}
                  className="inline-flex items-center px-4 py-2 rounded-md border border-slate-200 text-sm text-slate-700 hover:bg-slate-50"
                >
                  Clear
                </a>
              </div>
            </div>

            <aside className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-2">
              <p className="text-xs uppercase tracking-wide text-slate-500">Tips</p>
              <p className="text-sm text-slate-500">
                Use filters to narrow your documents and keep everything audit ready. Upload PDFs or photos up to 5MB.
              </p>
            </aside>
          </section>

          <section className="space-y-3">
            {receipts.length > 0 ? (
              receipts.map((r) => (
                <div
                  key={r.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between hover:shadow-md transition-shadow"
                >
                  <div>
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="font-semibold text-slate-900">
                        {r.category_name || 'Unknown'}
                      </h3>
                      <span className="text-xs text-slate-500">{r.date}</span>
                    </div>
                    <div className="mt-2 text-sm text-slate-700 space-x-4">
                      <span className="font-medium">
                        Receipt: ${Number(r.total_amount || 0).toFixed(2)}
                      </span>
                      <span className="text-slate-500">
                        Transaction: ${Number(r.transaction_amount || 0).toFixed(2)}
                      </span>
                    </div>
                    {r.file_path && (
                      <div className="mt-2 text-xs text-emerald-600 flex items-center gap-1">
                        <span>Receipt attached</span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-1 items-end">
                    <a
                      href={`${baseUrl}/receipts/${r.id}/view`}
                      className="text-xs px-3 py-2 rounded-md border border-slate-200 text-slate-700 hover:bg-rose-50"
                    >
                      View
                    </a>
                    <a
                      href={`${baseUrl}/receipts/${r.id}/edit`}
                      className="text-xs px-3 py-2 rounded-md border border-amber-200 text-amber-700 hover:bg-amber-50"
                    >
                      Edit
                    </a>
                    <button
                      className="text-xs px-3 py-2 rounded-md border border-rose-200 text-rose-600 hover:bg-rose-50"
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this receipt?')) {
                          const form = document.createElement('form');
                          form.method = 'POST';
                          form.action = `${baseUrl}/receipts/${r.id}/delete`;
                          document.body.appendChild(form);
                          form.submit();
                        }
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-xl border border-dashed border-slate-300 p-10 text-center space-y-3">
                <h3 className="text-lg font-semibold text-slate-900">No Receipts Found</h3>
                <p className="text-sm text-slate-500">
                  Start by adding your first receipt to track your documents.
                </p>
                <a
                  href={`${baseUrl}/receipts/create`}
                  className="inline-flex items-center px-3 py-2 rounded-md bg-blue-600 text-white text-sm font-medium shadow-sm hover:bg-blue-700"
                >
                  Add Receipt
                </a>
              </div>
            )}
          </section>
        </>
      )}

      {(isCreate || isEdit) && (
        <section className="max-w-2xl">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-5">
            <form
              action={
                isCreate
                  ? `${baseUrl}/receipts`
                  : `${baseUrl}/receipts/${receipt?.id}/edit`
              }
              method="POST"
              encType="multipart/form-data"
              className="space-y-5"
            >
              {isCreate && (
                <div className="space-y-1">
                  <label
                    className="block text-sm font-medium text-slate-700"
                    htmlFor="transaction_id"
                  >
                    Related Transaction
                  </label>
                  <select
                    id="transaction_id"
                    name="transaction_id"
                    required
                    className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
                  >
                    <option value="">Select a transaction</option>
                    {transactions.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.category_name || 'Unknown'} - $
                        {Number(t.amount || 0).toFixed(2)} - {t.date}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="space-y-1">
                <label
                  className="block text-sm font-medium text-slate-700"
                  htmlFor="total_amount"
                >
                  Receipt Total Amount
                </label>
                <input
                  id="total_amount"
                  name="total_amount"
                  type="number"
                  step="0.01"
                  required
                  defaultValue={receipt?.total_amount || ''}
                  className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
                <p className="text-xs text-slate-500">
                  Enter the total amount shown on the receipt.
                </p>
              </div>

              <div className="space-y-1">
                <label
                  className="block text-sm font-medium text-slate-700"
                  htmlFor="date"
                >
                  Receipt Date
                </label>
                <input
                  id="date"
                  name="date"
                  type="date"
                  required
                  defaultValue={receipt?.date || ''}
                  className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>

              {receipt?.file_path && isEdit && (
                <div className="space-y-1 text-sm">
                  <span className="text-slate-700 font-medium">Current Receipt File</span>
                  <div className="flex items-center gap-2 mt-1">
                    <a
                      href={receipt.file_path}
                      target="_blank"
                      className="inline-flex items-center px-2 py-1 text-xs rounded-md border border-slate-200 hover:bg-slate-50"
                    >
                      View Current File
                    </a>
                    <span className="text-xs text-slate-500">File is attached</span>
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label
                  className="block text-sm font-medium text-slate-700"
                  htmlFor="receipt_file"
                >
                  {receipt?.file_path && isEdit
                    ? 'Replace Receipt File'
                    : 'Receipt File (optional)'}
                </label>
                <input
                  id="receipt_file"
                  name="receipt_file"
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf,.gif"
                  className="block w-full text-sm text-slate-500"
                />
                <p className="text-xs text-slate-500">
                  Upload a photo or PDF of your receipt. Max size: 5MB.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3 pt-2">
                <a
                  href={`${baseUrl}/receipts`}
                  className="inline-flex items-center px-4 py-2 rounded-md border border-slate-200 text-sm text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </a>
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 rounded-md bg-gradient-to-r from-rose-600 to-pink-600 text-sm font-medium text-white shadow-sm hover:from-rose-700 hover:to-pink-700"
                >
                  {isCreate ? 'Save Receipt' : 'Update Receipt'}
                </button>
              </div>
            </form>
          </div>
        </section>
      )}

      {isView && receipt && (
        <section className="max-w-3xl">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-slate-900">
                  {receipt.category_name || 'Unknown Category'}
                </h3>
                <p className="text-sm text-slate-500 mt-1">{receipt.date}</p>
              </div>
              <div className="flex gap-2">
                <a
                  href={`${baseUrl}/receipts/${receipt.id}/edit`}
                  className="inline-flex items-center px-4 py-2 rounded-md border border-amber-200 text-sm text-amber-700 hover:bg-amber-50"
                >
                  Edit
                </a>
                <a
                  href={`${baseUrl}/receipts`}
                  className="inline-flex items-center px-4 py-2 rounded-md border border-slate-200 text-sm text-slate-700 hover:bg-slate-50"
                >
                  Back
                </a>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <p className="text-xs text-slate-500">Receipt Amount</p>
                <p className="text-lg font-semibold text-slate-900">
                  ${Number(receipt.total_amount || 0).toFixed(2)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-slate-500">Transaction Amount</p>
                <p className="text-lg font-semibold text-slate-900">
                  ${Number(receipt.transaction_amount || 0).toFixed(2)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-slate-500">Transaction Date</p>
                <p className="text-sm text-slate-800">{receipt.transaction_date}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-slate-500">Category</p>
                <p className="text-sm text-slate-800">{receipt.category_name}</p>
              </div>
            </div>

            {receipt.file_path ? (
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-800">Receipt File</p>
                <div className="flex items-center justify-between gap-4">
                  <p className="text-xs text-slate-500">A file is attached to this receipt.</p>
                  <div className="flex gap-2">
                    <a
                      href={receipt.file_path}
                      target="_blank"
                      className="inline-flex items-center px-4 py-2 rounded-md bg-gradient-to-r from-rose-600 to-pink-600 text-xs font-medium text-white hover:from-rose-700 hover:to-pink-700"
                    >
                      View File
                    </a>
                    <a
                      href={receipt.file_path}
                      download
                      className="inline-flex items-center px-4 py-2 rounded-md border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                      Download
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-500">No receipt file attached.</p>
            )}
          </div>
        </section>
      )}
    </div>
  );
}

export default ReceiptsPage;
