import React, { useState } from 'react';

export default function Navbar({ auth, onNavigate, onSettings, t }) {
  const [open, setOpen] = useState(false);
  const handleLogout = () => {
    try {
      localStorage.removeItem("courier_user");
      localStorage.removeItem("courier_token");
    } catch {}
    if (auth && auth.logout) auth.logout();
    if (onNavigate) onNavigate('welcome');
  };

  let user = auth?.user || null;
  if (!user) {
    try { user = JSON.parse(localStorage.getItem('courier_user')); } catch {}
  }

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
     
        <button onClick={() => { setOpen(false); onNavigate && onNavigate(user ? 'dashboard' : 'welcome'); }} className="text-lg font-bold hover:text-gray-200 tracking-wide pr-3 mr-1">
          📦 {t ? t('nav.logo') : 'CourierTrack'}
        </button>
        
        <button className="sm:hidden p-2 rounded hover:bg-white/10" onClick={() => setOpen(v => !v)} aria-label="Menu">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>

        
        <div className="hidden sm:flex gap-8 items-center">
          <button
            onClick={() => onNavigate && onNavigate(user ? 'dashboard' : 'welcome')}
            className="hover:text-gray-200 transition-colors duration-200 px-4 py-2"
          >
            {t ? t('nav.home') : 'Home'}
          </button>
          {!user && (
            <>
              <button
                onClick={() => onNavigate && onNavigate('loginUser')}
                className="hover:text-gray-200 transition-colors duration-200 px-4 py-2"
              >
                {t ? t('nav.login') : 'Login'}
              </button>
              <button
                onClick={() => onNavigate && onNavigate('register')}
                className="hover:text-gray-200 transition-colors duration-200 px-4 py-2"
              >
                {t ? t('nav.register') : 'Register'}
              </button>
            </>
          )}

          {user && (
            <>
              <button
                onClick={() => onNavigate && onNavigate('dashboard')}
                className="hover:text-gray-200 transition-colors duration-200 px-4 py-2"
              >
                {t ? t('nav.dashboard') : 'Dashboard'}
              </button>
              <button
                onClick={() => onNavigate && onNavigate('create')}
                className="hover:text-gray-200 transition-colors duration-200 px-4 py-2"
              >
                {t ? t('nav.create') : 'Create'}
              </button>
              <button
                onClick={() => onNavigate && onNavigate('track')}
                className="hover:text-gray-200 transition-colors duration-200 px-4 py-2"
              >
                {t ? t('nav.track') : 'Track'}
              </button>

            
              {user.role === "admin" && (
                <button
                  onClick={() => onNavigate && onNavigate('admin')}
                  className="hover:text-gray-200 transition-colors duration-200 px-4 py-2"
                >
                  {t ? t('nav.admin') : 'Admin Panel'}
                </button>
              )}

            </>
          )}
          <button
            onClick={() => onSettings && onSettings()}
            className="px-3 py-1 rounded-full border border-white/20 bg-white/15 hover:bg-white/25 transition-colors"
          >
            ⚙️ {t ? t('nav.settings') : 'Settings'}
          </button>
          {user && (
            <span className={`text-[10px] uppercase tracking-wide px-2 py-1 rounded border ${user.role === 'admin' ? 'bg-green-500/20 border-green-400 text-green-100' : 'bg-white/10 border-white/20 text-white'}`}>
              {user.role || '-'}
            </span>
          )}
        </div>
      </div>
     
      <div className={`sm:hidden px-4 pb-3 space-y-2 border-t border-white/10 transition-all duration-200 ease-out origin-top ${open ? 'opacity-100 max-h-[50vh]' : 'opacity-0 max-h-0 overflow-hidden'}`}>
          <button
            onClick={() => { setOpen(false); onNavigate && onNavigate(user ? 'dashboard' : 'welcome'); }}
            className="block w-full text-left hover:text-gray-200 py-2 px-4"
          >
            {t ? t('nav.home') : 'Home'}
          </button>
          {!user ? (
            <>
              <button onClick={() => { setOpen(false); onNavigate && onNavigate('loginUser'); }} className="block w-full text-left hover:text-gray-200 py-2 px-4">{t ? t('nav.login') : 'Login'}</button>
              <button onClick={() => { setOpen(false); onNavigate && onNavigate('register'); }} className="block w-full text-left hover:text-gray-200 py-2 px-4">{t ? t('nav.register') : 'Register'}</button>
            </>
          ) : (
            <>
              <button onClick={() => { setOpen(false); onNavigate && onNavigate('dashboard'); }} className="block w-full text-left hover:text-gray-200 py-2 px-4">{t ? t('nav.dashboard') : 'Dashboard'}</button>
              <button onClick={() => { setOpen(false); onNavigate && onNavigate('create'); }} className="block w-full text-left hover:text-gray-200 py-2 px-4">{t ? t('nav.create') : 'Create'}</button>
              <button onClick={() => { setOpen(false); onNavigate && onNavigate('track'); }} className="block w-full text-left hover:text-gray-200 py-2 px-4">{t ? t('nav.track') : 'Track'}</button>
              {user.role === 'admin' && (
                <button onClick={() => { setOpen(false); onNavigate && onNavigate('admin'); }} className="block w-full text-left hover:text-gray-200 py-2 px-4">{t ? t('nav.admin') : 'Admin Panel'}</button>
              )}
              <div className="pt-2">
                <button onClick={() => { setOpen(false); onSettings && onSettings(); }} className="w-full px-3 py-2 rounded-full border border-white/20 bg-white/15 hover:bg-white/25 transition-colors">⚙️ {t ? t('nav.settings') : 'Settings'}</button>
              </div>
            </>
          )}
        </div>
    </nav>
  );
}
