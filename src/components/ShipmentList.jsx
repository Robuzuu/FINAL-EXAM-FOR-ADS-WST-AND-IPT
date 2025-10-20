import React, { useEffect, useState } from 'react';

export default function ShipmentList({ auth, onSelect, t }) {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/courier/backend/api/shipment_api.php');
        const data = await res.json();
        let list = Array.isArray(data) ? data : [];
        const user = auth?.user;
        if (user && user.role !== 'admin') {
          list = list.filter(s => s.created_by == user.id || s.assigned_to == user.id);
        }
        if (!cancelled) setItems(list);
      } catch (e) {
        if (!cancelled) setError(e?.error || 'Failed to load shipments');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold">{t ? t('ship.list.title') : 'Shipments'}</h3>
        {loading && <span className="text-sm text-gray-500">...</span>}
      </div>
      {error && <div className="text-red-600 text-sm mb-2">{String(error)}</div>}
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {items.map((s) => (
          <li key={s.id} className="py-2 flex items-center justify-between">
            <div>
              <div className="font-medium">{s.tracking_number || `#${s.id}`}</div>
              <div className="text-sm text-gray-700 dark:text-gray-300">{s.origin} → {s.destination}</div>
              {s.status && <div className="text-xs text-gray-700 dark:text-gray-400">Status: {s.status}</div>}
            </div>
            <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100" onClick={() => onSelect && onSelect(s)}>
              {t ? t('ship.list.view') : 'View'}
            </button>
          </li>
        ))}
        {!loading && items.length === 0 && (
          <li className="py-4 text-gray-700 dark:text-gray-400 text-sm">{t ? t('ship.list.empty') : 'No shipments yet.'}</li>
        )}
      </ul>
    </div>
  );
}
