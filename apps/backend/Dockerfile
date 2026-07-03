# Production build for the Medusa backend (API + built admin dashboard).
#
# `medusa build` compiles the server AND builds the admin dashboard into
# static assets (no Vite dev server / HMR at runtime — see infra/docker-
# compose.yml's comments on why that matters for the single-port nginx
# setup), emitting a self-contained app at .medusa/server that needs its own
# `npm install` (it ships a package.json but not node_modules).
#
# Build from the REPO ROOT (npm workspaces need the root package.json +
# lockfile to resolve devDependencies like `vite`/`typescript` that `medusa
# build` needs):
#   docker build -f apps/backend/Dockerfile -t tlcv-backend .

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
RUN npm install --no-audit --no-fund

# --- build: compile the server + build the admin dashboard ------------------
FROM node:20-slim AS build
WORKDIR /workspace
COPY --from=deps /workspace/node_modules ./node_modules
COPY --from=deps /workspace/apps/backend/node_modules ./apps/backend/node_modules
COPY . .
WORKDIR /workspace/apps/backend
ENV NODE_ENV=production
RUN npx medusa build

# --- production: fresh, minimal install of only .medusa/server's own deps ---
FROM node:20-slim AS production
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /workspace/apps/backend/.medusa/server ./
RUN npm install --omit=dev --no-audit --no-fund

EXPOSE 9000

HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=5 \
  CMD node -e "fetch('http://localhost:9000/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["npm", "run", "start"]
