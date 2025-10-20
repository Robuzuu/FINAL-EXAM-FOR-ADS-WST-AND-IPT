import React, { useState } from 'react';


export default function ShipmentForm({ auth, onCreated, t }) {
  const [form, setForm] = useState({
    sender_name: '',
    sender_phone: '',
    receiver_name: '',
    receiver_phone: '',
    origin: '',
    destination: '',
    weight: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/courier/backend/api/shipment_api.php?action=create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          weight: parseFloat(form.weight || 0) || 0,
          created_by: auth?.user?.id ?? null
        })
      });
      const json = await res.json();
      if (!res.ok || json.error) throw json;
      onCreated && onCreated(json.shipment || json);
      setForm({ sender_name: '', sender_phone: '', receiver_name: '', receiver_phone: '', origin: '', destination: '', weight: '', description: '' });
    } catch (err) {
      setError(err?.error || 'Failed to create');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card mb-4">
      <h3 className="font-semibold text-xl mb-3">{t ? t('ship.form.title') : 'Create Shipment'}</h3>
      {error && <div className="text-red-600 text-sm mb-2">{String(error)}</div>}
      <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input name="sender_name" value={form.sender_name} onChange={onChange} placeholder={t ? t('ship.form.senderName') : 'Sender Name'} className="border p-3 text-[0.98rem] rounded bg-white dark:bg-gray-800" required />
        <input name="sender_phone" value={form.sender_phone} onChange={onChange} placeholder={t ? t('ship.form.senderPhone') : 'Sender Phone'} className="border p-3 text-[0.98rem] rounded bg-white dark:bg-gray-800" />
        <input name="receiver_name" value={form.receiver_name} onChange={onChange} placeholder={t ? t('ship.form.receiverName') : 'Receiver Name'} className="border p-3 text-[0.98rem] rounded bg-white dark:bg-gray-800" required />
        <input name="receiver_phone" value={form.receiver_phone} onChange={onChange} placeholder={t ? t('ship.form.receiverPhone') : 'Receiver Phone'} className="border p-3 text-[0.98rem] rounded bg-white dark:bg-gray-800" />
        <input name="origin" value={form.origin} onChange={onChange} placeholder={t ? t('ship.form.origin') : 'Origin'} className="border p-3 text-[0.98rem] rounded bg-white dark:bg-gray-800" required />
        <input name="destination" value={form.destination} onChange={onChange} placeholder={t ? t('ship.form.destination') : 'Destination'} className="border p-3 text-[0.98rem] rounded bg-white dark:bg-gray-800" required />
        <input name="weight" type="number" step="0.01" value={form.weight} onChange={onChange} placeholder={t ? t('ship.form.weight') : 'Weight (kg)'} className="border p-3 text-[0.98rem] rounded bg-white dark:bg-gray-800" />
        <input name="description" value={form.description} onChange={onChange} placeholder={t ? t('ship.form.description') : 'Description'} className="border p-3 text-[0.98rem] rounded bg-white dark:bg-gray-800 md:col-span-2" />
        <div className="md:col-span-2 mt-1">
          <button disabled={loading} className="w-full md:w-auto px-5 py-2.5 border rounded hover:bg-gray-50 dark:hover:bg-gray-800">
            {loading ? '...' : (t ? t('ship.form.submit') : 'Create')}
          </button>
        </div>
      </form>
    </div>
  );
}
