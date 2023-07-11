import fastify from 'fastify';
import hyperid from 'hyperid';

import { config } from './commons/config';
import { REQUEST_ID } from './contants/headers';
import { registerAppRoutes } from './routes';
import { setupDevelopMode } from './utils/dev-mode';
import { registerErrorHandlers } from './utils/error-handler';
import { registerHeathcheck } from './utils/healthcheck';
import { getLogger } from './utils/logger';
import { registerRequestId } from './utils/request-id';
import { handleShutdownGracefully } from './utils/shutsown-gracefully';

// TODO: prod build
// TODO: ORM
// TODO: migration
// TODO: authentication

const bootstrap = async () => {
  const opts = {
    logger: getLogger(config),
    ignoreTrailingSlash: true,
    requestTimeout: 1000 * 30, // 30s
    requestIdHeader: REQUEST_ID,
    requestIdLogLabel: REQUEST_ID,
    genReqId: () => hyperid().uuid
  };

  const app = fastify(opts);

  if (config.NODE_ENV === 'development') {
    await setupDevelopMode(app);
  }

  registerRequestId(app);
  registerHeathcheck(app);
  registerAppRoutes(app);
  registerErrorHandlers(app);

  app.log.info(config, 'Starting server with config');

  app.listen({ port: config.PORT }, e => {
    if (e) throw e;
  });

  return app;
};

bootstrap()
  .then(handleShutdownGracefully)
  .catch(error => {
    throw error;
  });
