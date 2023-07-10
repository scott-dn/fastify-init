import { FastifyInstance } from 'fastify';

import { UserSchema } from './user.model';
import { Req } from '../../commons/fastify';

export const registerUserController = (app: FastifyInstance) => {
  app.put(
    '/users/:id',
    {
      schema: {
        ...UserSchema,
        tags: ['routes']
      }
    },
    ({ log, body: { name, mail }, params }: Req<typeof UserSchema>, reply) => {
      log.debug({ params: params.id }, 'Got id name');
      log.debug({ name }, 'Got body name');
      log.debug(mail, 'Got body mail');
      return reply.send({ name, mail });
    }
  );
};
