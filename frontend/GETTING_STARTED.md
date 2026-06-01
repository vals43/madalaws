# MadaLaws - Démarrage Immédiat

Vous avez reçu une **plateforme web complète et prête à l'emploi** pour consulter les lois de Madagascar.

## ⚡ 3 Étapes pour Démarrer

### Étape 1: Configuration API (2 min)

MadaLaws consomme une API RESTful. Vous devez définir son URL.

**Option A - Variable d'environnement (Recommandé)**

Créez un fichier `.env.local` à la racine du projet:

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
```

Remplacez `http://localhost:5000/api` par l'URL réelle de votre API.

**Option B - Interface Web**

1. Démarrez l'app: `pnpm dev`
2. Allez à: `http://localhost:3000/config`
3. Entrez l'URL API
4. Cliquez "Tester la connexion"

### Étape 2: Démarrer l'Application (1 min)

```bash
# Si ce n'est pas déjà fait
pnpm install

# Démarrer le serveur de développement
pnpm dev
```

**Output:**
```
▲ Next.js 16.2.4
- Local:        http://localhost:3000
```

L'application est maintenant accessible!

### Étape 3: Accédez aux Fonctionnalités (1 min)

| URL | Description |
|-----|-------------|
| `http://localhost:3000` | Accueil |
| `http://localhost:3000/explorer` | Explorer les lois |
| `http://localhost:3000/favorites` | Mes favoris |
| `http://localhost:3000/admin/login` | Connexion Admin |
| `http://localhost:3000/config` | Configuration API |

---

## 🎯 Utilisation Rapide

### Pour les Utilisateurs Publics

1. **Aller à l'explorateur:** `http://localhost:3000/explorer`
2. **Voir les codes juridiques** (Code Pénal, Code Civil, etc.)
3. **Cliquer sur un article** pour voir le détail
4. **Ajouter aux favoris** avec la star
5. **Accéder à Mes Favoris:** `http://localhost:3000/favorites`

### Pour les Administrateurs

1. **Allez à:** `http://localhost:3000/admin/register`
2. **Créez un compte** (email + mot de passe)
3. **Connectez-vous**
4. **Dashboard:** Voir les statistiques
5. **Ajouter un Code:** Créer une nouvelle loi
6. **Ajouter un Article:** Créer un nouvel article juridique

---

## 📁 Fichiers Important

| Fichier | Contenu |
|---------|---------|
| `.env.local` | **À CRÉER** - URL API (crucial!) |
| `README.md` | Vue générale complète |
| `INSTALLATION.md` | Guide d'installation détaillé |
| `ARCHITECTURE.md` | Détails techniques |
| `PROJECT_SUMMARY.md` | Résumé du projet |

---

## 🔧 Configuration API

### URL de Base

La plateforme a besoin d'**une seule configuration**: l'URL de base de votre API.

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
```

### Exemple avec Différentes Configurations

```env
# Développement local
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api

# Serveur de staging
NEXT_PUBLIC_API_BASE_URL=https://api-staging.example.com

# Production
NEXT_PUBLIC_API_BASE_URL=https://api.example.com
```

### Vérifier la Connexion

```bash
# Depuis le terminal
curl http://localhost:5000/api/codes

# Ou depuis l'interface
1. Allez à http://localhost:3000/config
2. Entrez l'URL
3. Cliquez "Tester la connexion"
```

---

## 🏗️ Structure du Projet

```
madalaws/                    # Racine du projet
├── app/                    # Pages et routes
│   ├── page.tsx           # Accueil
│   ├── explorer/          # Explorateur public
│   ├── favorites/         # Favoris publics
│   ├── articles/          # Pages articles
│   ├── admin/             # Pages admin (login, register, etc.)
│   ├── config/            # Configuration API
│   └── layout.tsx         # Layout principal
├── components/            # Composants réutilisables
├── lib/
│   ├── api/               # Client API
│   └── types.ts           # Types TypeScript
├── public/                # Assets (images, icons)
├── .env.local            # **À créer** avec URL API
├── package.json
└── DOCUMENTATION
    ├── README.md
    ├── INSTALLATION.md
    ├── ARCHITECTURE.md
    └── PROJECT_SUMMARY.md
```

---

## 🚀 Déploiement

### Pour Vercel (Recommandé)

```bash
# Installer Vercel CLI
npm install -g vercel

# Déployer
vercel

# Production
vercel --prod
```

Vercel détecte automatiquement Next.js et configure tout.

### Pour Self-Hosted

```bash
# Build
pnpm build

# Démarrer en production
NODE_ENV=production pnpm start
```

---

## 🆘 Dépannage Rapide

### Erreur: "Failed to fetch"

```
Solution: L'API n'est pas accessible
1. Vérifiez que votre API tourne
2. Vérifiez l'URL dans .env.local
3. Testez avec: curl http://votre-api/codes
```

### Erreur: "Port 3000 is in use"

```bash
# Utiliser un autre port
PORT=3001 pnpm dev
```

### Thème ne sauvegarde pas

```
Solution: localStorage doit être enabled
1. Vérifiez que localStorage fonctionne (DevTools)
2. Essayez incognito/private mode
```

### API retourne 401 après login

```
Solution: Token JWT invalide
1. Vérifiez que l'API retourne un token
2. Vérifiez que la clé secrète JWT est correcte
```

---

## 📞 Aide & Documentation

### Lecture Recommandée

1. **D'abord:** Ce fichier (GETTING_STARTED.md)
2. **Puis:** README.md (vue générale)
3. **Configuration:** SETUP.md
4. **Technique:** ARCHITECTURE.md
5. **Déploiement:** INSTALLATION.md

### Points Clés

- **Une seule configuration:** `NEXT_PUBLIC_API_BASE_URL`
- **Aucun backend requis:** Consomme une API externe
- **Prêt pour production:** Code optimisé et compilé
- **Documentation complète:** Tout est documenté

---

## ✅ Checklist de Démarrage

- [ ] Créer `.env.local` avec `NEXT_PUBLIC_API_BASE_URL`
- [ ] Lancer `pnpm install` (si nécessaire)
- [ ] Lancer `pnpm dev`
- [ ] Tester `/config` pour vérifier la connexion API
- [ ] Visiter `/explorer` et voir les lois
- [ ] Créer un compte admin à `/admin/register`
- [ ] Ajouter des données via le dashboard admin

---

## 🎉 Bienvenue!

Vous avez maintenant une **plateforme complète et moderne** pour consulter et gérer les lois de Madagascar.

### Prochaines Actions

1. **Immédiat:** Configurez l'URL API et testez
2. **Court terme:** Explorez les features
3. **Moyen terme:** Personnalisez selon vos besoins
4. **Déploiement:** Publiez sur Vercel ou votre serveur

**Bonne exploration! 🚀**

---

**Version:** 1.0.0  
**Tech:** Next.js 16 + React 19 + TypeScript + Tailwind CSS  
**Status:** ✅ Production Ready
