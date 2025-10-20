import React from 'react';
import useAuth from '../hooks/useAuth.js';
import ShipmentForm from '../components/ShipmentForm.jsx';

export default function CreateShipmentPage({ t }) {
  const auth = useAuth();
  const [refreshKey, setRefreshKey] = React.useState(0);

  return (
    <div className="max-w-3xl mx-auto p-6 text-gray-900 dark:text-gray-100">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">{t ? t('ship.form.title') : 'Create Shipment'}</h1>
        <p className="text-sm text-gray-700 dark:text-gray-300">Fill out the form to create a new shipment.</p>
      </header>

      <div className="card">
        <ShipmentForm key={refreshKey} auth={auth} onCreated={() => setRefreshKey(k => k + 1)} t={t} />
      </div>
    </div>
  );
}

