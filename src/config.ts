import { Static, Type } from '@sinclair/typebox';
import envSchema from 'env-schema';

const schema = Type.Object({
  NODE_ENV: Type.Union(
    [Type.Literal('development'), Type.Literal('production')],
    {
      default: 'development'
    }
  ),
  PORT: Type.Number({ default: 5000 })
});

export type Config = Static<typeof schema>;

export const config = envSchema<Config>({
  schema: schema,
  dotenv: true // load .env
});
