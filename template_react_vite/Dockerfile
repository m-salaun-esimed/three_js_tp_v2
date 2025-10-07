# Utiliser une image Node légère
FROM node:20-alpine

# Définir le répertoire de travail
WORKDIR /app

# Installer uniquement les dépendances nécessaires au début
COPY package*.json ./
RUN npm install

# Copier le code source
COPY . .

# Exposer le port de développement Vite
EXPOSE 5176

# Commande de lancement (dev mode)
CMD ["npm", "run", "dev", "--", "--host"]