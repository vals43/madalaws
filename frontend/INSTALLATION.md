# Guide d'Installation MadaLaws

## Prérequis

- Node.js 18+ (LTS recommandé)
- pnpm 8+ (ou npm/yarn)
- Un navigateur moderne (Chrome, Firefox, Safari, Edge)
- Un serveur API compatible OpenAPI 3.0.3 en cours d'exécution

## Installation Locale

### Étape 1: Cloner ou Télécharger le Projet

```bash
# Via Git
git clone <repository-url> madalaws
cd madalaws

# Ou télécharger le ZIP et extraire
```

### Étape 2: Installer les Dépendances

```bash
# Avec pnpm (recommandé)
pnpm install

# Avec npm
npm install

# Avec yarn
yarn install

# Avec bun
bun install
```

### Étape 3: Configurer l'URL API

#### Option A: Via fichier .env.local

```bash
# Créer le fichier .env.local
touch .env.local

# Ajouter le contenu
echo "NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api" >> .env.local
```

Remplacez `http://localhost:5000/api` par l'URL réelle de votre API.

#### Option B: Via l'interface (après démarrage)

1. Démarrer l'application: `pnpm dev`
2. Aller à `http://localhost:3000/config`
3. Entrer l'URL API
4. Cliquer "Tester la connexion"
5. Sauvegarder

### Étape 4: Démarrer le Serveur de Développement

```bash
pnpm dev
```

Output:
```
▲ Next.js 16.2.4
- Local:        http://localhost:3000
- Environments: .env.local

✓ Ready in 3.2s
```

L'application est maintenant accessible sur **http://localhost:3000**

## Premiers Pas

### 1. Vérifier la Connexion API

1. Aller à `http://localhost:3000/config`
2. Entrer l'URL API
3. Cliquer "Tester la connexion"
4. Vérifier le message de succès

### 2. Explorer les Lois

1. Aller à `http://localhost:3000/explorer`
2. La hiérarchie des lois devrait s'afficher
3. Cliquer sur un article pour voir le détail

### 3. Créer un Compte Admin

1. Aller à `http://localhost:3000/admin/register`
2. Entrer email et mot de passe
3. Cliquer "S'inscrire"
4. Être redirigé vers le dashboard

### 4. Ajouter des Données

1. Aller à `http://localhost:3000/admin/dashboard`
2. Cliquer sur "Ajouter un Code" ou "Ajouter un Article"
3. Remplir le formulaire
4. Cliquer "Créer"

## Build de Production

### Créer la Build

```bash
pnpm build
```

Vérifie que tout compile correctement. Résultat:
```
✓ Compiled successfully in 6.0s
✓ Generating static pages (12/12)
```

### Tester la Build Localement

```bash
pnpm start
```

L'app est maintenant en mode production sur `http://localhost:3000`

## Déploiement

### Option 1: Vercel (Recommandé)

Vercel est la plateforme officielle pour Next.js.

```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel

# Production
vercel --prod
```

### Option 2: Docker

```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
# Build
docker build -t madalaws .

# Run
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_BASE_URL=http://api:5000/api \
  madalaws
```

### Option 3: Self-Hosted (Linux/Ubuntu)

```bash
# 1. Cloner le repo
git clone <url> /var/www/madalaws
cd /var/www/madalaws

# 2. Installer les dépendances
npm install

# 3. Build
npm run build

# 4. Créer un service systemd
sudo nano /etc/systemd/system/madalaws.service
```

```ini
[Unit]
Description=MadaLaws Next.js App
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/madalaws
Environment="NODE_ENV=production"
Environment="NEXT_PUBLIC_API_BASE_URL=https://api.example.com"
ExecStart=/usr/bin/node /var/www/madalaws/node_modules/.bin/next start
Restart=on-failure
RestartSec=5s

[Install]
WantedBy=multi-user.target
```

```bash
# 5. Démarrer le service
sudo systemctl daemon-reload
sudo systemctl enable madalaws
sudo systemctl start madalaws
sudo systemctl status madalaws

# 6. Configurer Nginx
sudo nano /etc/nginx/sites-available/madalaws
```

```nginx
server {
    listen 80;
    server_name madalaws.example.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# 7. Activer le site
sudo ln -s /etc/nginx/sites-available/madalaws /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Dépannage

### Erreur: "Failed to fetch API"

**Solution:** Vérifier l'URL API
```bash
# Depuis /config page
1. Cliquer "Tester la connexion"
2. Vérifier le message d'erreur
3. Confirmer que l'API répond sur curl:
curl http://localhost:5000/api/codes
```

### Erreur: "NEXT_PUBLIC_API_BASE_URL is not set"

**Solution:** Ajouter la variable d'environnement
```bash
# .env.local
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api

# Relancer le serveur
pnpm dev
```

### Erreur: "Port 3000 already in use"

**Solution:** Utiliser un port différent
```bash
# macOS/Linux
PORT=3001 pnpm dev

# Windows
set PORT=3001 && pnpm dev
```

### Erreur: "Token invalid" après login

**Solution:** Vérifier l'API JWT
1. Confirmer que l'API retourne un token valide
2. Vérifier la clé secrète JWT
3. Lire les logs de l'API

### Lenteur au démarrage

**Solution:** Nettoyer le cache
```bash
# Supprimer les fichiers générés
rm -rf .next
rm -rf node_modules
pnpm install
pnpm dev
```

## Variables d'Environnement

### Requises

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
```

### Optionnelles

```env
# Next.js
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Analytics (optionnel)
NEXT_PUBLIC_GA_ID=...
```

## Scripts NPM

```bash
# Développement
pnpm dev              # Démarrer le serveur de dev
pnpm dev --open       # Ouvrir le navigateur

# Production
pnpm build            # Créer la build optimisée
pnpm start            # Démarrer le serveur production

# Utilitaires
pnpm lint             # Linter les fichiers
pnpm type-check       # Vérifier les types TypeScript
pnpm format           # Formater le code

# Netlify
pnpm build            # Créer pour Netlify
```

## Ports Utilisés

| Service | Port | URL |
|---------|------|-----|
| Frontend (Next.js) | 3000 | http://localhost:3000 |
| API Backend | 5000 | http://localhost:5000 |

Modifier les ports si nécessaire dans la configuration.

## Support et Aide

### Logs d'Erreur

```bash
# Terminal (serveur dev)
pnpm dev 2>&1 | tee app.log

# Navigateur (DevTools)
F12 → Console tab → Chercher les erreurs
```

### Documentation

- `README.md` - Vue générale
- `SETUP.md` - Configuration détaillée
- `ARCHITECTURE.md` - Architecture technique

### Vérifier l'Installation

```bash
# 1. Node et npm
node --version  # v18+
npm --version   # v9+
pnpm --version  # v8+

# 2. Dépendances
pnpm list | head -20

# 3. Build
pnpm build      # Doit succéder

# 4. Test
pnpm dev        # Doit démarrer sans erreurs
```

---

**Installation réussie!** Vous pouvez maintenant:
1. Explorer les lois: `http://localhost:3000/explorer`
2. Accéder à l'admin: `http://localhost:3000/admin/login`
3. Configurer l'API: `http://localhost:3000/config`

Pour plus d'aide, consultez la documentation ou contactez le support.
