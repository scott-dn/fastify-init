import { FastifyInstance } from 'fastify';

import { Req } from 'src/commons/fastify';

import { UserSchema } from './user.model';

export const registerUserController = (app: FastifyInstance) => {
  app.put(
    '/users/:id',
    {
      schema: {
        ...UserSchema,
        tags: ['users']
      }
    },
    ({ log, body: { name, mail }, params }: Req<typeof UserSchema>, reply) => {
      log.debug({ params: params.id }, 'Got id name');
      log.debug({ name, mail }, 'Got body');
      return reply.send({ name, mail });
    }
  );
};
