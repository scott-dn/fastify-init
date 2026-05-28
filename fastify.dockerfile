# ── Base ────────────────────────────────────────────────────────────────
FROM node:24.16.0-bookworm-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME/bin:$PATH"
RUN corepack enable
ENV CI=true
WORKDIR /app
COPY .husky/install.ts ./.husky/install.ts
# ─────────────────────────────────────────────────────────────────────────


# ── Dependencies (all, for build) ───────────────────────────────────────
FROM base AS build
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
COPY tsconfig.json tsconfig.build.json package.prod.json ./
COPY src ./src
RUN pnpm build
# ─────────────────────────────────────────────────────────────────────────


# ── Production dependencies only ────────────────────────────────────────
FROM base AS prod-deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile
# ─────────────────────────────────────────────────────────────────────────


# ── Runtime ─────────────────────────────────────────────────────────────
FROM node:24.16.0-bookworm-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production

# tini handles PID 1 — signal forwarding (SIGTERM → Node) and zombie reaping.
RUN apt-get update \
 && apt-get install -y --no-install-recommends tini \
 && apt-get clean \
 && rm -rf /var/lib/apt/lists/*

COPY --from=build --chown=node:node /app/dist ./
COPY --from=prod-deps --chown=node:node /app/node_modules ./node_modules
COPY migrations /app/migrations

USER node

ENTRYPOINT ["/usr/bin/tini", "--"]
CMD ["node", "src/index.js"]
