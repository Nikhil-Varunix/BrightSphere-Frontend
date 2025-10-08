import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import 'leaflet/dist/leaflet.css';
import { BrowserRouter } from 'react-router-dom'

import '/public/assets/fonts/phosphor/duotone/style.css';

import '/public/assets/fonts/tabler-icons.min.css';
import '/public/assets/fonts/feather.css';
import '/public/assets/fonts/fontawesome.css';
import '/public/assets/fonts/material.css';

import '/public/assets/css/style.css';
import '/public/assets/css/style-preset.css';
import '/public/assets/css/plugins/style.css';

import { AuthProvider } from './context/authContext.jsx';
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)