import { useEffect } from "react";
import { useKeycloak } from "@react-keycloak/web";
import { setUUID, setEmail, setUsername, setFirstName, setLastName } from "../domains/Authentification/slice";
import { useDispatch } from "react-redux";
import { ReactNode } from "react";

interface KeycloakTokenParsed {
  preferred_username?: string;
  email?: string;
  given_name?: string;
  family_name?: string;
  resource_access?: {
    portal?: {
      roles?: string[];
    };
  };
  [key: string]: any;
}

interface KeycloakInstance {
  authenticated: boolean;
  subject?: string;
  login: () => void;
  updateToken: (minValidity: number) => Promise<boolean>;
  hasRealmRole: (role: string) => boolean;
  hasResourceRole: (role: string, resource: string) => boolean;
  tokenParsed?: KeycloakTokenParsed;
}

interface AuthGuardProps {
  children: ReactNode;
  requiredRole?: string;
}

function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const { keycloak, initialized } = useKeycloak();
  const dispatch = useDispatch();

  useEffect(() => {
    if (initialized && !keycloak.authenticated) {
      keycloak.login();
      return;
    }

    if (initialized && keycloak.authenticated) {
      keycloak
        .updateToken(0)
        .then((refreshed) => {
          if (refreshed) {
            console.log("Token rafraîchi pour sync rôles");
          }

          const tokenParsed = keycloak.tokenParsed;
          const username = tokenParsed?.preferred_username;
          const email = tokenParsed?.email;
          const firstName = tokenParsed?.given_name;
          const lastName = tokenParsed?.family_name;

          dispatch(setUUID(keycloak.subject ?? null));
          dispatch(setUsername(username ?? null));
          dispatch(setEmail(email ?? null));
          dispatch(setFirstName(firstName ?? null));
          dispatch(setLastName(lastName ?? null));

          console.log("Utilisateur authentifié avec succès", tokenParsed, "UUID:", keycloak.subject);
        })
        .catch((err) => console.error("Erreur refresh token:", err));
    }
  }, [initialized, keycloak, dispatch]);

  if (!initialized) {
    return <div>Initialisation en cours...</div>;
  }

  if (!keycloak.authenticated) {
    return null;
  }

  if (requiredRole) {
    const hasRole =
      keycloak.hasRealmRole(requiredRole) ||
      keycloak.hasResourceRole(requiredRole, "portal") ||
      (keycloak.tokenParsed?.resource_access?.portal?.roles?.includes(requiredRole) ?? false);
    if (!hasRole) {
      return <div>Accès refusé : rôle requis {requiredRole}</div>;
    }
  }

  return children;
}

export default AuthGuard;