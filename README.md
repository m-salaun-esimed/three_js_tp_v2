# React Vite + Keycloak Template

## Description

Ce template est une base prête à l'emploi pour développer une application React avec Vite, intégrant l'authentification via Keycloak (OIDC). Il inclut :

Un frontend React/Vite avec :
- Configuration Keycloak complète (instance, provider, context, et hooks pour l'auth).
- Routage React Router avec AuthGuard pour protéger les routes.
- Un Sidebar responsive et prêt à l'emploi (avec liens conditionnels basés sur l'auth).
- Gestion des tokens, login/logout, et refresh automatique.

- Un backend Keycloak en Docker, avec une base de données PostgreSQL dédiée et isolée.
- Orchestration via Docker Compose pour un démarrage rapide en dev.

Idéal pour des apps SPAs sécurisées. Personnalisez facilement le nom du projet, les realms/clients Keycloak, et intégrez votre logique métier.

## Prérequis

- Docker et Docker Compose (v2+).
- Node.js ≥ 18 (pour dev local sans Docker).
- Un compte Git pour cloner/forker le repo.

## Installation Rapide

1. Clonez le repo :

```bash
git clone https://github.com/m-salaun-esimed/template_react_vite_keycloak.git
cd template_react_vite_keycloak
```

2. Renommez le dossier frontend (optionnel, pour personnaliser) :

    - Le dossier ./template_react_vite est le contexte de build. Pour le renommer (ex. my-app-frontend) :
        - Mettez à jour docker-compose.yml : Changez context: ./template_react_vite en context: ./my-app-frontend et le volume ./template_react_vite:/app en ./my-app-frontend:/app.
        - Changez le nom du service de template_react_vite à my-app-frontend si besoin.

3. Configurez le frontend :

    - Changer les valeurs du .env

4. Démarrez le stack :
```bash
    docker compose up --build -d
```

5. Configurez Keycloak (une seule fois) :

    - Accédez à l'admin console. Avec admin/admin.
    - Créez un realm : "Fanlab".
    - Créez un client : ID template_react_vite (ou votre custom), type OpenID Connect, public (pas de secret), activez "Standard Flow".
    - Valid redirect URIs : http://localhost:5176/*.
    - Ajoutez redirect URIs : http://localhost:5176/.
    - Web Origins : +.
    - Créez un user test (ex. testuser / password).

# Utilisation

## Authentification

- L'app wrappe tout dans <KeycloakProvider> (dans main.jsx).
- Utilisez les hooks du context Keycloak :

```bash
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
```
- Login : keycloak.login() (redirige vers Keycloak).
- Logout : keycloak.logout() (clear tokens et redirect).

## Routage avec AuthGuard

- Routes protégées : Utilisez <AuthGuard> dans App.jsx ou routes :
- Routes publiques : Pas de guard.

## Sidebar

- Composant prêt : <Sidebar /> dans components/Sidebar.jsx.
- Personnalisez les menus dans le fichier.