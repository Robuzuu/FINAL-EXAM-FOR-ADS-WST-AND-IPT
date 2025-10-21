
import  { useEffect, useState } from 'react';


export default function AdminPanel({ auth }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [shipSummary, setShipSummary] = useState({ pending: 0, received: 0, cancelled: 0, total: 0 });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await auth.authFetch('/users/list.php', { method: 'GET' });
      setUsers(res.users || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchShipSummary = async () => {
    try {
      const res = await fetch('/courier/backend/api/shipment_api.php');
      const data = await res.json();
      const list = Array.isArray(data) ? data : [];
      let pending = 0, received = 0, cancelled = 0;
      list.forEach(s => {
        const st = String(s.status || s.status_id || '').toLowerCase();
        if (st.includes('cancel')) cancelled++;
        else if (st.includes('receive')) received++;
        else pending++;
      });
      setShipSummary({ pending, received, cancelled, total: list.length });
    } catch (e) {

    }
  };

  useEffect(() => {
    if (auth.user && auth.user.role === 'admin') fetchUsers();
    if (auth.user && auth.user.role === 'admin') fetchShipSummary();
  }, [auth.user]);

  const filtered = users.filter(u => {
    if (!search) return true;
    const q = search.toLowerCase();
    return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || (u.role || '').toLowerCase().includes(q);
  });

  const handleChangeRole = async (id) => {
    const role = prompt('New role (user/admin/driver):');
    if (!role) return;
    
    try {
      await auth.authFetch('/users/list.php', {
        method: 'POST',
        body: JSON.stringify({ action: 'changeRole', id, role })
      });
      fetchUsers();
    } catch (err) {
      alert(err.error || 'Role change failed (backend endpoint not implemented)');
    }
  };

  return (
    <div className="card mt-4">
      <h3 className="text-lg font-semibold">Admin Panel</h3>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <div className="p-3 rounded border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/20">
          <div className="text-xs text-gray-600 dark:text-gray-400">Pending</div>
          <div className="text-xl font-semibold">{shipSummary.pending}</div>
        </div>
        <div className="p-3 rounded border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/20">
          <div className="text-xs text-gray-600 dark:text-gray-400">Received</div>
          <div className="text-xl font-semibold">{shipSummary.received}</div>
        </div>
        <div className="p-3 rounded border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/20">
          <div className="text-xs text-gray-600 dark:text-gray-400">Cancelled</div>
          <div className="text-xl font-semibold">{shipSummary.cancelled}</div>
        </div>
        <div className="p-3 rounded border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/20">
          <div className="text-xs text-gray-600 dark:text-gray-400">Total</div>
          <div className="text-xl font-semibold">{shipSummary.total}</div>
        </div>
      </div>
      <h4 className="text-md font-semibold mt-4">Users</h4>
      <div className="mt-2 flex gap-2">
        <input placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} className="border px-2 py-1 rounded" />
        <button onClick={fetchUsers} className="px-3 py-1 border rounded">Refresh</button> {/* onClick */}
      </div>

      {loading ? (
        <div className="mt-2">Loading users...</div>
      ) : (
        <div className="mt-2 overflow-auto max-h-64">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">ID</th>
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Email</th>
                <th className="p-2 text-left">Role</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="p-2">{u.id}</td>
                  <td className="p-2">{u.name}</td>
                  <td className="p-2">{u.email}</td>
                  <td className="p-2">{u.role}</td>
                  <td className="p-2">
                    <button onDoubleClick={() => alert(`User ${u.name} double-clicked`)} onClick={() => handleChangeRole(u.id)} className="px-2 py-1 border rounded mr-2">Change Role</button>
                    <button onClick={() => alert(JSON.stringify(u, null, 2))} className="px-2 py-1 border rounded">View</button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan="5" className="p-2 text-center text-gray-500">No users</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
