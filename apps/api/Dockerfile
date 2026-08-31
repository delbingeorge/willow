FROM node:24-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app

FROM base AS manifests
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/
COPY apps/web/package.json ./apps/web/
COPY apps/landing/package.json ./apps/landing/
COPY packages/eslint-config/package.json ./packages/eslint-config/
COPY packages/shared/package.json ./packages/shared/
COPY packages/typescript-config/package.json ./packages/typescript-config/
COPY packages/ui/package.json ./packages/ui/

FROM manifests AS build
RUN pnpm install --frozen-lockfile --filter api...
COPY apps/api ./apps/api
RUN pnpm --filter api exec prisma generate
RUN pnpm --filter api run build

FROM manifests AS deps
RUN pnpm install --frozen-lockfile --prod --filter api...

FROM base AS runtime
ENV NODE_ENV=production
ENV PORT=3000
ENV COLLAB_PORT=1234

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=build /app/apps/api/dist ./apps/api/dist
COPY --from=build /app/apps/api/prisma ./apps/api/prisma
COPY --from=build /app/apps/api/package.json ./apps/api/package.json

WORKDIR /app/apps/api
EXPOSE 3000 1234
CMD ["node", "dist/main.js"]
