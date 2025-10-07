import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { KeycloakProvider } from './contexts/KeycloakProvider.jsx'

createRoot(document.getElementById('root')).render(
  <KeycloakProvider>
    <StrictMode>
      <App />
    </StrictMode>
  </KeycloakProvider>
)
