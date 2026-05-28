import { type Static, Type } from '@sinclair/typebox';
import envSchema from 'env-schema';

const ConfigSchema = Type.Object({
  NODE_ENV: Type.Union([Type.Literal('development'), Type.Literal('production')], {
    default: 'development'
  }),
  HOST: Type.String({ default: '0.0.0.0' }),
  PORT: Type.Number({ default: 5000 }),
  PGHOST: Type.String(),
  PGPORT: Type.Number(),
  PGDATABASE: Type.String(),
  PGUSER: Type.String(),
  PGPASSWORD: Type.String()
});

export type Config = Static<typeof ConfigSchema>;

export const config = envSchema<Config>({
  schema: ConfigSchema,
  // LOCAL DEVELOPMENT ONLY
  dotenv: true // load .env
});
