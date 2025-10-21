
import React, { useState } from 'react';
import { useForm } from '../hooks/useAuth';


export default function Register({ auth, onSwitch, onSuccess, t }) {
  const { values, onChange, reset } = useForm({ name: '', email: '', password: '', confirmPassword: '', role: 'user' });
  const [msg, setMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setMsg(null);

    const pwd = values.password || '';
    const confirm = values.confirmPassword || '';
    const hasMin = pwd.length >= 8;
    const hasSpecial = /[^A-Za-z0-9]/.test(pwd);
    if (!hasMin || !hasSpecial) {
      alert('Password must be at least 8 characters and include a special character.');
      return;
    }
    if (pwd !== confirm) {
      alert('Passwords do not match.');
      return;
    }
    try {
      const resp = await auth.register(values.name, values.email, values.password, values.role);
      setMsg('Registered successfully');
      reset({ name: '', email: '', password: '', confirmPassword: '', role: 'user' });
      if (onSuccess) onSuccess(resp);
    } catch (err) {
      setMsg(err.error || 'Registration failed');
    }
  };

  return (
    <div className="card max-w-md mx-auto mt-6 text-left">
      <h2 className="text-2xl font-semibold mb-2">{t ? t('auth.register.title') : 'Register'}</h2>
      {msg && <div className="text-red-600 mb-2">{msg}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <label className="block text-sm">{t ? t('auth.register.name') : 'Name'}</label>
          <input name="name" value={values.name} onChange={onChange} className="w-full border rounded px-2 py-1 bg-white dark:bg-gray-800" />
        </div>
        <div className="mb-2">
          <label className="block text-sm">{t ? t('auth.register.email') : 'Email'}</label>
          <input name="email" value={values.email} onChange={onChange} className="w-full border rounded px-2 py-1 bg-white dark:bg-gray-800" />
        </div>
        <div className="mb-2">
          <label className="block text-sm">{t ? t('auth.register.password') : 'Password'}</label>
          <input name="password" type="password" value={values.password} onChange={onChange} className="w-full border rounded px-2 py-1 bg-white dark:bg-gray-800" />
        </div>
        <div className="mb-2">
          <label className="block text-sm">Confirm Password</label>
          <input name="confirmPassword" type="password" value={values.confirmPassword} onChange={onChange} className="w-full border rounded px-2 py-1 bg-white dark:bg-gray-800" />
        </div>
        <div className="mb-3">
          <label className="block text-sm">Role</label>
          <select name="role" value={values.role} onChange={onChange} className="w-full border rounded px-2 py-1 bg-white dark:bg-gray-800">
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className="flex gap-2">
          <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded">{t ? t('auth.register.submit') : 'Register'}</button>
          <button type="button" onClick={onSwitch} className="px-3 py-1 border rounded">{t ? t('auth.register.switch') : 'Back to Login'}</button>
        </div>
      </form>
    </div>
  );
}
