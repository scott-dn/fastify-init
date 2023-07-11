import { FastifyInstance } from 'fastify';

import { Req, Res } from 'src/commons/fastify';

import { UserModel, UserSchema } from './user.model';

export const registerUserController = (app: FastifyInstance) => {
  app.put(
    '/users/:id',
    {
      schema: UserSchema
    },
    (
      { log, body: { name, mail }, params }: Req<UserModel>,
      reply: Res<UserModel>
    ) => {
      log.debug({ params: params.id }, 'Got id name');
      log.debug({ name, mail }, 'Got body');
      return reply.send({ data: { name, mail: mail ?? '' } });
    }
  );
};
