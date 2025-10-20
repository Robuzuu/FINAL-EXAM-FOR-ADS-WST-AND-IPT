
import { useState } from 'react';
import { useForm } from '../hooks/useAuth';

export default function Login({ auth, onSwitch, onSuccess, t, adminMode = false }) {
  const { values, onChange } = useForm({ email: '', password: '' });
  const [error, setError] = useState(null);

  
  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setError(null);
    try {
      const resp = await auth.login(values.email, values.password);
      const role = resp?.user?.role || auth.user?.role;
      if (adminMode && role !== 'admin') {
      
        if (auth.logout) auth.logout();
        setError(t ? t('auth.login.roleMismatch') : 'You do not have permission to access this area.');
        return;
      }
      if (onSuccess) onSuccess(resp);
    } catch (err) {
      setError(err.error || 'Login failed');
    }
  };

  return (
    <div className="card max-w-md mx-auto mt-6 text-left">
      <h2 className="text-2xl font-semibold mb-2">{adminMode ? (t ? t('auth.login.adminTitle') : 'Admin Login') : (t ? t('auth.login.title') : 'Login')}</h2>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <label className="block text-sm">{t ? t('auth.login.email') : 'Email'}</label>
          <input
            name="email"
            value={values.email}
            onChange={onChange} 
            onFocus={() => console.log('Email input focused')} 
            onBlur={() => console.log('Email input blurred')} 
            className="w-full border rounded px-2 py-1 bg-white dark:bg-gray-800"
            autoComplete="username"
          />
        </div>
        <div className="mb-2">
          <label className="block text-sm">{t ? t('auth.login.password') : 'Password'}</label>
          <input
            name="password"
            type="password"
            value={values.password}
            onChange={onChange}
            onKeyPress={(e) => { if (e.key === 'Enter') { } }}
            className="w-full border rounded px-2 py-1 bg-white dark:bg-gray-800"
            autoComplete="current-password"
          />
        </div>

        <div className="flex gap-2">
          <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded">{t ? t('auth.login.submit') : 'Login'}</button>
          <button type="button" onClick={onSwitch} className="px-3 py-1 border rounded">{t ? t('auth.login.switch') : 'Register'}</button>
        </div>
      </form>
    </div>
  );
}