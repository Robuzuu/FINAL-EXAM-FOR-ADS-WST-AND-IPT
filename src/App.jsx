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
  
  const [view, setView] = useState('welcome');
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0); 
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [theme, setTheme] = useLocalStorage('courier_theme', 'light');
  const [language, setLanguage] = useLocalStorage('courier_lang', 'en');
  const t = React.useMemo(() => createTranslator(language), [language]);

  useEffect(() => {
    if (auth.user) setView('dashboard');
    else setView((v) => (v === 'register' || v === 'loginUser') ? v : 'welcome');
  }, [auth.user]);

  const handleCreated = () => {
    setRefreshKey(k => k + 1);
  };

  const handleAuthSuccess = () => setView('dashboard');

  useEffect(() => {
    if (!auth.user) setView((v) => (v === 'register' || v === 'loginUser') ? v : 'welcome');
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
    setView('welcome');
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-black dark:text-gray-100">
      <Nav auth={auth} onNavigate={(v) => setView(v)} onSettings={() => setSettingsOpen(true)} t={t} />

      {!auth.user ? (
        <main className="max-w-3xl mx-auto p-8">
          {view === 'register' ? (
            <Register
              auth={auth}
              onSwitch={() => setView('loginUser')}
              onSuccess={() => setView('loginUser')}
              t={t}
            />
          ) : view === 'loginUser' ? (
            <Login auth={auth} onSwitch={() => setView('register')} onSuccess={handleAuthSuccess} t={t} />
          ) : (
            <section className="card text-left">
              <h1 className="text-2xl font-bold">Welcome to {t('nav.logo')}</h1>
              <p className="mt-2 text-sm text-black dark:text-gray-300">Use the navigation bar to Login or Register to get started.</p>
            </section>
          )}
        </main>
      ) : (
        <main className="max-w-7xl mx-auto p-8">
          <div className="grid md:grid-cols-3 gap-8 items-start">
            <div className="md:col-span-2">
              <ShipmentForm key={refreshKey} auth={auth} onCreated={handleCreated} t={t} />
              <ShipmentList key={refreshKey + 1000} auth={auth} onSelect={(s) => setSelectedShipment(s)} t={t} />
            </div>

            <aside>
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
        isAuthenticated={!!auth.user}
      />
    </div>
  );
}
