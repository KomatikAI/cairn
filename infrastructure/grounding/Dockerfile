# Grounding service image (build from infrastructure/ project directory)
#
#   docker compose --project-directory infrastructure \
#     -f infrastructure/compose.yaml \
#     -f seeds/002-homelessness-la/config/compose.override.yaml \
#     -f seeds/002-homelessness-la/config/compose.dry-run.yaml build grounding
#
# Compose service must use:
#   build:
#     context: .
#     dockerfile: grounding/Dockerfile
#
# Why context is the infrastructure dir (not ./grounding): package.json declares
# @komatik/shared as "file:../shared". A ./grounding context puts ../shared
# outside the build context, so `npm install` leaves a dangling symlink and the
# runtime ESM import of @komatik/shared/supabase fails with ERR_MODULE_NOT_FOUND.
# Building from infrastructure/ lets us COPY shared in and wire it into
# node_modules/@komatik/shared. Mirrors event-processor/Dockerfile.

FROM node:22-alpine

WORKDIR /app

RUN apk add --no-cache bash curl

COPY shared /shared
COPY grounding/package.json grounding/package-lock.json* ./
RUN cd /shared && npm ci --omit=dev
RUN npm ci --omit=dev \
    && rm -rf node_modules/@komatik \
    && mkdir -p node_modules/@komatik \
    && cp -a /shared node_modules/@komatik/shared

COPY grounding/ .

USER node

ENV NODE_ENV=production

CMD ["node", "index.js"]
