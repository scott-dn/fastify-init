import { Type } from '@sinclair/typebox';

const User = Type.Object({
  name: Type.String(),
  mail: Type.Optional(Type.String({ format: 'email' }))
});

export const UserSchema = {
  params: Type.Object({
    id: Type.String({
      description: 'user id'
    })
  }),
  body: User,
  response: {
    '2xx': User
  }
};
