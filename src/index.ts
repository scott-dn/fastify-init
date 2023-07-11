import fastify, { FastifyInstance } from 'fastify';

import { config } from './config';
import { getLogger } from './logger';
import { registerSwagger } from './plugins/swagger';
import { registerRoutes } from './routes';

// TODO: validation
// TODO: ORM
// TODO: migration
// TODO: authentication
// TODO: heathcheck
// TODO: graceful shutdown

const setupDevelopMode = async (app: FastifyInstance) => {
  // enable swagger
  await registerSwagger(app);

  // log request body
  app.addHook('preHandler', (req, _, done) => {
    if (req.body) {
      req.log.info({ body: req.body }, 'request body');
    }
    done();
  });
};

const bootstrap = async () => {
  const opts = {
    logger: getLogger(config)
  };

  const app = fastify(opts);

  if (config.NODE_ENV === 'development') {
    await setupDevelopMode(app);
  }

  registerRoutes(app);

  app.log.info(config, 'Starting server with config');

  app.listen({ port: config.PORT }, e => {
    if (e) throw e;
  });
};

bootstrap().catch(error => {
  throw error;
});
