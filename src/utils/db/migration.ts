import { Migrator } from 'pgroll';
import { type Sql } from 'postgres';

import { getLogger } from '#/commons/logger.js';

export const migrate = async (sql: Sql, version = 0) => {
  const migrator = new Migrator(sql);
  await (version == 0 ? migrator.up() : migrator.go(version));
  const actualVersion = await migrator.getCurrentVersion();
  getLogger()!.info({ version: actualVersion }, '[DB]: Migrate successfully');
};
