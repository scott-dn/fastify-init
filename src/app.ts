import fastify, { FastifyServerOptions } from 'fastify';

import { registerRoutes } from './routes';
import { registerSwagger } from './swagger';

export const build = async (opts: FastifyServerOptions) => {
  const app = fastify(opts);

  await registerSwagger(app);

  registerRoutes(app);

  return app;
};
