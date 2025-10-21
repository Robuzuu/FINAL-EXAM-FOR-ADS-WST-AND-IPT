import React, { useEffect } from 'react';

const LANGS = [
  { value: 'en', label: 'English' },
  { value: 'fil', label: 'Filipino' },
  { value: 'ja', label: 'Japanese / Romaji' },
];

export default function SettingsSidebar({ open, onClose, theme, setTheme, language, setLanguage, onLogout, isAuthenticated = false }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && open) onClose && onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <>
      
      <div
        className={`fixed inset-0 bg-black/50 transition-opacity duration-300 ease-out ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

    
      <div
        className={`fixed inset-y-0 right-0 w-80 max-w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-xl border-l border-gray-200 dark:border-gray-700 transform transition-all duration-300 ease-in-out ${open ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'} overflow-y-auto will-change-transform will-change-opacity`}
        role="dialog"
        aria-modal="true"
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Settings</h2>
          <button onClick={onClose} className="px-2 py-1 border rounded border-gray-300 dark:border-gray-600">Close</button>
        </div>

        <div className="p-4 space-y-6">
          <section>
            <h3 className="font-medium mb-2">Appearance</h3>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="theme"
                  value="light"
                  checked={theme === 'light'}
                  onChange={() => setTheme('light')}
                />
                <span>Light</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="theme"
                  value="dark"
                  checked={theme === 'dark'}
                  onChange={() => setTheme('dark')}
                />
                <span>Dark</span>
              </label>
            </div>
          </section>

          <section>
            <h3 className="font-medium mb-2">Language</h3>
            <select
              className="border p-2 w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              {LANGS.map(l => (
                <option key={l.value} value={l.value}>{l.label}</option>
              ))}
            </select>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Applies to labels and messages (future enhancement).</p>
          </section>

          {isAuthenticated && (
            <section>
              <h3 className="font-medium mb-2">Account</h3>
              <button
                onClick={onLogout}
                onDoubleClick={onLogout}
                className="w-full px-3 py-2 rounded border border-red-300 text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                Logout
              </button>
            </section>
          )}
        </div>
      </div>
    </>
  );
}
