import { ReactKeycloakProvider } from "@react-keycloak/web";
import keycloak from "../configs/keycloak";
import { FC, ReactNode } from "react";

interface KeycloakProviderProps {
  children: ReactNode;
}

export const KeycloakProvider: FC<KeycloakProviderProps> = ({ children }) => {
  return (
    <ReactKeycloakProvider
      authClient={keycloak}
      initOptions={{
        onLoad: "check-sso",
        pkceMethod: "S256",
        checkLoginIframe: false,
      }}
    >
      {children}
    </ReactKeycloakProvider>
  );
};