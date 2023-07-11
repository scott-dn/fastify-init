import { FastifyInstance } from 'fastify';

import { Res } from './commons/fastify';
import { ResponseSchema } from './commons/response';
import {
  INTERNAL_SERVER_ERROR_CODE,
  INTERNAL_SERVER_ERROR_MSG
} from './contants/error-code';

const DefaultSchema = ResponseSchema();

export const registerErrorHandlers = (app: FastifyInstance) => {
  app.setErrorHandler((error, request, reply: Res<typeof DefaultSchema>) => {
    if (error.statusCode === 400 || error.validation) {
      return reply.status(400).send(error);
    }

    app.log.error(
      {
        request: {
          req_id: request.id as unknown,
          path: request.routerPath,
          headers: request.headers,
          body: request.body,
          parameters: request.params,
          query: request.query,
          url: request.url,
          originalUrl: request.originalUrl,
          method: request.method,
          protocol: request.protocol,
          hostname: request.hostname
        },
        error: {
          message: error.message,
          stack: error.stack,
          name: error.name,
          cause: error.cause,
          code: error.code,
          statusCode: error.statusCode
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
