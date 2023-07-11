import { Static, Type } from '@sinclair/typebox';
import envSchema from 'env-schema';

const ConfigSchema = Type.Object({
  NODE_ENV: Type.Union(
    [Type.Literal('development'), Type.Literal('production')],
    {
      default: 'development'
    }
  ),
  PORT: Type.Number({ default: 5000 })
});

export type Config = Static<typeof ConfigSchema>;

export const config = envSchema<Config>({
  schema: ConfigSchema,
  dotenv: true // load .env
});
