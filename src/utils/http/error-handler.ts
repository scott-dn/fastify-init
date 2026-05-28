import { type FastifyError } from 'fastify';

import { type App } from '#/commons/fastify.js';
import { INTERNAL_SERVER_ERROR_CODE, INTERNAL_SERVER_ERROR_MSG } from '#/constants/error-code.js';

export const registerErrorHandlers = (app: App) => {
  app.setNotFoundHandler((_request, reply) => {
    reply.code(404).send({ message: 'Not Found' });
  });

  app.setErrorHandler((e: FastifyError, request, reply) => {
    if (e.code === 'FST_ERR_HANDLER_TIMEOUT') {
      app.log.warn({ req_id: request.id }, 'Request Timeout');
      return reply.status(503).send({ message: 'Request Timeout' });
    }

    // fastify built-in handled error
    if (Number(e.statusCode) >= 400 && Number(e.statusCode) < 500) {
      return reply.status(Number(e.statusCode)).send({ message: e.message, code: e.code });
    }

    app.log.error(
      {
        request: {
          req_id: request.id,
          path: request.url,
          headers: request.headers,
          // body: req.body,
          parameters: request.params,
          query: request.query,
          originalUrl: request.originalUrl,
          method: request.method,
          protocol: request.protocol,
          hostname: request.hostname
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
