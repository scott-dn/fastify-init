import { Static, Type } from '@sinclair/typebox';
import envSchema from 'env-schema';

const schema = Type.Object({
  NODE_ENV: Type.Union([Type.Literal('local'), Type.Literal('production')], {
    default: 'local'
  }),
  PORT: Type.Number({ default: 5000 })
});

export const config = envSchema<Static<typeof schema>>({
  schema: schema,
  dotenv: true // load .env
});
