import { TArray, TObject, Type } from '@sinclair/typebox';

export const ResponseSchema = (data?: TObject | TArray) => ({
  response: {
    '2xx': Type.Object(
      {
        data: Type.Optional(data ?? Type.Unknown()),
        message: Type.Optional(Type.String())
      },
      { description: 'Success Response' }
    ),
    '4xx': Type.Object(
      {
        message: Type.Optional(Type.String()),
        code: Type.Optional(Type.String())
      },
      { description: 'Client Error Response' }
    ),
    '5xx': Type.Object(
      {
        message: Type.Optional(Type.String()),
        code: Type.Optional(Type.String())
      },
      { description: 'Server Error Response' }
    )
  }
});
