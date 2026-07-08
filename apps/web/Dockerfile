# Production build for the Nuxt web app (SSR served by the built Nitro server).
#
# Same npm-workspace pattern as apps/backend/Dockerfile — the repo's package
# manager is npm (root package-lock.json); the old pnpm variant of this file
# required a pnpm-lock.yaml that is no longer maintained.
#
# `nuxt build` emits a self-contained .output (deps bundled inside), so the
# production stage needs no node_modules install at all.
#
# Build from the REPO ROOT (npm workspaces need the root package.json +
# lockfile):
#   docker build -f apps/web/Dockerfile -t tlcv-web .

# --- deps: install the whole npm workspace ----------------------------------
FROM node:20-slim AS deps
WORKDIR /workspace
# Some transitive deps fall back to source builds if no prebuilt binary
# matches this platform/libc.
RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ \
    && rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json ./
COPY apps/backend/package.json ./apps/backend/
COPY apps/storefront/package.json ./apps/storefront/
COPY apps/web/package.json ./apps/web/
RUN npm install --no-audit --no-fund \
    || npm install --no-audit --no-fund --legacy-peer-deps

# --- build: nuxt build -> self-contained .output -----------------------------
FROM node:20-slim AS build
WORKDIR /workspace
COPY --from=deps /workspace/node_modules ./node_modules
COPY --from=deps /workspace/apps/web/node_modules ./apps/web/node_modules
COPY . .
WORKDIR /workspace/apps/web
ENV NODE_ENV=production
RUN npm run build

# --- production: only the Nitro output ---------------------------------------
FROM node:20-slim AS production
WORKDIR /app
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000
COPY --from=build /workspace/apps/web/.output ./

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=5 \
  CMD node -e "fetch('http://localhost:3000/').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "server/index.mjs"]
