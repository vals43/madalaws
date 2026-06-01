# MadaLaws - Plateforme Numérique de Consultation des Lois de Madagascar

Une plateforme web moderne et complète pour centraliser, organiser et consulter l'ensemble des lois de Madagascar selon une structure hiérarchique avancée.

## 📋 Caractéristiques Principales

- **Navigation Hiérarchique Intuitive** : Explorez les lois de Code → Livre → Titre → Chapitre → Section → Article
- **Système de Favoris** : Sauvegardez vos articles préférés (stockage local)
- **Thèmes Clair/Sombre** : Support complet des thèmes avec détection automatique
- **Interface Admin Sécurisée** : Gestion CRUD complète de toute la hiérarchie juridique
- **Recherche Avancée** : Recherchez rapidement par numéro ou contenu
- **API RESTful** : Basée sur OpenAPI 3.0.3 avec authentification JWT

## 🚀 Démarrage Rapide

### 1. Configuration de l'URL API

**Option A - Via Variable d'Environnement :**

Créez un fichier `.env.local` à la racine :
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
```

Remplacez l'URL par votre serveur API.

**Option B - Via l'Interface :**

1. Démarrez l'app : `pnpm dev`
2. Allez à `http://localhost:3000/config`
3. Entrez l'URL et testez la connexion

### 2. Démarrage du Serveur

```bash
# Installation des dépendances
pnpm install

# Démarrage en développement
pnpm dev

# Build de production
pnpm build
pnpm start
```

L'application sera accessible sur `http://localhost:3000`

## 📖 Utilisation

### Pour les Utilisateurs Publics

1. **Accueil** (`/`) - Présentation générale
2. **Explorateur** (`/explorer`) - Navigation hiérarchique et recherche
3. **Mes Favoris** (`/favorites`) - Articles sauvegardés
4. **Détail Article** (`/articles/[id]`) - Lecture complète avec contexte

### Pour les Administrateurs

1. **Connexion** (`/admin/login`) - Accès au panel admin
2. **Inscription** (`/admin/register`) - Créer un compte admin
3. **Tableau de Bord** (`/admin/dashboard`) - Vue d'ensemble et statistiques
4. **Gestion Codes** (`/admin/codes`) - CRUD des codes juridiques
5. **Gestion Articles** (`/admin/articles`) - Gestion complète des articles
6. **Gestion Hiérarchie** (`/admin/hierarchy`) - Organisation générale

## 🏗️ Structure du Projet

```
madalaws/
├── app/                    # Routes et pages
│   ├── layout.tsx         # Layout principal
│   ├── page.tsx           # Accueil
│   ├── explorer/          # Explorateur
│   ├── favorites/         # Favoris
│   ├── articles/          # Pages articles
│   ├── admin/             # Pages admin
│   │   ├── login/
│   │   ├── register/
│   │   ├── dashboard/
│   │   ├── codes/
│   │   ├── articles/
│   │   └── hierarchy/
│   ├── config/            # Configuration API
│   └── providers.tsx      # Providers (Theme, Query)
├── components/            # Composants réutilisables
│   ├── header.tsx
│   ├── theme-toggle.tsx
│   ├── breadcrumb.tsx
│   ├── hierarchy-navigator.tsx
│   └── admin/            # Composants admin
│       └── code-form.tsx
├── lib/
│   ├── api/
│   │   ├── client.ts     # Client API Axios
│   │   └── hooks.ts      # React Query hooks
│   ├── types.ts          # Types TypeScript
│   └── utils.ts
├── public/               # Assets statiques
└── SETUP.md             # Guide de configuration
```

## 🔐 Authentification

### Login Admin

```bash
POST /admin/auth/login
{
  "email": "admin@example.com",
  "password": "password"
}
```

Response:
```json
{
  "token": "eyJhbGc...",
  "user": {
    "id": "uuid",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

Le token est automatiquement sauvegardé en localStorage et utilisé pour les requêtes authentifiées.

## 📡 API Client

### Initialisation

```typescript
import { initializeAPIClient, getAPIClient } from '@/lib/api/client'

