import { FastifyReply, FastifyRequest } from 'fastify';
import { PinoLoggerOptions } from 'fastify/types/logger';

import { Config } from './config';

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
          req: (request: FastifyRequest) => ({
            method: request.method,
            url: request.url,
            hostname: request.hostname,
            remoteAddress: request.ip,
            remotePort: request.socket.remotePort,
            // extra info will be logged in the `production` due to performance cost
            path: request.routerPath,
            parameters: request.params,
            headers: request.headers,
            body: request.body
          })
        }
      };
