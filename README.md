[![codecov](https://codecov.io/github/scott-dn/fastify-init/graph/badge.svg?token=EKGJB4R6EN)](https://codecov.io/github/scott-dn/fastify-init)

# fastify-init

A production-leaning Fastify 5 starter on **Node 24 + ESM + TypeScript (strict)**.
Includes Postgres via Drizzle, Vitest, Swagger, graceful shutdown, and a multi-stage Docker build.

---

## Stack

| Layer         | Choice                                                                        |
| ------------- | ----------------------------------------------------------------------------- |
| Runtime       | Node 24.16+ (native TS execution, no ts-node/tsx needed)                      |
| Language      | TypeScript (strict, NodeNext, ESM, `verbatimModuleSyntax`)                    |
| HTTP          | Fastify 5 + `@sinclair/typebox` + `@fastify/type-provider-typebox`            |
| DB driver     | `postgres` (postgres.js)                                                      |
| ORM           | Drizzle (`drizzle-orm` + `drizzle-kit` introspect / pull workflow)            |
| Logger        | pino (+ pino-pretty in dev)                                                   |
| Tests         | Vitest (+ v8 coverage)                                                        |
| Lint / Format | ESLint flat config (typescript-eslint, unicorn, sonarjs, import-x) + Prettier |
| API docs      | `@fastify/swagger` + `swagger-ui` (mounted at `/docs` in dev only)            |
| Package mgr   | pnpm 11.4+ (enforced via `preinstall` + `only-allow`)                         |

---

## Prerequisites

- **Node** `>=24.16.0` — required for native `.ts` execution and the conditional `imports` mapping.
- **pnpm** `>=11.4.0` — other package managers are blocked by `preinstall`. Easiest install via Corepack:
  ```sh
  corepack enable
  ```
  Corepack will pick up the version pinned in `package.json#packageManager` automatically.
- **Docker** (with Compose v2) — only needed for the local Postgres + pgAdmin services and for image builds.
- **pgroll** CLI — used by `pnpm db:migrate:*` scripts. Install per their [docs](https://github.com/tnht95/pgroll).
- **Docker Desktop** should have host networking **enable**
- **pg_format** installed

---

## Quick start

```sh
# 1. install deps
pnpm install

# 2. create .env (see "Environment" section for full schema)
cat > .env <<'EOF'
PGHOST=127.0.0.1
PGPORT=5432
PGDATABASE=fastify
PGUSER=fastify
PGPASSWORD=fastify
EOF

# 3. start Postgres (+ pgAdmin on :5050)
docker compose up db pgadmin -d

# 4. apply migrations and generate the Drizzle ORM types
pnpm db:migrate:up

# 5. start the dev server
pnpm dev
```

Server listens on `http://0.0.0.0:5000` by default. Swagger UI is at `http://localhost:5000/docs` in development.

---

## Environment

The app validates env at boot via TypeBox (`src/commons/config.ts`). Any missing required
variable fails fast with a schema error.

| Variable     | Required | Default       | Description                   |
| ------------ | -------- | ------------- | ----------------------------- |
| `NODE_ENV`   | no       | `development` | `development` or `production` |
| `HOST`       | no       | `0.0.0.0`     | Bind address                  |
| `PORT`       | no       | `5000`        | Bind port                     |
| `PGHOST`     | **yes**  | —             | Postgres host                 |
| `PGPORT`     | **yes**  | —             | Postgres port                 |
| `PGDATABASE` | **yes**  | —             | Postgres database name        |
| `PGUSER`     | **yes**  | —             | Postgres user                 |
| `PGPASSWORD` | **yes**  | —             | Postgres password             |

`.env` is git-ignored and auto-loaded in development only (via `env-schema`'s `dotenv: true`).
In production, supply env vars through your orchestrator (compose `env_file`, k8s secrets,
ECS task definition, etc.).

---

## Scripts

| Script                   | Purpose                                                                        |
| ------------------------ | ------------------------------------------------------------------------------ |
| `pnpm dev`               | Watch-mode dev server (`node --watch`, native TS, dev condition active)        |
| `pnpm build`             | Type-check and emit to `dist/` (also copies `package.prod.json`)               |
| `pnpm start`             | Run the built artifact: `node dist/src/index.js`                               |
| `pnpm test`              | Run Vitest once                                                                |
| `pnpm test:watch`        | Vitest watch mode                                                              |
| `pnpm test:coverage`     | Vitest with v8 coverage (75% gate on lines/branches/functions/stmts)           |
| `pnpm lint`              | ESLint with `--fix`                                                            |
| `pnpm lint:check`        | ESLint without `--fix` (CI)                                                    |
| `pnpm format`            | Prettier write + `pg_format` on `migrations/*`                                 |
| `pnpm format:check`      | Prettier check                                                                 |
| `pnpm db:migrate:create` | `pgroll create` — scaffold a new migration pair                                |
| `pnpm db:migrate:up`     | Apply pending migrations, then regenerate Drizzle types                        |
| `pnpm db:migrate:down`   | Roll back to the version 0                                                     |
| `pnpm db:orm:gen`        | Run `drizzle-kit pull` → auto-patch output via `scripts/fix-drizzle-output.ts` |

---

## Project layout

```
src/
├── index.ts                        # bootstrap: config → fastify → plugins → routes → db → listen
├── commons/
│   ├── config.ts                   # TypeBox env schema + parsed `config` singleton
│   ├── fastify.ts                  # `App` type (FastifyInstance with TypeBox provider)
│   ├── logger.ts                   # pino factory (pretty in dev, json in prod)
│   └── response.ts                 # `ResponseSchema(data?)` envelope
├── constants/
├── modules/
├── storage/
│   ├── db.ts                       # drizzle init + `FastifyInstance.db` augmentation
│   └── drizzle/                    # GENERATED — do not hand-edit (see "Database workflow")
└── utils/
    ├── db/migration.ts             # runs pgroll Migrator on boot
    └── http/
        ├── cors.ts                 # @fastify/cors registration
        ├── dev-mode.ts             # swagger + body logging (dev only)
        ├── error-handler.ts        # 404 + global error handler
        ├── healthcheck.ts          # GET /health (returns 503 once shutting down)
        ├── helmet.ts               # @fastify/helmet security headers
        ├── metrics.ts              # fastify-metrics → Prometheus `/metrics`
        ├── rate-limit.ts           # @fastify/rate-limit (200 req/min default)
        ├── request-id.ts           # echo request id back as response header
        └── shutdown-gracefully.ts  # SIGINT/SIGTERM → app.close() → db.$client.end() → exit
__tests__/
migrations/                          # pgroll up/down SQL pairs (one *_up.sql + *_down.sql per version)
scripts/
└── fix-drizzle-output.ts            # patches drizzle-kit pull output for our build
```

---

## Routes (out of the box)

| Method | Path               | Module      | Notes                                            |
| ------ | ------------------ | ----------- | ------------------------------------------------ |
| GET    | `/`                | hello       | Sanity endpoint, returns `{hello:'world'}`       |
| GET    | `/users`           | user        | Typed list via Drizzle                           |
| POST   | `/user`            | user        | Typed insert via Drizzle, validated with TypeBox |
| GET    | `/health`          | healthcheck | 200 OK; 503 once shutdown begins                 |
| GET    | `/error`           | error       | Demo: handled 500                                |
| GET    | `/unhandled-error` | error       | Demo: throw — caught by global error handler     |
| GET    | `/docs`            | dev-mode    | Swagger UI (dev only)                            |

---

## How the ESM + `#/` alias works

```jsonc
// package.json
"imports": {
  "#/*.js": {
    "development": "./src/*.ts",
    "default": "./src/*.js"
  }
}
```

Every internal import is written as `from '#/foo/bar.js'`. Node's subpath imports map
resolves it differently per condition:

- **Dev** (`pnpm dev` runs Node with `--conditions=development`): `#/foo/bar.js` → `./src/foo/bar.ts`. Node strips types and runs natively, no compile step.
- **Prod** (after `pnpm build`): `default` condition picks `./src/foo/bar.js`. `dist/` ships a sibling `package.json` (copied from `package.prod.json`) with the same `imports` map, anchoring resolution to `dist/src/...`.

Why subpath imports instead of `paths` aliases or relative imports:

- `paths` is a tsc-only fiction; Node doesn't honor it at runtime.
- Relative imports don't pass through `imports` conditions, so the `.ts → .js` dev/prod switch wouldn't apply.
- This is the only fully-native pattern that survives `node --watch src/index.ts` in dev and plain `node dist/src/index.js` in prod with the same source files.

---

## Database workflow

There are **two** tools, each with one job:

- **pgroll** (`migrations/`) — manages the database schema. Migrations are SQL up/down pairs that pgroll applies. This is the source of truth.
- **drizzle-kit pull** (`src/storage/drizzle/`) — introspects the live DB and generates TS types + relations for type-safe queries. This is a derived view.

Typical flow:

```sh
# 1. scaffold a new migration pair
pnpm db:migrate:create add_posts_table
#    → creates migrations/<ts>_add_posts_table_up.sql + _down.sql
#    → edit them

# 2. apply + regenerate types in one step
pnpm db:migrate:up
#    → pgroll up (against PG* env vars)
#    → drizzle-kit pull (overwrites src/storage/drizzle/)
#    → scripts/fix-drizzle-output.ts (rewrites imports to '#/' alias + @ts-nocheck header)

# 3. now `app.db.query.posts.findMany(...)` is typed; commit the generated files alongside the migration
```

The generated `src/storage/drizzle/*.ts` files are committed to git. This is intentional — Docker builds, CI, and fresh clones don't need DB access to typecheck or compile.

The `fix-drizzle-output.ts` script is required because drizzle-kit emits extensionless relative imports that don't work under NodeNext + ESM + the `imports` field mapping. It rewrites them to `#/storage/drizzle/...` and adds `@ts-nocheck` so the strict typecheck doesn't choke on unused imports drizzle leaves behind.

---

## Testing

- Vitest runs natively against `.ts` (esbuild internally) — no Jest/ts-jest config drift.
- Test files: `**/*.test.ts` (co-located) or `__tests__/**/*.ts`.
- `vi.useFakeTimers()` works for timeout-based handlers without burning real wall-clock seconds.
- Coverage is v8-based with a 75% gate on all four metrics (lines/branches/functions/statements). See `vitest.config.ts`.

---

## Docker

### Local stack

```sh
docker compose up db pgadmin -d         # Postgres on :5432, pgAdmin on :5050
docker compose up fastify --build -d    # build + run the app on :5000
docker compose down                     # stop everything (data persists in ./data/)
```

`compose.yaml` uses `network_mode: host` for simplicity in local dev — every container
binds directly to host ports. This is **Linux-friendly**; on Docker Desktop (Mac/Windows)
host networking is partial — prefer bridge networking + port publishing if you hit issues.

### Image

`fastify.dockerfile` is a 3-stage build:

1. **base** — `node:24.16.0-bookworm-slim` with corepack + pnpm. Shared by other stages.
2. **build** — installs all deps (cached layer), copies source, runs `pnpm build`, then `pnpm deploy --prod --legacy /deploy` extracts a self-contained prod-only `node_modules` from the same install (no second resolve).
3. **runtime** — clean `node:24.16.0-bookworm-slim`, installs `tini` for PID 1, copies `/deploy/node_modules` and `/app/dist/` from build. Final image runs as `node` user under `tini`.

`tini` is baked in deliberately so signal handling works identically under Compose,
Fargate, k8s, and plain `docker run` — no orchestrator-specific init flag needed.

---

## Graceful shutdown

`src/utils/http/shutdown-gracefully.ts` registers `process.once` handlers for `SIGINT` and `SIGTERM`:

1. Flip `IS_APP_CLOSED` true → `/health` immediately returns 503 (load balancers stop sending traffic).
2. `app.close()` — Fastify stops accepting new connections and waits for in-flight requests to complete.
3. `app.db.$client.end()` — drain the postgres pool.
4. `process.exit(0)`.

Because we use `process.once`, a **second** Ctrl+C falls through to Node's default
(immediate kill) — your "I really mean it" escape hatch. No artificial timeouts: if
a request takes 20s, shutdown takes 20s.

---

## Conventions

- **Arrow functions only** — `no-restricted-syntax` blocks `FunctionDeclaration`, `FunctionExpression`, and `ExportDefaultDeclaration`. Named exports everywhere.
- **No relative deep imports** — `no-restricted-imports` blocks `..*` and `./*/`. Use `#/...` instead.
- **All imports with `.js` extension** — even when the source is `.ts`. NodeNext + ESM require explicit extensions, and the conditional `imports` map does the dev-time swap.
- **`import type`** required for type-only imports (`verbatimModuleSyntax`).
- **Single-quote strings, no trailing commas, LF line endings** — enforced by ESLint + Prettier.
- **Test files** get a Vitest-specific lint preset (jest-style globals available without import).

---

## License

MIT — see `package.json`.
