import { FastifyInstance } from 'fastify';

import { REQUEST_ID } from 'src/contants/headers';

export const registerRequestId = (app: FastifyInstance) => {
  app.addHook('onSend', (req, reply, _, done) => {
    reply.header(REQUEST_ID, req.id) as unknown;
    done();
  });
};
