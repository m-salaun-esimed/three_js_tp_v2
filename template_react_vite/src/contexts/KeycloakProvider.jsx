import { ReactKeycloakProvider } from '@react-keycloak/web'
import keycloak from '../configs/keycloak.js'

export function KeycloakProvider({ children }) {
  return (
    <ReactKeycloakProvider
      authClient={keycloak}
      initOptions={{
        onLoad: 'check-sso',
        pkceMethod: 'S256',
        checkLoginIframe: false,
      }}
      LoadingComponent={<div>Chargement Keycloak...</div>}
      ErrorComponent={<div>Erreur d'authentification Keycloak</div>}
    >
      {children}
    </ReactKeycloakProvider>
  )
}