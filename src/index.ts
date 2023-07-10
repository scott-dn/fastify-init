import fastify from 'fastify';
import { PinoLoggerOptions } from 'fastify/types/logger';

import { config } from './config';
import { registerSwagger } from './plugins/swagger';
import { registerRoutes } from './routes';

// TODO: validation
// TODO: ORM
// TODO: migration
// TODO: authentication
// TODO: heathcheck
// TODO: graceful shutdown

const getLogger = (): boolean | PinoLoggerOptions =>
  config.NODE_ENV === 'production'
    ? true
    : {
        level: 'debug',
        transport: {
          target: 'pino-pretty',
          options: {
            translateTime: 'HH:MM:ss Z',
            ignore: 'pid,hostname'
          }
        }
      };

const bootstrap = async () => {
  const opts = {
    logger: getLogger()
  };

  const app = fastify(opts);

  if (config.NODE_ENV === 'local') await registerSwagger(app);

  registerRoutes(app);

  app.log.info(config, 'Starting server with config');

  app.listen({ port: config.PORT }, err => {
    if (err) throw err;
  });
};

bootstrap().catch(error => {
  throw error;
});
