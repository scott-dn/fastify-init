import { FastifyReply, FastifyRequest } from 'fastify';
import { PinoLoggerOptions } from 'fastify/types/logger';

import { Config } from 'src/commons/config';

export const getLogger = (config: Config): boolean | PinoLoggerOptions =>
  config.NODE_ENV === 'production'
    ? {
        level: 'error'
      }
    : {
        level: 'debug',
        transport: {
          target: 'pino-pretty',
          options: {
            translateTime: 'HH:MM:ss Z',
            ignore: 'pid,hostname'
          }
        },
        serializers: {
          res: (reply: FastifyReply) => ({
            statusCode: reply.statusCode,
            // extra info will be logged in the `production` due to performance cost
            headers:
              typeof reply.getHeaders === 'function' ? reply.getHeaders() : {}
          }),
          req: (req: FastifyRequest) => ({
            method: req.method,
            url: req.url,
            hostname: req.hostname,
            remoteAddress: req.ip,
            remotePort: req.socket.remotePort,
            // extra info will be logged in the `production` due to performance cost
            path: req.routerPath,
            parameters: req.params,
            headers: req.headers,
            body: req.body
          })
        }
      };
