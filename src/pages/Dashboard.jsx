import React from 'react';
import useAuth from '../hooks/useAuth.js';
import ShipmentForm from '../components/ShipmentForm.jsx';
import ShipmentList from '../components/ShipmentList.jsx';

export default function Dashboard({ t }) {
  const auth = useAuth();
  const [refreshKey, setRefreshKey] = React.useState(0);

  return (
    <div className="max-w-7xl mx-auto p-6 text-gray-900 dark:text-gray-100">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">{t ? t('nav.dashboard') : 'Dashboard'}</h1>
        <p className="text-sm text-gray-700 dark:text-gray-300">{auth.user?.email}</p>
      </header>

      <section className="grid md:grid-cols-3 gap-6 items-start">
        <div className="md:col-span-2 space-y-4">
          <div className="card">
            <ShipmentForm auth={auth} onCreated={() => setRefreshKey(k => k + 1)} t={t} />
          </div>
          <div className="card">
            <ShipmentList key={refreshKey} auth={auth} onSelect={() => {}} t={t} />
          </div>
        </div>

        <aside className="space-y-4">
          <div className="card">
            <h3 className="font-semibold mb-2">Quick Stats</h3>
            <ul className="text-sm space-y-1">
              <li className="flex justify-between"><span>Total Shipments</span><span className="font-medium">—</span></li>
              <li className="flex justify-between"><span>In Transit</span><span className="font-medium">—</span></li>
              <li className="flex justify-between"><span>Delivered</span><span className="font-medium">—</span></li>
            </ul>
          </div>
          <div className="card">
            <h3 className="font-semibold mb-2">Tips</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">Use the form to create a shipment and see it appear in the list.</p>
          </div>
        </aside>
      </section>
    </div>
  );
}

