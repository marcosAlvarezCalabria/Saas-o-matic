FROM node:22-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable && corepack prepare pnpm@10.22.0 --activate

WORKDIR /app

FROM base AS build

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY api api

RUN pnpm install --frozen-lockfile --filter @saas-o-matic/api...

RUN pnpm --filter @saas-o-matic/api build
RUN pnpm --filter @saas-o-matic/api deploy --prod --legacy /app/production

FROM node:22-slim AS runtime

ENV NODE_ENV=production
ENV PORT=3000
ENV DATABASE_PATH=/data/saas-o-matic.sqlite

WORKDIR /app

COPY --from=build --chown=node:node /app/api/dist ./dist
COPY --from=build --chown=node:node /app/production/package.json ./package.json
COPY --from=build --chown=node:node /app/production/node_modules ./node_modules

RUN mkdir -p /data && chown node:node /data

USER node

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/health').then((response) => { if (!response.ok) process.exit(1); }).catch(() => process.exit(1));"

CMD ["node", "dist/main.js"]
