import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import './i18n/i18n'; // Import i18n configuration
import { ensureDataSync } from './utils/dataSync'; // Import data sync utility

// Ensure data synchronization when app starts
ensureDataSync();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
