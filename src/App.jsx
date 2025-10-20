import React, { useState, useEffect } from 'react';
import useAuth from './hooks/useAuth.js';
import Nav from './components/Nav.jsx';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import ShipmentForm from './components/ShipmentForm.jsx';
import ShipmentList from './components/ShipmentList.jsx';
import ShipmentDetail from './components/ShipmentDetail.jsx';
import AdminPanel from './components/AdminPanel.jsx';
import './App.css';
import SettingsSidebar from './components/SettingsSidebar.jsx';
import { useLocalStorage } from './hooks/useAuth.js';
import { createTranslator } from './lib/i18n.js';

export default function App() {
  const auth = useAuth();
  const [view, setView] = useState('loginUser');  'loginAdmin' | 'register' | 'dashboard' | 'create'
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0); 
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [theme, setTheme] = useLocalStorage('courier_theme', 'light');
  const [language, setLanguage] = useLocalStorage('courier_lang', 'en');
  const t = React.useMemo(() => createTranslator(language), [language]);

  useEffect(() => {
    if (auth.user) setView('dashboard');
    else setView((v) => (v === 'loginAdmin' || v === 'register') ? v : 'loginUser');
  }, [auth.user]);

  const handleCreated = () => {
    setRefreshKey(k => k + 1);
  };

  const handleAuthSuccess = () => setView('dashboard');

  useEffect(() => {
    if (!auth.user) setView((v) => (v === 'loginAdmin' || v === 'register') ? v : 'loginUser');
  }, [auth.user]);

 
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      root.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, [theme]);

  const handleLogout = () => {
    if (auth && auth.logout) auth.logout();
    setSettingsOpen(false);
    setView('loginUser');
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Nav auth={auth} onNavigate={(v) => setView(v)} onSettings={() => setSettingsOpen(true)} t={t} />

      {!auth.user ? (
        <main className="max-w-3xl mx-auto p-8">
          {view === 'loginAdmin' ? (
            <Login adminMode auth={auth} onSwitch={() => setView('register')} onSuccess={handleAuthSuccess} t={t} />
          ) : view === 'register' ? (
            <Register auth={auth} onSwitch={() => setView('loginUser')} onSuccess={handleAuthSuccess} t={t} />
          ) : (
            <Login auth={auth} onSwitch={() => setView('register')} onSuccess={handleAuthSuccess} t={t} />
          )}

          <section className="card mt-6 text-left">
            <h3 className="text-lg font-semibold">{t('demo.about.title')}</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {t('demo.about.body')}
            </p>
          </section>
        </main>
      ) : (
        <main className="max-w-7xl mx-auto p-8">
          <div className="grid md:grid-cols-3 gap-8 items-start">
            <div className="md:col-span-2">
              <ShipmentForm key={refreshKey} auth={auth} onCreated={handleCreated} t={t} />
              <ShipmentList key={refreshKey + 1000} auth={auth} onSelect={(s) => setSelectedShipment(s)} t={t} />
            </div>

            <aside>
              <div className="card">
                <h3 className="font-semibold">{t('quick.title')}</h3>
                <div className="mt-3 flex flex-col gap-2">
                  <button
                    onClick={() => navigator.clipboard && navigator.clipboard.writeText(auth.user?.email || '')}
                    className="px-3 py-2 border rounded hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    {t('quick.copyEmail')}
                  </button>
                  <button onDoubleClick={() => alert('Double-click demo')} className="px-3 py-2 border rounded hover:bg-gray-50 dark:hover:bg-gray-800">{t('quick.doubleClick')}</button>
                  <input onFocus={() => console.log('Quick input focus')} onBlur={() => console.log('Quick input blur')} placeholder={t('quick.placeholder')} className="border p-2 rounded bg-white dark:bg-gray-800" />
                </div>
              </div>

              {auth.user?.role === 'admin' && (
                <AdminPanel auth={auth} />
              )}
            </aside>
          </div>

          {selectedShipment && (
            <ShipmentDetail
              auth={auth}
              shipment={selectedShipment}
              onClose={() => setSelectedShipment(null)}
              onSaved={() => {

                setSelectedShipment(null);
                setRefreshKey(k => k + 1);
              }}
              t={t}
            />
          )}
        </main>
      )}

      <SettingsSidebar
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        theme={theme}
        setTheme={setTheme}
        language={language}
        setLanguage={setLanguage}
        onLogout={handleLogout}
      />
    </div>
  );
}