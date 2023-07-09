import fastify, { FastifyServerOptions } from 'fastify';

export const build = (opts: FastifyServerOptions) => {
  const app = fastify(opts);

  app.get('/', () => ({ hello: 'world' }));

  return app;
};
