import { Type } from '@sinclair/typebox';

import { ResponseSchema } from 'src/commons/response';

const User = Type.Object({
  name: Type.String(),
  mail: Type.Optional(Type.String({ format: 'email' }))
});

export const UserSchema = {
  ...ResponseSchema(User),
  tags: ['users'],
  params: Type.Object({
    id: Type.String({
      description: 'user id'
    })
  }),
  body: User
};

export type UserModel = typeof UserSchema;
