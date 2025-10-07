import React, { Fragment } from 'react'
import { useKeycloak } from '@react-keycloak/web'

/**
 * Composant bouton de déconnexion avec Keycloak.
 * @returns {JSX.Element} Un bouton pour déconnecter l'utilisateur.
 */
function LogOutKeycloak() {
  const { keycloak } = useKeycloak()

  const logOut = () => {
    keycloak.logout({
      redirectUri: window.location.origin + '/', 
    })
  }
  return (
    <Fragment>
      <div className='ms-3'>
        <button
          onClick={logOut}
          disabled={!keycloak.authenticated}
          className="bg-red-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 transition duration-200 disabled:opacity-50"
        >
          Déconnexion
        </button>
      </div>
    </Fragment>
  )
}

export default LogOutKeycloak