
const API_BASE = '/courier/backend/api';

async function jsonFetch(url, options = {}) {
  const headers = opti
const API_BASE = '/courier/backend/api';

async function jsonFetch(url, options = {}) {
  const headers = options.headers || {};
  if (!headers['Content-Type'] && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }
  const res = await fetch(url, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw data;
  return data;
}

export async function loginApi(email, password) {
  return jsonFetch(`${API_BASE}/user_api.php?action=login`, {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
}

export async function registerApi(name, email, password) {
  return jsonFetch(`${API_BASE}/user_api.php?action=register`, {
    method: 'POST',
    body: JSON.stringify({ name, email, password })
  });
}

export async function listShipments() {
  return jsonFetch(`${API_BASE}/shipment_api.php`, { method: 'GET' });
}

export async function createShipment(payload) {
  return jsonFetch(`${API_BASE}/shipment_api.php?action=create`, {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export async function trackShipment(tracking) {
  const u = new URL(`${API_BASE}/shipment_api.php`, window.location.origin);
  u.searchParams.set('action', 'track');
  u.searchParams.set('tracking', tracking);
  return jsonFetch(u.toString(), { method: 'GET' });
}

export async function updateShipmentStatus(id, status) {
  return jsonFetch(`${API_BASE}/shipment_api.php?action=updateStatus`, {
    method: 'POST',
    body: JSON.stringify({ id, status })
  });
}

export async function assignShipment(id, driver_id) {
  const u = new URL(`${API_BASE}/shipment_api.php`, window.location.origin);
  u.searchParams.set('action', 'assign');
  return jsonFetch(u.toString(), {
    method: 'PUT',
    body: JSON.stringify({ id, driver_id })
  });
}

export async function deleteShipment(id) {
  const u = new URL(`${API_BASE}/shipment_api.php`, window.location.origin);
  u.searchParams.set('id', id);
  return jsonFetch(u.toString(), { method: 'DELETE' });
}
ons.headers || {};
  if (!headers['Content-Type'] && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }
  const res = await fetch(url, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw data;
  return data;
}

export async function loginApi(email, password) {
  return jsonFetch(`${API_BASE}/user_api.php?action=login`, {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
}

export async function registerApi(name, email, password) {
  return jsonFetch(`${API_BASE}/user_api.php?action=register`, {
    method: 'POST',
    body: JSON.stringify({ name, email, password })
  });
}

export async function listShipments() {
  return jsonFetch(`${API_BASE}/shipment_api.php`, { method: 'GET' });
}

export async function createShipment(payload) {
  return jsonFetch(`${API_BASE}/shipment_api.php?action=create`, {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export async function trackShipment(tracking) {
  const u = new URL(`${API_BASE}/shipment_api.php`, window.location.origin);
  u.searchParams.set('action', 'track');
  u.searchParams.set('tracking', tracking);
  return jsonFetch(u.toString(), { method: 'GET' });
}

export async function updateShipmentStatus(id, status) {
  return jsonFetch(`${API_BASE}/shipment_api.php?action=updateStatus`, {
    method: 'POST',
    body: JSON.stringify({ id, status })
  });
}

export async function assignShipment(id, driver_id) {
  const u = new URL(`${API_BASE}/shipment_api.php`, window.location.origin);
  u.searchParams.set('action', 'assign');
  return jsonFetch(u.toString(), {
    method: 'PUT',
    body: JSON.stringify({ id, driver_id })
  });
}

export async function deleteShipment(id) {
  const u = new URL(`${API_BASE}/shipment_api.php`, window.location.origin);
  u.searchParams.set('id', id);
  return jsonFetch(u.toString(), { method: 'DELETE' });
}
