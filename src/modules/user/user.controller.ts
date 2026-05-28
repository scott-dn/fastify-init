import { type FastifyInstance } from 'fastify';

import { type Req, type Res } from '#/commons/fastify.js';
import { CreateUserSchema, GetAllUsersSchema } from '#/modules/user/user.model.js';
import { user } from '#/storage/drizzle/schema.js';

export const registerUserController = (app: FastifyInstance) => {
  app.get(
    '/users',
    { schema: GetAllUsersSchema },
    async (_, reply: Res<typeof GetAllUsersSchema>) => {
      const data = await app.db.query.user.findMany({
        columns: { id: true, email: true, name: true }
      });
      reply.status(200).send({ data });
    }
  );

  app.post(
    '/user',
    { schema: CreateUserSchema },
    async ({ body }: Req<typeof CreateUserSchema>, reply: Res<typeof CreateUserSchema>) => {
      const [data] = await app.db
        .insert(user)
        .values({ name: body.name, email: body.email })
        .returning();
      reply.status(201).send({ data });
    }
  );
};
