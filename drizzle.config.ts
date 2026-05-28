/*
 * FOR ORM GENERATED PURPOSE
 */
import { defineConfig } from 'drizzle-kit';

import { config } from '#/commons/config.js';

// eslint-disable-next-line no-restricted-syntax
export default defineConfig({
  dialect: 'postgresql',
  out: './src/storage/drizzle',
  dbCredentials: {
    host: config.PGHOST,
    port: config.PGPORT,
    database: config.PGDATABASE,
    user: config.PGUSER,
    password: config.PGPASSWORD
  }
});
