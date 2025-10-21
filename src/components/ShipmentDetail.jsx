import React, { useState } from 'react';

export default function ShipmentDetail({ auth, shipment, onClose, onSaved, t }) {
  const [status, setStatus] = useState(shipment.status || '');
  const [assignId, setAssignId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const formatDT = (v) => {
    if (!v) return '-';
    const d = new Date(v);
    return isNaN(d) ? String(v) : d.toLocaleString();
  };

  if (!shipment) return null;

  const updateStatus = async () => {
    setLoading(true); setError(null);
    try {
      const res = await fetch('/courier/backend/api/shipment_api.php?action=updateStatus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: shipment.id, status })
      });
      const json = await res.json();
      if (!res.ok || json.error) throw json;
      onSaved && onSaved();
    } catch (e) {
      setError(e?.error || 'Failed to update');
    } finally { setLoading(false); }
  };

  const assign = async () => {
    setLoading(true); setError(null);
    try {
      const url = new URL('/courier/backend/api/shipment_api.php', window.location.origin);
      url.searchParams.set('action', 'assign');
      const res = await fetch(url.toString(), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: shipment.id, driver_id: parseInt(assignId, 10) })
      });
      const json = await res.json();
      if (!res.ok || json.error) throw json;
      onSaved && onSaved();
    } catch (e) {
      setError(e?.error || 'Failed to assign');
    } finally { setLoading(false); }
  };

  const remove = async () => {
    if (!confirm('Delete this shipment?')) return;
    setLoading(true); setError(null);
    try {
      const url = new URL('/courier/backend/api/shipment_api.php', window.location.origin);
      url.searchParams.set('id', shipment.id);
      const res = await fetch(url.toString(), { method: 'DELETE' });
      const json = await res.json();
      if (!res.ok || json.error) throw json;
      onSaved && onSaved();
    } catch (e) {
      setError(e?.error || 'Failed to delete');
    } finally { setLoading(false); }
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-xl text-gray-900 dark:text-gray-100">{t ? t('ship.detail.title') : 'Shipment Detail'}</h3>
        <button className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100" onClick={onClose}>{t ? t('ship.detail.close') : 'Close'}</button>
      </div>
      {error && <div className="text-red-600 text-sm mb-3">{String(error)}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[0.98rem]">
        <div className="text-gray-900 dark:text-gray-100"><span className="font-medium">{t ? t('ship.detail.tracking') : 'Tracking'}:</span> <span className="text-gray-800 dark:text-gray-200">{shipment.tracking_number || `#${shipment.id}`}</span></div>
        <div className="text-gray-900 dark:text-gray-100"><span className="font-medium">{t ? t('ship.detail.createdBy') : 'Created By'}:</span> <span className="text-gray-800 dark:text-gray-200">{shipment.created_by}</span></div>
        <div className="text-gray-900 dark:text-gray-100"><span className="font-medium">Created At:</span> <span className="text-gray-800 dark:text-gray-200">{formatDT(shipment.created_at || shipment.createdAt)}</span></div>
        <div className="text-gray-900 dark:text-gray-100"><span className="font-medium">Last Updated:</span> <span className="text-gray-800 dark:text-gray-200">{formatDT(shipment.updated_at || shipment.updatedAt)}</span></div>
        <div className="text-gray-900 dark:text-gray-100"><span className="font-medium">{t ? t('ship.detail.sender') : 'Sender'}:</span> <span className="text-gray-800 dark:text-gray-200">{shipment.sender_name} ({shipment.sender_phone || '-'})</span></div>
        <div className="text-gray-900 dark:text-gray-100"><span className="font-medium">{t ? t('ship.detail.receiver') : 'Receiver'}:</span> <span className="text-gray-800 dark:text-gray-200">{shipment.receiver_name} ({shipment.receiver_phone || '-'})</span></div>
        <div className="text-gray-900 dark:text-gray-100"><span className="font-medium">{t ? t('ship.detail.route') : 'Route'}:</span> <span className="text-gray-800 dark:text-gray-200">{shipment.origin} → {shipment.destination}</span></div>
        <div className="text-gray-900 dark:text-gray-100"><span className="font-medium">{t ? t('ship.detail.weight') : 'Weight'}:</span> <span className="text-gray-800 dark:text-gray-200">{shipment.weight ?? 0} kg</span></div>
        <div className="md:col-span-2 text-gray-900 dark:text-gray-100"><span className="font-medium">{t ? t('ship.detail.description') : 'Description'}:</span> <span className="text-gray-800 dark:text-gray-200">{shipment.description || '-'}</span></div>
        <div className="md:col-span-2 text-gray-900 dark:text-gray-100"><span className="font-medium">{t ? t('ship.detail.status') : 'Status'}:</span> <span className="text-gray-800 dark:text-gray-200">{shipment.status || shipment.status_id}</span></div>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="card">
          <div className="font-medium mb-2 text-gray-900 dark:text-gray-100">{t ? t('ship.detail.updateStatus') : 'Update Status'}</div>
          <input className="border border-gray-300 dark:border-gray-600 p-3 w-full rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" value={status} onChange={e => setStatus(e.target.value)} placeholder="e.g. In Transit or 2" />
          <button disabled={loading} onClick={updateStatus} className="mt-3 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100">{t ? t('ship.detail.save') : 'Save'}</button>
        </div>
        <div className="card">
          <div className="font-medium mb-2 text-gray-900 dark:text-gray-100">{t ? t('ship.detail.assignDriver') : 'Assign Driver'}</div>
          <input className="border border-gray-300 dark:border-gray-600 p-3 w-full rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" value={assignId} onChange={e => setAssignId(e.target.value)} placeholder="Driver ID" />
          <button disabled={loading} onClick={assign} className="mt-3 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100">{t ? t('ship.detail.assign') : 'Assign'}</button>
        </div>
      </div>

      <div className="mt-4">
        <button disabled={loading} onClick={remove} className="px-4 py-2 border rounded text-red-700 border-red-300 hover:bg-red-50 dark:hover:bg-red-900/20">{t ? t('ship.detail.delete') : 'Delete Shipment'}</button>
      </div>
    </div>
  );
}
