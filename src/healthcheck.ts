import { FastifyInstance } from 'fastify';

import { IS_APP_CLOSED } from './shutsown-gracefully';

export const registerHeathcheck = (app: FastifyInstance) => {
  app.get('/health', (_, reply) => {
    if (IS_APP_CLOSED) return reply.status(503).send();
    return reply.status(200).send();
  });
};
