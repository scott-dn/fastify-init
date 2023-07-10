import fastify, { FastifyServerOptions } from 'fastify';

import { registerSwagger } from './plugins/swagger';
import { registerRoutes } from './routes';

export const build = async (opts: FastifyServerOptions) => {
  const app = fastify(opts);

  await registerSwagger(app);

  registerRoutes(app);

  return app;
};
