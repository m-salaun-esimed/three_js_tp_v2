import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { KeycloakProvider } from './contexts/KeycloakProvider.jsx'
import { Provider } from 'react-redux'
import './index.css'
import App from './App.jsx'
import store from './stores/store.js'

createRoot(document.getElementById('root')).render(
  <KeycloakProvider>
    <StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </StrictMode>
  </KeycloakProvider>
)
