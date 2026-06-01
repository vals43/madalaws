# Architecture MadaLaws

## Vue d'Ensemble

MadaLaws est une application **Next.js 16** consommant une **API RESTful** basée sur l'OpenAPI 3.0.3. L'architecture est construite autour de principes modernes : séparation des responsabilités, réutilisabilité des composants, et gestion d'état centralisée avec React Query.

## Stack Technologique

### Frontend
- **Framework:** Next.js 16 avec App Router
- **Runtime:** React 19 + TypeScript
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **State Management:** React Query v5 (TanStack)
- **Thème:** next-themes (dark/light mode)
- **HTTP Client:** Axios

### Backend (Consommé)
- OpenAPI 3.0.3 compliant REST API
- JWT Bearer Token Authentication
- CORS enabled

## Architecture en Couches

```
┌─────────────────────────────────────┐
│     Pages & Layouts (App Router)    │
│  (Consommation des données)         │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│    Components & UI (shadcn/ui)      │
│  (Présentation et interaction)      │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│     React Query Hooks Layer         │
│  (Caching, synchronization)         │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│     API Client (Axios Wrapper)      │
│  (Communication HTTP)               │
└──────────────┬──────────────────────┘
               │
       ┌───────▼────────┐
       │  External API  │
       │  (RESTful)     │
       └────────────────┘
```

## Flux de Données

### Lecture de Données (Query)

```
Page Component
    │
    ├─→ useQuery Hook (lib/api/hooks.ts)
    │       │
    │       ├─→ React Query Cache
    │       │
    │       └─→ getAPIClient().getData()
    │               │
    │               └─→ axios.get() → API
    │
    └─→ Render avec data/loading/error
```

### Écriture de Données (Mutation)

```
User Action (Form Submit)
    │
    ├─→ useMutation Hook
    │       │
    │       ├─→ getAPIClient().createData()
    │       │       │
    │       │       └─→ axios.post() → API
    │       │
    │       └─→ onSuccess: Invalidate Queries
    │               │
    │               └─→ Auto-refetch & UI Update
    │
    └─→ Show Success/Error
```

## Modules Clés

### 1. API Client (`lib/api/client.ts`)

Wrapper singleton autour d'Axios avec :
- Configuration centralisée de l'URL de base
- Gestion automatique des tokens JWT
- Intercepteurs pour les erreurs 401
- Méthodes typées pour tous les endpoints

```typescript
class APIClient {
  // Public routes
  async getCodes() { ... }
  async getArticles() { ... }
  
  // Admin routes (require JWT)
  async createCode(data) { ... }
  async updateArticle(id, data) { ... }
  
  // Auth
  async loginAdmin(email, password) { ... }
}
```

### 2. React Query Hooks (`lib/api/hooks.ts`)

Hooks réutilisables pour chaque entité :

```typescript
// Queries
export function useCodes() { ... }
export function useArticle(id) { ... }

// Mutations
export function useCreateArticle() { ... }
export function useUpdateArticle() { ... }
export function useDeleteArticle() { ... }
```

**Features:**
- Caching automatique (5 min default)
- Invalidation intelligente
- Loading/error states gérés
- Retry automatique

### 3. Types TypeScript (`lib/types.ts`)

Génération manuelle basée sur l'OAS :

```typescript
interface Code {
  id: string
  name: string
  description: string
  books: BookLite[]
  createdAt: string
  updatedAt: string
}

interface Article {
  id: string
  number: string
  content: string
  sectionId?: string
  chapterId?: string
  section?: SectionLite
  chapter?: ChapterLite
}
```

### 4. Providers (`app/providers.tsx`)

Initialisation des providers globaux :
- `ThemeProvider` (next-themes)
- `QueryClientProvider` (React Query)

```typescript
export function Providers({ children }) {
  return (
    <ThemeProvider attribute="class">
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </ThemeProvider>
  )
}
```

## Routes et Navigations

### Routes Publiques (Sans Auth)

```
/                          Homepage
/explorer                  Explorateur avec hiérarchie
/articles/[id]            Détail d'un article
/favorites                Mes favoris sauvegardés
/config                   Configuration API (dev)
```

### Routes Admin (Authentifiées)

```
/admin/login              Connexion
/admin/register           Inscription
/admin/dashboard          Vue d'ensemble
/admin/codes              Gestion des codes
/admin/articles           Gestion des articles
/admin/hierarchy          Gestion hiérarchie
```

