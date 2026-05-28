import { type FastifyInstance } from 'fastify';

import { REQUEST_ID } from '#/contants/headers.js';

export const registerRequestId = (app: FastifyInstance) => {
  app.addHook('onSend', (request, reply, _, done) => {
    reply.header(REQUEST_ID, request.id) as unknown;
    done();
  });
};
