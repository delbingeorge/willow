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
- Collaboration — ws://localhost:3000/collaboration
- App — http://localhost:3001

The API listens on **one port**. GraphQL and REST are served over HTTP; the Yjs collaboration
WebSocket is mounted on the same server at `/collaboration`.

Authentication is a development stand-in — `POST /auth/dev-login` returns a JWT for a seeded
user. Google and Apple OAuth are intentionally not built yet.

## Deploying

### API → Render

The API is a single Docker service on one port: GraphQL and REST over HTTP, and the Yjs
collaboration WebSocket at **`/collaboration`** on the same port.

1. Create a Postgres database at [Neon](https://neon.tech) and copy the pooled connection string.
2. Create an R2 bucket and an API token with Object Read & Write.
3. In Render: **New → Blueprint**, point it at this repo. `render.yaml` defines the service.
4. Fill in the secrets Render marks as required: `DATABASE_URL`, `WEB_ORIGIN`, and the
   `STORAGE_*` values. `JWT_SECRET` is generated for you.
5. Apply migrations once from your machine, against the same database:

```sh
DATABASE_URL="<neon-url>" pnpm --filter api exec prisma migrate deploy
```

Render's free plan has no pre-deploy hook, so migrations are a manual step. Re-run that command
whenever you add a migration.

**The free plan sleeps after ~15 minutes idle** and cold-starts slowly. Live collaboration
reconnects once the service wakes, but the first request after a sleep is slow.

### App → Cloudflare Pages

**Workers & Pages → Create → Pages → Connect to Git.**

| Setting | Value |
|---|---|
| Build command | `pnpm install --frozen-lockfile && pnpm --filter web run build` |
| Build output directory | `apps/web/dist` |
| Root directory | *(leave empty — pnpm needs the workspace root)* |

Environment variables:

```
NODE_VERSION     = 24
VITE_API_URL     = https://willow-api.onrender.com
VITE_COLLAB_URL  = wss://willow-api.onrender.com/collaboration
```

Both `VITE_*` values are inlined at build time, so changing one needs a redeploy.
`public/_redirects` rewrites every path to `index.html` so client-side routes survive a refresh.

### Landing → a second Pages project

Same flow, with `pnpm --filter landing run build` and an output directory of `apps/landing/out`.
The site is a static export (`output: "export"`), so it needs no server runtime.

### After the first deploy

Set `WEB_ORIGIN` on Render to the app's real URL, or CORS will reject every request.

## Scripts

```sh
pnpm dev           # all apps
pnpm build         # all apps
pnpm lint
pnpm check-types
```
