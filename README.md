# React + TS + Vite + Keycloak Template

## Description

Ce template est une base prête à l'emploi pour développer une application React avec Vite, intégrant l'authentification via Keycloak (OIDC). Il inclut :

Un frontend React/Vite avec :
- Configuration Keycloak complète (instance, provider, context, et hooks pour l'auth).
- Routage React Router avec AuthGuard pour protéger les routes.
- Un Sidebar responsive et prêt à l'emploi (avec liens conditionnels basés sur l'auth).
- Gestion des tokens, login/logout, et refresh automatique.
- Store redux pour les données de l'utilisateur connecté.
- Un backend Keycloak en Docker, avec une base de données PostgreSQL dédiée et isolée.
- Orchestration via Docker Compose pour un démarrage rapide en dev.
- ShadCN pré-installé

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
    cd .. # si dans dossier front
    docker compose up --build -d
```

5. Configurez Keycloak (une seule fois) :

    - Accédez à l'admin console. Avec admin/admin.
    - Créez un realm : "Fanlab".
    - Créez un client : ID template_react_vite (ou votre custom), type OpenID Connect, public (pas de secret), activez "Standard Flow".
    - Valid redirect URIs : http://localhost:5176/*.
    - Valid post logout redirect URIs  : http://localhost:5176/.
    - Web Origins : +.
    - Créez un user test (ex. testuser / password).

# Utilisation

## Authentification

- L'app wrappe tout dans <KeycloakProvider> (dans main.jsx).
- Utilisez les hooks du context Keycloak :

```bash
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
```
- Login : keycloak.login() (redirige vers Keycloak).
- Logout : keycloak.logout() (clear tokens et redirect).

## Routage avec AuthGuard

- Routes protégées : Utilisez <AuthGuard> dans App.jsx ou routes :
- Routes publiques : Pas de guard.

## Sidebar

- Composant prêt : <Sidebar /> dans components/Sidebar.jsx.
- Personnalisez les menus dans le fichier.

## ShadCN
### Présentation

Ce projet utilise Shadcn/UI pour des composants d'interface utilisateur réutilisables, accessibles et personnalisables. Les composants Shadcn sont construits avec Tailwind CSS et Radix UI, garantissant un design moderne et responsive qui s'intègre parfaitement avec le basculement entre mode sombre et clair, ainsi qu'avec le thème global de l'application.

### Configuration

Les composants Shadcn sont installés en tant que fichiers individuels dans le dossier src/components/ui/. Pour ajouter de nouveaux composants, utilisez la CLI Shadcn :

```bash
npx shadcn-ui@latest add [nom-du-composant]
```

Par exemple, pour ajouter le composant Switch utilisé dans la Sidebar pour le basculement entre mode sombre et clair :

```bash
npx shadcn-ui@latest add switch
```

### Bonnes pratiques

- Utilisez les composants Shadcn pour garantir une cohérence visuelle dans l'application.

- Testez les composants en modes sombre et clair pour vérifier leur cohérence visuelle.

- Ajoutez des styles personnalisés dans tailwind.config.js ou directement via les classes Tailwind au niveau des composants pour aligner avec votre charte graphique.

- Effectuez des tests d'accessibilité avec des outils comme Lighthouse pour garantir la conformité.


## TypeScript

### Présentation

Ce projet utilise TypeScript pour assurer la sécurité des types, améliorer la maintenabilité du code et optimiser l'expérience des développeurs. TypeScript est configuré avec un mode strict pour détecter les erreurs potentielles tôt et appliquer les bonnes pratiques.

### Configuration

TypeScript est configuré via le fichier tsconfig.json à la racine du projet. Les paramètres clés incluent :

- "strict": true pour un typage strict
- "jsx": "react-jsx" pour la compatibilité avec React et Vite.
- "module": "ESNext" et "target": "ESNext" pour utiliser les fonctionnalités modernes de JavaScript.

### Utilisation

- Types et interfaces : Définissez des types ou interfaces dans src/types/ pour les données de l'application, comme les props des composants ou les réponses d'API. Exemple :

```tsx
interface User {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
}
```

- Composants : Utilisez TypeScript pour typer les composants React. Par exemple, dans Home.tsx :

```tsx
import React, { FC } from "react";

const Home: FC = () => {
  // ...
};
```