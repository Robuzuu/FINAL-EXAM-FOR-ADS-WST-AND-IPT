 User and admin login/register
: Create, list, view details, update status, assign driver
: Admin-only quick actions
: Light/Dark mode with persistent preference
: `en`, `fil`, `ja` with a simple translator
 React + Vite
Tailwind via CDN 

   npm install
   
   npm run dev
   
   npm run build
   
   npm run preview
   
- Theme is stored in `localStorage` key `courier_theme` (`light` | `dark`).
- Language is stored in `localStorage` key `courier_lang` (`en` | `fil` | `ja`).
- Dark mode is toggled by adding the `dark` class to `html`/`body`. See `src/App.jsx` for the logic
Project Structure
- `src/App.jsx` — main app shell (routing-like view state, theme, language)
- `src/components/` — UI components (e.g., `Login.jsx`, `ShipmentForm.jsx`, `ShipmentList.jsx`, `ShipmentDetail.jsx`, `AdminPanel.jsx`, `SettingsSidebar.jsx`, `Nav.jsx`)
- `src/lib/i18n.js` — message dictionaries and translator
- `src/App.css` — global styles and light/dark tweaks
