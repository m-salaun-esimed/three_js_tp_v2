import Keycloak from "keycloak-js";

interface KeycloakConfig {
  url: string;
  realm: string;
  clientId: string;
}

import { KeycloakInstance } from "../types/keycloak";

const keycloak: KeycloakInstance = new Keycloak({
  url: import.meta.env.VITE_KEYCLOAK_URL,
  realm: import.meta.env.VITE_KEYCLOAK_REALM,
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
} as KeycloakConfig);

keycloak.onReady = () => console.log("Keycloak prêt");
keycloak.onInitError = (error: unknown) => console.error("Erreur init Keycloak:", error);

export default keycloak;
export { keycloak };