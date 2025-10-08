import React, { Fragment } from 'react'
import { useKeycloak } from '@react-keycloak/web'
import { Button } from "@/components/ui/button"
import { IoIosLogOut } from "react-icons/io";

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
      <div className="flex flex-row items-center justify-start gap-2 p-2">
        <IoIosLogOut size={24} className="text-gray-600 dark:text-gray-200" />
        <Button
          onClick={logOut}
          disabled={!keycloak.authenticated}
          className=""
        >
          Déconnexion
        </Button>
      </div>
    </Fragment >
  )
}

export default LogOutKeycloak