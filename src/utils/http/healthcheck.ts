import { type FastifyInstance } from 'fastify';

import { IS_APP_CLOSED } from '#/utils/http/shutdown-gracefully.js';

export const registerHeathcheck = (app: FastifyInstance) => {
  app.get('/health', { logLevel: 'error' }, async (_request, rep) => {
    if (IS_APP_CLOSED) return rep.status(503).send();
    const [{ result }]: [{ result: number }] = await app.db.$client`select 1 as result`;
    return rep.status(result === 1 ? 200 : 500).send();
  });
};
