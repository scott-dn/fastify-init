import type { FastifyInstance, FastifyPluginAsync } from 'fastify';
import * as fastifyMetrics from 'fastify-metrics';

// Exposes Prometheus metrics at `/metrics` (default endpoint):
//   - Node.js process metrics (CPU, memory, GC, event loop lag)
//   - per-route HTTP histograms (request count, duration buckets, response size)
// Scrape with Prometheus / Grafana Alloy / OpenTelemetry Collector via `GET /metrics`.
//
// Cast notes:
//   - `* as` + `.default`: fastify-metrics exports as `exports.default`; under
//     NodeNext + `verbatimModuleSyntax` the default specifier doesn't surface
//     cleanly via a normal `import x from ...`.
//   - `as FastifyPluginAsync`: fastify-metrics' plugin is typed against the
//     default TypeProvider, while our root `app` carries TypeBoxTypeProvider.
//     They don't unify under strict typing; the cast is local to this seam.
export const registerMetrics = (app: FastifyInstance) => {
  app.register(fastifyMetrics.default as unknown as FastifyPluginAsync);
};
