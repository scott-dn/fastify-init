import fastify, { FastifyHttpOptions, RawServerDefault } from 'fastify';
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

// TODO: migration
// TODO: authentication

const bootstrap = async () => {
  const opts: FastifyHttpOptions<RawServerDefault> = {
    logger: getLogger(config),
    ignoreTrailingSlash: true,
    // How long to wait to make an initial connection
    connectionTimeout: 1000, // 1s
    // It is not a timeout on how much it takes for a request to be processed by fastify,
    // but how much it takes for the underlying HTTP server to receive the request from the body
    requestTimeout: 1000, // 1s
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

  app.listen({ host: config.HOST, port: config.PORT }, e => {
    if (e) throw e;
    app.log.debug(config, 'Starting server with config');
  });

  return app;
};

bootstrap()
  .then(handleShutdownGracefully)
  .catch(error => {
    throw error;
  });
