# MadaLaws - Guide de Configuration

## 🚀 Démarrage Rapide

### 1. Configuration de l'URL API

La plateforme MadaLaws consomme une API basée sur la spécification OpenAPI 3.0.3. Vous devez fournir l'URL de base de l'API.

#### Option A: Variable d'Environnement

Créez un fichier `.env.local` à la racine du projet:

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
```

Remplacez `http://localhost:5000/api` par l'URL réelle de votre serveur API.

#### Option B: Configuration via l'Interface

1. Démarrez l'application: `pnpm dev`
2. Accédez à `http://localhost:3000/config`
3. Entrez votre URL API et testez la connexion

### 2. Structure du Projet

```
├── app/
│   ├── layout.tsx              # Layout principal avec Providers
│   ├── page.tsx                # Page d'accueil
│   ├── providers.tsx           # Providers (Theme, React Query)
│   ├── explorer/               # Pages de consultation
│   ├── favorites/              # Page des favoris
│   ├── admin/                  # Pages d'administration
│   │   ├── login/
│   │   ├── register/
│   │   ├── dashboard/
│   │   └── hierarchy/          # Gestion de la hiérarchie
│   └── config/                 # Configuration API
├── lib/
│   ├── api/
│   │   ├── client.ts          # Client API avec axios
│   │   └── hooks.ts           # React Query hooks
│   ├── types.ts               # Types TypeScript pour l'OAS
│   └── utils.ts
├── components/
│   ├── header.tsx             # Header avec toggle thème
│   ├── theme-toggle.tsx       # Bouton de basculement thème
│   └── hierarchy-navigator.tsx # Navigateur hiérarchique
└── public/
```

## 🔌 API Client

### Initialisation

L'API client s'initialise automatiquement avec l'URL de base:

```typescript
import { initializeAPIClient, getAPIClient } from '@/lib/api/client'

// Initialiser
const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api'
initializeAPIClient(baseURL)

// Utiliser
const client = getAPIClient()
const codes = await client.getCodes()
```

### Authentification JWT

Les tokens sont automatiquement stockés en localStorage et inclus dans les en-têtes:

```typescript
import { useLoginAdmin } from '@/lib/api/hooks'

const { mutateAsync: login } = useLoginAdmin()
const response = await login({ email, password })
const client = getAPIClient()
client.setToken(response.token)
```

## 🎨 Thèmes

La plateforme supporte les thèmes clair et sombre avec `next-themes`:

- **Basculement Automatique**: Détecte les préférences système
- **Basculement Manuel**: Bouton dans le header
- **Persistance**: Sauvegardé en localStorage

## 📊 Fonctionnalités

### Public (Sans authentification)

- ✅ Navigation hiérarchique (Codes → Livres → Titres → Chapitres → Sections → Articles)
- ✅ Lecture des articles complets
- ✅ Recherche par article
- ✅ Système de favoris (localStorage)
- ✅ Thèmes clair/sombre

### Admin (Authentification requise)

- ✅ CRUD complet pour tous les niveaux hiérarchiques
- ✅ Gestion des codes, livres, titres, chapitres, sections, articles
- ✅ Suppression en cascade
- ✅ Dashboard avec statistiques

## 🔐 Sécurité

- Tokens JWT stockés en localStorage
- Redirection automatique vers login si token expiré (401)
- Routes protégées côté client
- CORS géré par l'API backend

## 🛠️ Développement

### Démarrer le serveur de développement

```bash
pnpm dev
```

L'application sera accessible sur `http://localhost:3000`

### Routes Principales

- `/` - Page d'accueil
- `/explorer` - Explorateur de lois
- `/favorites` - Mes favoris
- `/config` - Configuration API
- `/admin/login` - Connexion admin
- `/admin/register` - Inscription admin
- `/admin/dashboard` - Tableau de bord admin
- `/admin/hierarchy` - Gestion de la hiérarchie

## 📝 Spécification API

L'API suit la spécification OpenAPI 3.0.3 avec les endpoints suivants:

### Routes Publiques

- `GET /codes` - Liste de tous les codes
- `GET /codes/{id}` - Détails d'un code
- `GET /books`, `/titles`, `/chapters`, `/sections`, `/articles` - Liste par niveau
- `GET /articles/by-chapter/{chapterId}` - Articles d'un chapitre
- `GET /articles/by-section/{sectionId}` - Articles d'une section

### Routes Admin

- `POST /admin/auth/register` - Inscription
- `POST /admin/auth/login` - Connexion
- `POST/PUT/DELETE /admin/{resource}` - CRUD pour chaque niveau

## ⚡ Performance

- React Query pour la mise en cache des données
- Lazy loading des hiérarchies
- Images optimisées
- Code splitting automatique

## 🌐 Localisation

- Interface en français
- Format de dates adapté (DD/MM/YYYY)
- Support ARIA pour l'accessibilité

## 📞 Support

Pour les questions ou problèmes:
1. Vérifiez que l'URL API est correcte
2. Testez la connexion via `/config`
3. Vérifiez les logs du serveur API
4. Consultez la documentation OpenAPI

---

**Version**: 1.0.0  
**Dernière mise à jour**: 2026-05-06
