import { type Logger, type LoggerOptions, pino } from 'pino';

import { type Config } from '#/commons/config.js';

let logger: Logger | undefined;

export const getLogger = () => logger;

// Paths to mask in production logs. HTTP header names are lowercased by Node,
// so target `authorization` / `cookie` in lowercase. Each path is listed under
// the `request` key (manual logging in the error handler) and a bare `headers`
// fallback. Dev logging is left untouched so real values are visible locally.
const REDACT_PATHS = [
  'request.headers.authorization',
  'request.headers.cookie',
  'headers.authorization',
  'headers.cookie'
];

export const initLogger = (config: Config, devOpts: LoggerOptions) => {
  if (logger) return logger;

  logger =
    config.NODE_ENV === 'production'
      ? pino({ level: 'info', redact: { paths: REDACT_PATHS, censor: '[REDACTED]' } })
      : pino(devOpts);

  return logger;
};
