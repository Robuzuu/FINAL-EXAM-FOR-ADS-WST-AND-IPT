import { useState, useCallback } from 'react';
import { useFetch } from './useAuth.js';

const API_BASE = '/courier/backend/api';


export function usePayments() {
  const { fetchJson } = useFetch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [payments, setPayments] = useState([]);
  const [summary, setSummary] = useState(null);

  const list = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res = await fetchJson(`${API_BASE}/payments_api.php?action=list`);
      setPayments(Array.isArray(res) ? res : (res.payments || []));
      return res;
    } catch (e) {
      setError(e?.error || 'Failed to load payments');
      throw e;
    } finally {
      setLoading(false);
    }
  }, [fetchJson]);

  const create = useCallback(async (payload) => {
    setLoading(true); setError(null);
    try {
      const res = await fetchJson(`${API_BASE}/payments_api.php?action=create`, {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      
      if (res && res.payment) setPayments(prev => [res.payment, ...prev]);
      return res;
    } catch (e) {
      setError(e?.error || 'Failed to create payment');
      throw e;
    } finally {
      setLoading(false);
    }
  }, [fetchJson]);

  const getSummary = useCallback(async (range = 'today') => {
    setLoading(true); setError(null);
    try {
      const res = await fetchJson(`${API_BASE}/payments_api.php?action=summary&range=${encodeURIComponent(range)}`);
      setSummary(res);
      return res;
    } catch (e) {
      setError(e?.error || 'Failed to load summary');
      throw e;
    } finally {
      setLoading(false);
    }
  }, [fetchJson]);

  return { payments, summary, loading, error, list, create, getSummary };
}
