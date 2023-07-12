import { FastifyInstance } from 'fastify';

import { Req } from 'src/commons/fastify';
import { db } from 'src/storage/db';

import { CreateUserSchema, GetAllUsersSchema } from './user.model';

export const registerUserController = (app: FastifyInstance) => {
  app.get('/users', { schema: GetAllUsersSchema }, async () => ({
    data: await db.user.findMany()
  }));

  app.post(
    '/user',
    { schema: CreateUserSchema },
    async (req: Req<typeof CreateUserSchema>) => {
      const user = await db.user.create({
        data: {
          name: req.body.name ?? '',
          email: req.body.email
        }
      });
      app.log.info(user, 'Created user');
      return { data: user };
    }
  );
};