### Navigation Pattern

```typescript
// Server-side navigation (RSC)
router.push('/explorer')

// Next.js conventions
- Dynamic routes: /articles/[id]
- Auth protection via useRouter + token check
- Header sticky avec navigation
```

## Gestion de l'État

### Token JWT
- Stocké en `localStorage`
- Inclus automatiquement dans les headers
- Nettoyé sur erreur 401
- Persisté entre les rechargements

### Favoris (localStorage)
- Simple array d'IDs
- Stocké en JSON
- Consulté localement (pas d'API)

### React Query Cache
- Auto-managed invalidation
- Stale-while-revalidate pattern
- Refetch on focus/window refocus

## Authentification JWT

### Flow Login

```
1. User POST /admin/auth/login {email, password}
2. API Response: { token, user }
3. Client: localStorage.setItem('auth_token', token)
4. Client: axios default header Authorization: Bearer {token}
5. Redirect to /admin/dashboard
```

### Flow Logout

```
1. User clicks logout
2. Client: localStorage.removeItem('auth_token')
3. Client: delete axios default header Authorization
4. Redirect to /admin/login
```

### Token Expiration

```
1. Request with expired token
2. API Response: 401 Unauthorized
3. Interceptor catches 401
4. Redirect to /admin/login
5. User token cleared
```

## Performance Optimizations

### Caching Strategy

- **HTTP Caching:** React Query (5 min stale time)
- **Static Generation:** Pages pré-rendues au build
- **Dynamic Routes:** ISR pour `/articles/[id]`

### Bundle Optimization

- Code splitting automatic par route
- Tree-shaking des imports inutilisés
- Turbopack bundler (Next.js 16)

### UX Optimizations

- Skeleton loaders sur données lentes
- Debounce sur recherche
- Lazy load des hiérarchies
- Local storage pour favoris (instant)

## Gestion des Erreurs

### API Errors

```typescript
try {
  const data = await client.createArticle(...)
} catch (error) {
  // AxiosError with response
  const message = error.response?.data?.error
  setError(message)
}
```

### Network Errors

- Retry automatique (React Query)
- Fallback UI
- User-friendly messages

### Auth Errors

- 401 → Redirect login
- 403 → Forbidden message
- Token refresh (si implémenté)

## Extensibilité

### Ajouter une Nouvelle Entity

1. **Types** (`lib/types.ts`)
   ```typescript
   export interface MyEntity { ... }
   ```

2. **Hooks** (`lib/api/hooks.ts`)
   ```typescript
   export function useMyEntity() { ... }
   export function useCreateMyEntity() { ... }
   ```

3. **Client** (`lib/api/client.ts`)
   ```typescript
   async getMyEntity() { ... }
   async createMyEntity(data) { ... }
   ```

4. **Page** (`app/admin/my-entity/page.tsx`)
   ```typescript
   const { data } = useMyEntity()
   const mutation = useCreateMyEntity()
   // Component...
   ```

### Ajouter un Nouveau Formulaire

1. Créer composant dans `components/admin/`
2. Utiliser mutation hook
3. Gérer loading/error states
4. Invalidate queries on success

## Configuration Avancée

### Tailwind CSS

```typescript
// tailwind.config.ts
extend: {
  colors: {
    primary: '#3b82f6',
    destructive: '#ef4444',
  },
  fontFamily: {
    serif: ['Source Serif 4'],
    sans: ['Inter'],
  }
}
```

### next.config.mjs

```typescript
const nextConfig = {
  experimental: {
    // Optimizations
  },
  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
  }
}
```

## Monitoring & Debugging

### Console Logs

```typescript
console.log("[v0] Debug message:", data)
```

### Network Inspection

DevTools → Network tab
- Voir toutes les requêtes API
- Vérifier les tokens
- Inspecter les réponses

### React DevTools

- Profiler pour performance
- Component inspection
- Props/State debugging

## Déploiement

### Vercel (Recommended)

```bash
# Auto-detects Next.js
vercel deploy
```

### Self-Hosted

```bash
# Build
pnpm build

# Start
pnpm start

# Environment variables
export NEXT_PUBLIC_API_BASE_URL=https://api.example.com
```

---

**Documentation complète:** Voir README.md et SETUP.md
