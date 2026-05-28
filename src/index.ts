import { type TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import fastify, {
  type FastifyHttpOptions,
  type FastifyServerOptions,
  type RawServerDefault
} from 'fastify';
import hyperid from 'hyperid';

import { config } from '#/commons/config.js';
import { initLogger } from '#/commons/logger.js';
import { REQUEST_ID } from '#/constants/headers.js';
import { registerAppRoutes } from '#/modules/routes.js';
import { initDb } from '#/storage/db.js';
import { migrate } from '#/utils/db/migration.js';
import { registerCors } from '#/utils/http/cors.js';
import { setupDeveloperMode } from '#/utils/http/dev-mode.js';
import { registerErrorHandlers } from '#/utils/http/error-handler.js';
import { registerHealthcheck } from '#/utils/http/healthcheck.js';
import { registerHelmet } from '#/utils/http/helmet.js';
import { registerMetrics } from '#/utils/http/metrics.js';
import { registerRateLimit } from '#/utils/http/rate-limit.js';
import { registerRequestId } from '#/utils/http/request-id.js';
import { handleShutdownGracefully } from '#/utils/http/shutdown-gracefully.js';

const bootstrap = async () => {
  const devLoggerOpts: NonNullable<FastifyServerOptions['logger']> = {
    level: 'debug',
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname'
      }
    },
    serializers: {
      res: reply => ({
        statusCode: reply.statusCode,
        headers: typeof reply.getHeaders === 'function' ? reply.getHeaders() : {}
      }),
      req: request => ({
        method: request.method,
        hostname: request.hostname,
        remoteAddress: request.ip,
        port: request.port,
        path: request.url,
        parameters: request.params,
        headers: request.headers,
        body: request.body
      })
    }
  };

  const opts: FastifyHttpOptions<RawServerDefault> = {
    loggerInstance: initLogger(config, devLoggerOpts),
    routerOptions: {
      ignoreTrailingSlash: true
    },
    handlerTimeout: 5000, // 5s, Noted that it's GET only
    requestIdHeader: REQUEST_ID,
    requestIdLogLabel: REQUEST_ID,
    genReqId: () => hyperid().uuid
  };

  const app = fastify(opts).withTypeProvider<TypeBoxTypeProvider>();

  if (config.NODE_ENV === 'development') {
    await setupDeveloperMode(app);
  }

  registerHelmet(app);
  registerRateLimit(app);
  registerMetrics(app);
  registerRequestId(app);
  registerCors(app);
  registerHealthcheck(app);
  registerAppRoutes(app);
  registerErrorHandlers(app);

  const db = initDb(config);
  await migrate(db.$client);
  app.decorate('db', db);

  app.listen({ host: config.HOST, port: config.PORT }, e => {
    if (e) throw e;
    app.log.debug(config, 'Starting server with config');
  });

  return app;
};

await bootstrap()
  .then(handleShutdownGracefully)
  .catch((error: unknown) => {
    throw error;
  });
