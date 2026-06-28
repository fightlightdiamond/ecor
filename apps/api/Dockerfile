# Production image cho NestJS API (apps/api) — build từ thư mục gốc monorepo.
#   docker build -f apps/api/Dockerfile -t tlcv-api .
# (build context = repo root để có pnpm-workspace + lockfile)

FROM node:20-bookworm-slim AS build
WORKDIR /repo
RUN corepack enable
# 1) Cài deps (cache theo manifest). --ignore-scripts để hoãn prisma generate
#    tới khi đã copy schema.
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY apps/api/package.json ./apps/api/
COPY apps/web/package.json ./apps/web/
RUN pnpm install --frozen-lockfile --ignore-scripts --filter @thang-long/api...
# 2) Copy source API + sinh client + build
COPY apps/api ./apps/api
RUN pnpm --filter @thang-long/api exec prisma generate \
 && pnpm --filter @thang-long/api build \
 && pnpm prune --prod || true

FROM node:20-bookworm-slim AS runtime
WORKDIR /repo
ENV NODE_ENV=production
ENV PORT=3001
RUN corepack enable
# Mang nguyên node_modules (giữ symlink pnpm + Prisma engine) + artefacts cần chạy
COPY --from=build /repo/node_modules ./node_modules
COPY --from=build /repo/package.json /repo/pnpm-workspace.yaml ./
COPY --from=build /repo/apps/api/node_modules ./apps/api/node_modules
COPY --from=build /repo/apps/api/dist ./apps/api/dist
COPY --from=build /repo/apps/api/prisma ./apps/api/prisma
COPY --from=build /repo/apps/api/resources ./apps/api/resources
COPY --from=build /repo/apps/api/package.json ./apps/api/
WORKDIR /repo/apps/api
EXPOSE 3001
# Đẩy schema + chạy (db push idempotent; bỏ nếu deploy quản schema riêng).
CMD ["sh", "-c", "node node_modules/prisma/build/index.js db push --skip-generate || true; node dist/main.js"]
