
import React, { useState } from 'react';
import { useForm } from '../hooks/useAuth';


export default function Register({ auth, onSwitch, onSuccess, t }) {
  const { values, onChange, reset } = useForm({ name: '', email: '', password: '' });
  const [msg, setMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setMsg(null);
    try {
      const resp = await auth.register(values.name, values.email, values.password);
      setMsg('Registered successfully');
      reset({ name: '', email: '', password: '' });
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

        <div className="flex gap-2">
          <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded">{t ? t('auth.register.submit') : 'Register'}</button>
          <button type="button" onClick={onSwitch} className="px-3 py-1 border rounded">{t ? t('auth.register.switch') : 'Back to Login'}</button>
        </div>
      </form>
    </div>
  );
}