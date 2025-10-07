import Keycloak from 'keycloak-js'

const keycloak = new Keycloak({
  url: import.meta.env.VITE_KEYCLOAK_URL,
  realm: import.meta.env.VITE_KEYCLOAK_REALM,
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
})

keycloak.onReady = () => console.log('Keycloak prêt')
keycloak.onInitError = (error) => console.error('Erreur init Keycloak:', error)

export default keycloak
export { keycloak }