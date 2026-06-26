# Alpha Oméga Digital®

Site web officiel premium d'Alpha Oméga Digital®, agence digitale spécialisée dans le développement sur mesure de sites web, applications, plateformes SaaS et automatisations.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/alpha-omega-digital run dev` — run the frontend (port 21028)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, Tailwind CSS, Framer Motion, Wouter
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/alpha-omega-digital/src/pages/Home.tsx` — Page d'accueil principale (hero, services, processus, portfolio, footer…)
- `artifacts/alpha-omega-digital/src/pages/Questionnaire.tsx` — Wizard 14 étapes
- `artifacts/alpha-omega-digital/src/pages/Estimation.tsx` — Page d'estimation automatique
- `artifacts/alpha-omega-digital/src/pages/RendezVous.tsx` — Page de prise de rendez-vous
- `artifacts/alpha-omega-digital/src/components/layout/` — Navbar et Footer
- `lib/api-spec/openapi.yaml` — Contrat API (source of truth)
- `lib/db/src/schema/` — Schémas Drizzle (projects, appointments, contacts)
- `artifacts/api-server/src/routes/` — Routes Express (projects, appointments, contacts, stats)

## Architecture decisions

- Site vitrine + wizard questionnaire 14 étapes → stocké en base via API
- Estimation automatique calculée côté serveur selon type/budget/complexité du projet
- Prise de RDV en base de données avec statut pending/confirmed/cancelled
- Stats dynamiques (GET /api/stats) avec baseline + projets réels en base
- Identité visuelle: fond blanc (#FFFFFF/#FAFAFA), accent vert #7BC043, typographie Sora/Inter

## Product

- **/** — Site marketing complet: Hero, Expertises, Processus, Portfolio, Technologies, Footer
- **/questionnaire** — Wizard 14 étapes pour qualifier les prospects et créer un dossier CRM
- **/estimation** — Affichage de l'estimation automatique (3 niveaux: Essentiel, Pro, Premium)
- **/rendez-vous** — Booking de rendez-vous (visio, téléphone, présentiel)

## User preferences

- Langue française dans l'interface et les contenus
- Palette: fond blanc, texte #111111, accent #7BC043
- No dark mode — site entièrement en mode clair premium
- Typographie: Sora (titres) + Inter (corps)

## Gotchas

- `SiAmazonwebservices` n'existe pas dans react-icons v5 — utiliser une alternative textuelle pour AWS dans la grille technologies
- Les Google Fonts `@import url()` doivent être en toute première ligne de `index.css` avant `@import "tailwindcss"`
- Express 5: wildcard routes doivent être `/{*splat}`, paramètres optionnels `{/:id}`
- Toujours parser `req.params.id` avec `Array.isArray` guard avant `parseInt`

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
- Contact: Adinkpo Amour Dominique Koffi — Alphaomegadigital35@gmail.com — +229 01 67 72 80 61
