import { type FastifyInstance } from 'fastify';

export const registerErrorController = (app: FastifyInstance) => {
  app.get('/error', (request, reply) => {
    request.log.error(
      {
        errorKey: 'errorValue'
      },
      'handled error msg'
    );
    reply.status(500).send({ message: 'handled error' });
  });

  app.get('/unhandled-error', request => {
    request.log.error(
      {
        errorKey: 'errorValue'
      },
      'unhandled error msg'
    );
    throw new Error('unhandled error');

    // same effect
    // reply.send(new Error('handled error'))
  });
};
