# 🧀 Cheese Collector

Un jeu 3D immersif où vous incarnez un chat affamé à la recherche de fromages !

## 🎮 Gameplay

Explorez un monde 3D et collectez tous les fromages pour passer au niveau suivant. Plus vous progressez, plus votre chat devient rapide !

## 🕹️ Contrôles

- **WASD** - Déplacer le chat
- **Souris** - Regarder autour
- **E** - Collecter le fromage (quand vous êtes proche)
- **Clic** - Verrouiller/déverrouiller la caméra

## 📁 Structure

```
threejs-game/
├── index.tsx              # Wrapper React principal
├── utils/                 # Logique du jeu en JavaScript vanilla
│   ├── application.js     # Point d'entrée de l'application Three.js
│   ├── scene.js          # Gestion de la scène 3D
│   ├── camera.js         # Contrôles de la caméra
│   ├── physics.js        # Moteur physique (Cannon.js)
│   ├── cheeseCollector.js # Logique de collection
│   ├── ui.js             # Interface utilisateur du jeu
│   └── tools.js          # Utilitaires
├── components/           # Composants React spécifiques au jeu
├── hooks/               # Hooks personnalisés pour le jeu
└── assets/              # Ressources (modèles, textures)
```

## 🛠️ Technologies

- **Three.js** - Moteur 3D
- **Cannon.js** - Physique
- **React** - Interface utilisateur
- **TypeScript** - Type safety pour le wrapper React

## 🚀 Développement

### Ajouter de nouveaux modèles

1. Placez vos modèles GLTF dans `/public/models/`
2. Ajoutez le nom du modèle dans `availableModels` dans `application.js`

### Créer un nouveau niveau

1. Créez un fichier JSON dans `/public/scenes/`
2. Chargez-le dans `application.js` avec `sceneObj.loadScene()`

## 📝 Notes

- Le jeu utilise WebGPU pour le rendu (fallback vers WebGL si non disponible)
- Les scores sont sauvegardés dans le localStorage
- Les niveaux augmentent la vitesse du chat progressivement

## 🐛 Debug

Pour activer les outils de développement (GUI), vérifiez le fichier `ui.js` qui inclut des contrôles pour :
- Changer la skybox
- Modifier le terrain
- Ajuster la lumière
- Placer/supprimer des objets
