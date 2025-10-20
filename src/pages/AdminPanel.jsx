import React, { useEffect } from 'react';
import useAuth from '../hooks/useAuth.js';
import { usePayments } from '../hooks/usePayments.js';
import AdminUsers from '../components/AdminPanel.jsx';

export default function AdminPanelPage({ t }) {
  const auth = useAuth();
  const { summary, loading, error, getSummary } = usePayments();

  useEffect(() => {
    getSummary('month').catch(() => {});
  }, [getSummary]);

  if (!auth.user || auth.user.role !== 'admin') {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="card">
          <h2 className="text-xl font-semibold mb-2">{t ? t('nav.admin') : 'Admin Panel'}</h2>
          <p className="text-sm text-gray-700 dark:text-gray-300">Only admins can access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">{t ? t('nav.admin') : 'Admin Panel'}</h1>
        <p className="text-sm text-gray-700 dark:text-gray-300">{auth.user?.email}</p>
      </header>

      <section className="grid md:grid-cols-3 gap-6 items-start">
        <div className="md:col-span-2 space-y-4">
          <AdminUsers auth={auth} />
        </div>
        <aside className="space-y-4">
          <div className="card">
            <h3 className="font-semibold mb-2">Payments (This Month)</h3>
            {loading ? (
              <div className="text-sm text-gray-700 dark:text-gray-300">Loading...</div>
            ) : error ? (
              <div className="text-sm text-red-600">{String(error)}</div>
            ) : (
              <ul className="text-sm space-y-1">
                <li className="flex justify-between"><span>Count</span><span className="font-medium">{summary?.count ?? '—'}</span></li>
                <li className="flex justify-between"><span>Total</span><span className="font-medium">{summary?.total ?? '—'}</span></li>
              </ul>
            )}
          </div>
          <div className="card">
            <h3 className="font-semibold mb-2">Shortcuts</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">Use the Users table to manage roles and view accounts.</p>
          </div>
        </aside>
      </section>
    </div>
  );
}

