# Willow

A collaborative block editor. Multiple people edit the same document at once, with cursor
presence, nested pages, sharing, and version history.

## Stack

| Layer | Choice |
|---|---|
| Monorepo | Turborepo + pnpm workspaces |
| API | NestJS, GraphQL (Apollo), Prisma 7 with the `pg` driver adapter |
| Database | PostgreSQL |
| Collaboration | Yjs CRDTs over a Hocuspocus WebSocket server |
| Editor | Tiptap 3 / ProseMirror |
| App | React 19, Vite, TanStack Query, Tailwind v4, Base UI |
| Marketing site | Next.js |
| File storage | S3-compatible (Cloudflare R2) |

## Layout

```
apps/
  api/       NestJS GraphQL API + Hocuspocus collaboration server
  web/       The editor application (Vite SPA)
  landing/   Marketing site (Next.js)
packages/    Shared TypeScript and lint config
```

## Running locally

Requires Node 24+, pnpm 11+, and Docker for Postgres.

```sh
pnpm install
docker compose up -d

cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env

pnpm --filter api exec prisma migrate dev
pnpm dev
```

- API — http://localhost:3000 (GraphQL at `/graphql`)
- Collaboration — ws://localhost:1234
- App — http://localhost:3001

The API listens on **two ports**: HTTP for GraphQL and REST, and a separate WebSocket port for
Hocuspocus. Both must be reachable from the browser.

Authentication is a development stand-in — `POST /auth/dev-login` returns a JWT for a seeded
user. Google and Apple OAuth are intentionally not built yet.

## Deploying

### API → Fly.io

```sh
cd apps/api
fly launch --no-deploy      # or: fly apps create willow-api
fly secrets set DATABASE_URL="..." JWT_SECRET="..." WEB_ORIGIN="https://your-app.vercel.app"
fly secrets set STORAGE_ENDPOINT="..." STORAGE_BUCKET="..." \
  STORAGE_ACCESS_KEY_ID="..." STORAGE_SECRET_ACCESS_KEY="..." \
  STORAGE_PUBLIC_URL_BASE="..." STORAGE_REGION="auto"
fly deploy
```

`fly.toml` exposes HTTP on 443 and the collaboration WebSocket on **8443**, because Fly cannot
route two services through the same external port. Migrations run automatically on deploy via
`release_command`.

**The app is pinned to a single machine** (`min_machines_running = 1`,
`auto_stop_machines = "off"`). Hocuspocus keeps each document in memory on the instance that
loaded it, so two people routed to different machines would not see each other's edits.
Scaling past one machine requires `@hocuspocus/extension-redis` and a Redis instance.

### App → Vercel

Set the project's **Root Directory** to `apps/web`, then add:

```
VITE_API_URL     = https://willow-api.fly.dev
VITE_COLLAB_URL  = wss://willow-api.fly.dev:8443
```

Both are inlined at build time, so changing them needs a redeploy. `vercel.json` rewrites all
paths to `index.html` so client-side routes survive a hard refresh.

### Database

Any managed Postgres works — Neon and Supabase are the usual choices. Point `DATABASE_URL` at
it and `release_command` applies migrations on the next deploy.

## Scripts

```sh
pnpm dev           # all apps
pnpm build         # all apps
pnpm lint
pnpm check-types
```
