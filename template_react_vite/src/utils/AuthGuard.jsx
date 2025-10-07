import { useEffect } from 'react'
import { useKeycloak } from '@react-keycloak/web'
import { setUUID, setEmail, setUsername, setFirstName, setLastName } from '../domains/Authentification/slice'
import { useDispatch } from 'react-redux';

function AuthGuard({ children, requiredRole }) {
  const { keycloak, initialized } = useKeycloak()
  const dispatch = useDispatch();
  
  useEffect(() => {
    if (initialized && !keycloak.authenticated) {
      keycloak.login()
      return
    }

    if (initialized && keycloak.authenticated) {
      keycloak.updateToken(0).then((refreshed) => {
        if (refreshed) {
          console.log('Token rafraîchi pour sync rôles')
        }
        
        const tokenParsed = keycloak.tokenParsed;
        const username = tokenParsed?.preferred_username;
        const email = tokenParsed?.email;
        const firstName = tokenParsed?.given_name;
        const lastName = tokenParsed?.family_name;
        
        dispatch(setUUID(keycloak.subject));
        dispatch(setUsername(username));
        dispatch(setEmail(email));
        dispatch(setFirstName(firstName));
        dispatch(setLastName(lastName));
        
        console.log('Utilisateur authentifié avec succès', tokenParsed, 'UUID:', keycloak.subject)
      }).catch(err => console.error('Erreur refresh token:', err))
    }
  }, [initialized, keycloak.authenticated, keycloak.updateToken, dispatch])

  if (!initialized) {
    return <div>Initialisation en cours...</div>
  }

  if (!keycloak.authenticated) {
    return null
  }

  if (requiredRole) {
    const hasRole = keycloak.hasRealmRole(requiredRole) ||
      keycloak.hasResourceRole(requiredRole, 'portal') ||
      (keycloak.tokenParsed.resource_access?.portal?.roles?.includes(requiredRole) || false)
    if (!hasRole) {
      return <div>Accès refusé : rôle requis {requiredRole}</div>
    }
  }

  return children
}

export default AuthGuard