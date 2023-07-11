import fastify from 'fastify';

import { config } from './commons/config';
import { setupDevelopMode } from './dev-mode';
import { registerErrorHandlers } from './error-handler';
import { registerHeathcheck } from './healthcheck';
import { getLogger } from './logger';
import { registerAppRoutes } from './routes';
import { handleShutdownGracefully } from './shutsown-gracefully';

// TODO: request-id
// TODO: prod build
// TODO: ORM
// TODO: migration
// TODO: authentication

const bootstrap = async () => {
  const opts = {
    logger: getLogger(config)
  };

  const app = fastify(opts);

  if (config.NODE_ENV === 'development') {
    await setupDevelopMode(app);
  }

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
