# Gaming Hub - React + Vite + Three.js

## Description

Plateforme de jeux web moderne construite avec React, Vite et Three.js. Ce hub de jeux propose une architecture modulaire permettant d'intégrer facilement de nouveaux jeux 2D et 3D.

### Fonctionnalités principales

- **Hub de jeux centralisé** - ArcZhitecture modulaire pour gérer plusieurs jeux
- **Jeu 3D intégré** - Cheese Collector, un jeu de collection en 3D avec Three.js
- **Mode sombre/clair** - Interface adaptative avec basculement de thème
- **Design responsive** - Interface optimisée pour tous les écrans
- **UI moderne** - Composants ShadCN/UI avec Tailwind CSS
- **State management** - Redux pour la gestion d'état globale

## Jeux disponibles

### Cheese Collector

Un jeu 3D immersif où vous incarnez un chat affamé à la recherche de fromages !

**Caractéristiques :**
- Moteur 3D avec Three.js et WebGPU
- Physique réaliste avec Cannon.js
- Système de niveaux progressifs
- Contrôles ZQSD + Souris
- Interface de score en temps réel
- Indicateurs visuels contextuels

**Commandes :**
- `ZQSD` - Déplacer le chat
- `E` - Collecter un fromage (quand proche)
- `Souris` - Regarder autour
- `ESC` - Sortir du mode pointer lock

## Structure du projet

```
template_react_vite_keycloak/
├── template_react_vite/
│   ├── public/
│   │   ├── tp_three.js/          # Assets Three.js (models, textures, skybox)
│   │   └── cat_game.png          # Thumbnail du jeu
│   ├── src/
│   │   ├── components/           # Composants réutilisables
│   │   │   └── SideBar.tsx       # Navigation principale
│   │   ├── features/             # Features de l'application
│   │   │   └── game-library/     # Bibliothèque de jeux
│   │   ├── games/                # Jeux intégrés
│   │   │   ├── registry.ts       # Registre des jeux
│   │   │   ├── shared/           # Composants partagés
│   │   │   └── threejs-game/     # Cheese Collector
│   │   │       ├── index.tsx     # Wrapper React
│   │   │       └── utils/        # Logique du jeu
│   │   ├── pages/                # Pages de l'application
│   │   │   ├── Home.tsx          # Page d'accueil
│   │   │   └── GamePage.tsx      # Page de jeu
│   │   ├── types/                # Définitions TypeScript
│   │   ├── stores/               # Redux stores
│   │   └── main.tsx              # Point d'entrée
│   └── package.json
```
### GravityPuzzle

Un jeu 3D ou vous pouvez influencer la gravité sur une boulle, le but est de finir les puzzle le plus rapidement en passant par les checkpoints ! 

**Caractéristiques :**
- Moteur 3D avec Three.js et WebGPU
- Physique réaliste avec Cannon.js
- Système de niveaux progressifs
- Contrôles zqsdae + Souris
- Interface de score en temps réel : temps et nombre de mouvements
- Edition & création d'un niveau

**Commandes :**
- `zqsdae` - Change la gravité
- `R` - Recommencer le niveau
- `Souris` - Regarder autour

## Prérequis

- **Node.js** ≥ 18
- **Git** pour cloner le repository

## Installation

### 1. Cloner le projet

```bash
git clone https://github.com/m-salaun-esimed/three_js_tp_v2.git
cd three_js_tp_v2
```

### 2. Installer les dépendances

```bash
cd three_js_tp_v2
npm install
```

### 3. Lancer l'application

```bash
cd template_react_vite
npm run dev
```

L'application sera accessible sur : http://localhost:5176

## Architecture des jeux

### Ajouter un nouveau jeu

1. **Créer le dossier du jeu** dans `src/games/` :

```bash
src/games/mon-nouveau-jeu/
├── index.tsx          # Composant React principal
├── utils/             # Logique du jeu
└── assets/            # Assets spécifiques (si besoin)
```

2. **Enregistrer le jeu** dans `src/games/registry.ts` :

```typescript
export const gamesRegistry: Record<string, GameMetadata> = {
  'mon-nouveau-jeu': {
    id: 'mon-nouveau-jeu',
    name: 'Mon Nouveau Jeu',
    description: 'Description du jeu...',
    thumbnail: '/mon-jeu.png',
    category: '2d', // ou '3d', 'puzzle', 'arcade'
    minPlayers: 1,
    maxPlayers: 1,
    difficulty: 'easy',
    tags: ['Action', 'Aventure'],
  },
};

export const gameComponents = {
  'mon-nouveau-jeu': lazy(() => import('./mon-nouveau-jeu')),
};
```

3. **Créer le composant** dans `index.tsx` :

```tsx
import { useEffect, useRef } from 'react';

const MonNouveauJeu = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => {
    };
  }, []);

  return <div ref={containerRef} className="w-full h-screen" />;
};

export default MonNouveauJeu;
```

## Technologies utilisées

### Frontend
- **React 18** - Bibliothèque UI
- **TypeScript** - Typage statique
- **Vite** - Build tool et dev server
- **React Router** - Routing
- **Redux Toolkit** - State management
- **Tailwind CSS** - Styling utility-first
- **ShadCN/UI** - Composants UI

### Jeux 3D
- **Three.js** - Moteur 3D
- **WebGPU** - API graphique moderne
- **Cannon.js** - Moteur physique
- **lil-gui** - Interface de debug

## Scripts disponibles

```bash
npm run dev              
```

## Auteur

**Matthieu Salaun** - [GitHub](https://github.com/m-salaun-esimed)
