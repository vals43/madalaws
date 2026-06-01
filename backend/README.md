# MadaLaws Backend

## Installation
1. `cd backend`
2. `npm install`
3. Créer la base : `createdb madalaws_db`
4. Copier `.env.example` → `.env` et ajuster
5. `npm run db:migrate`
6. `npm run db:seed`
7. `npm run dev`

## Compte admin par défaut
- Email : admin@madalaws.mg
- Mot de passe : admin123

## API
- Routes publiques : `/api/codes`, `/api/books`, `/api/titles`, `/api/chapters`, `/api/sections`, `/api/articles`
- Routes admin : `/api/admin/...` (JWT requis)