// Initialiser (fait automatiquement au chargement)
initializeAPIClient(process.env.NEXT_PUBLIC_API_BASE_URL)

// Utiliser
const client = getAPIClient()
const codes = await client.getCodes()
```

### React Query Hooks

```typescript
import { useCodes, useArticles, useCreateArticle } from '@/lib/api/hooks'

// Lecture
const { data: codes, isLoading } = useCodes()

// Création
const createArticleMutation = useCreateArticle()
await createArticleMutation.mutateAsync({
  number: 'Article 1',
  content: 'Contenu...',
  chapterId: 'chapter-uuid'
})
```

## 🎨 Thèmes

La plateforme utilise `next-themes` pour la gestion des thèmes :

- **Automatique** : Détecte les préférences système
- **Manuel** : Bouton toggle dans le header
- **Persistance** : Sauvegardé en localStorage

Couleurs:
- **Clair** : Fond blanc, texte gris foncé
- **Sombre** : Fond noir (#171717), texte gris clair
- **Primaire** : Bleu (#3b82f6)

## 📊 Hiérarchie Juridique

```
Code (niveau 1)
├── Livre (niveau 2)
│   ├── Titre (niveau 3)
│   │   ├── Chapitre (niveau 4)
│   │   │   ├── Section (niveau 5)
│   │   │   │   └── Article (niveau 6)
│   │   │   └── Article (sans section)
```

### Règles

- ✅ Tous les niveaux sont optionnels
- ✅ Articles peuvent être sous chapitre OU section
- ✅ Hiérarchie flexible et evolutive
- ✅ Suppression en cascade

## ⚙️ Configuration Avancée

### Variables d'Environnement

```env
# API
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api

# Next.js (auto-configuré)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Tailwind CSS

Configuration personnalisée avec :
- Coleurs sémantiques (background, foreground, etc.)
- Police serif pour le contenu juridique
- Support du mode sombre natif

## 🔧 Développement

### Ajouter une nouvelle page

1. Créer le fichier dans `app/[section]/page.tsx`
2. Importer `Header` si c'est une page publique
3. Utiliser les hooks React Query pour les données

### Ajouter un nouveau formulaire

1. Créer le composant dans `components/admin/`
2. Utiliser les mutations React Query
3. Gérer les erreurs et loading states

### Ajouter une route API

Les routes API ne sont PAS nécessaires - l'app consomme directement une API externe.

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: `sm`, `md`, `lg`, `xl`
- Tests sur tous les appareils
- Navigation adaptée à l'écran

## ♿ Accessibilité

- Sémantique HTML correcte
- ARIA labels pour les éléments interactifs
- Contraste des couleurs conforme WCAG
- Navigation au clavier
- Screen reader compatible

## 🐛 Dépannage

### API non accessible

1. Vérifiez l'URL dans `/config`
2. Testez la connexion
3. Vérifiez que le serveur est en cours d'exécution

### Token expiré

- Redirection automatique vers login
- Nettoyage du token en localStorage

### Thème non persisté

- Vérifiez que localStorage est enabled
- Vérifiez la valeur de la clé `theme`

## 📚 Documentation

- [OpenAPI Spec](SETUP.md#spécification-api)
- [API Client](lib/api/client.ts)
- [React Query Hooks](lib/api/hooks.ts)
- [Types TypeScript](lib/types.ts)

## 📝 License

Proprietary - Madagascar Ministry of Justice

## 🤝 Support

Pour les problèmes ou questions, consultez :
1. La documentation technique (SETUP.md)
2. Les logs du navigateur (DevTools)
3. Les logs du serveur API

---

**Version:** 1.0.0  
**Dernière mise à jour:** 6 mai 2026  
**Tech Stack:** Next.js 16 + React 19 + TypeScript + Tailwind CSS
