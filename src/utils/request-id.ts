import { FastifyInstance } from 'fastify';

import { REQUEST_ID } from 'src/contants/error-code';

export const registerRequestId = (app: FastifyInstance) => {
  app.addHook('onSend', (req, reply, _, done) => {
    reply.header(REQUEST_ID, req.id) as unknown;
    done();
  });
};
