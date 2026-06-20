# Scheduler image (build from infrastructure/ project directory)
#
#   docker compose --project-directory infrastructure \
#     -f infrastructure/compose.yaml build scheduler
#
# Compose service must use:
#   build:
#     context: .
#     dockerfile: scheduler/Dockerfile
#
# Why context is the infrastructure dir (not ./scheduler): package.json declares
# @komatik/shared as "file:../shared". A ./scheduler context puts ../shared
# outside the build context, so `npm install` leaves a dangling symlink and the
# runtime ESM import of @komatik/shared/supabase fails with ERR_MODULE_NOT_FOUND.
# Building from infrastructure/ lets us COPY shared in and wire it into
# node_modules/@komatik/shared. Mirrors event-processor/Dockerfile.

FROM node:22-alpine

WORKDIR /app

RUN apk add --no-cache bash curl

COPY shared /shared
COPY scheduler/package.json scheduler/package-lock.json* ./
RUN cd /shared && npm ci --omit=dev
RUN npm ci --omit=dev \
    && rm -rf node_modules/@komatik \
    && mkdir -p node_modules/@komatik \
    && cp -a /shared node_modules/@komatik/shared

COPY scheduler/ .

USER node

ENV NODE_ENV=production

HEALTHCHECK --interval=60s --timeout=5s --retries=3 --start-period=30s \
  CMD node -e "fetch(process.env.GATEWAY_URL + '/health').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"

CMD ["node", "index.js"]
