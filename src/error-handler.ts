import { FastifyInstance } from 'fastify';

import { Res } from './commons/fastify';
import { ResponseSchema } from './commons/response';
import {
  INTERNAL_SERVER_ERROR_CODE,
  INTERNAL_SERVER_ERROR_MSG
} from './contants/error-code';

const DefaultSchema = ResponseSchema();

export const registerErrorHandlers = (app: FastifyInstance) => {
  app.setErrorHandler((e, req, reply: Res<typeof DefaultSchema>) => {
    if (e.statusCode === 400 || e.validation) {
      return reply.status(400).send(e);
    }

    app.log.error(
      {
        request: {
          req_id: req.id as unknown,
          path: req.routerPath,
          headers: req.headers,
          body: req.body,
          parameters: req.params,
          query: req.query,
          url: req.url,
          originalUrl: req.originalUrl,
          method: req.method,
          protocol: req.protocol,
          hostname: req.hostname
        },
        error: {
          message: e.message,
          stack: e.stack,
          name: e.name,
          cause: e.cause,
          code: e.code,
          statusCode: e.statusCode
        }
      },
      'Unhandled Error'
    );

    return reply.status(500).send({
      message: INTERNAL_SERVER_ERROR_MSG,
      code: INTERNAL_SERVER_ERROR_CODE
    });
  });
};
