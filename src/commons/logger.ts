import { type Logger, type LoggerOptions, pino } from 'pino';

import { type Config } from '#/commons/config.js';

let logger: Logger | undefined;

export const getLogger = () => logger;

export const initLogger = (config: Config, devOpts: LoggerOptions) => {
  if (logger) return logger;

  logger = pino(config.NODE_ENV === 'production' ? { level: 'info' } : devOpts);

  return logger;
};
