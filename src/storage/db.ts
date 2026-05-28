import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import type { Config } from '#/commons/config.js';
import { relations } from '#/storage/drizzle/relations.js';
import * as schema from '#/storage/drizzle/schema.js';

const createDb = (config: Config) => {
  const opts = {
    onnotice: () => {
      // do nothing
      // skip logging onnotice
    },
    max: 25,
    idle_timeout: 20,
    max_lifetime: 60 * 30,
    connect_timeout: 30,
    host: config.PGHOST,
    port: config.PGPORT,
    database: config.PGDATABASE,
    user: config.PGUSER,
    password: config.PGPASSWORD
  };

  return drizzle({ client: postgres(opts), schema, relations });
};

export type Db = ReturnType<typeof createDb>;

declare module 'fastify' {
  interface FastifyInstance {
    db: Db;
  }
}

let db: Db | undefined;

export const getDb = () => db;

export const initDb = (config: Config): Db => {
  if (db) return db;
  db = createDb(config);
  return db;
};
