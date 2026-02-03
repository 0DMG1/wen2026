// --- PEGA ESTO EN src/main.jsx ---

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// 2. Intentamos buscar el elemento root
const rootElement = document.getElementById('root');

if (!rootElement) {
  // Si esto sale en la consola, el HTML no tiene el div id="root"
  console.error("¡ERROR FATAL: No encuentro el div con id='root'!");
} else {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}