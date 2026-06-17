// dus-frontend/src/main.jsx

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './App.css';  // Note: App.css already imports tailwind
import App from './App.jsx';

// Make sure tailwind is loaded
// App.css already has @import 'tailwindcss' which is correct

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);