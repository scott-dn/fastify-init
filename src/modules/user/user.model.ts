import { Type } from '@sinclair/typebox';

import { ResponseSchema } from 'src/commons/response';

const USER_TAGS = ['users'];

export const GetAllUsersSchema = {
  ...ResponseSchema(
    Type.Array(
      Type.Object({
        id: Type.Number(),
        name: Type.Optional(Type.String()),
        email: Type.String({ format: 'email' })
      })
    )
  ),
  tags: USER_TAGS
};

export const CreateUserSchema = {
  ...ResponseSchema(),
  tags: USER_TAGS,
  body: Type.Object({
    name: Type.Optional(Type.String()),
    email: Type.String({ format: 'email' })
  })
};
