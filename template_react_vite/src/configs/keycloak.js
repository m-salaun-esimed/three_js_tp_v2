import Keycloak from 'keycloak-js'

const keycloak = new Keycloak({
  url: 'https://localhost:8443',
  realm: 'Fanlab',
  clientId: 'template_react_vite',
})

keycloak.onReady = () => console.log('Keycloak prêt')
keycloak.onInitError = (error) => console.error('Erreur init Keycloak:', error)

export default keycloak
export { keycloak }