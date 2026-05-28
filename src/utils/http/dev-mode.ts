import { type FastifyInstance } from 'fastify';

export const setupDeveloperMode = async (app: FastifyInstance) => {
  await registerSwagger(app);

  // log request body
  app.addHook('preHandler', (request, _reply, done) => {
    if (request.body) {
      request.log.debug({ body: request.body }, 'request body');
    }
    done();
  });
};

const registerSwagger = async (app: FastifyInstance) => {
  await app.register(import('@fastify/swagger'), {
    logLevel: 'silent',
    openapi: {
      info: {
        title: 'Swagger',
        version: '0.1.0'
      },
      servers: [
        {
          // eslint-disable-next-line sonarjs/no-clear-text-protocols
          url: 'http://0.0.0.0:5000'
        }
      ]
    }
  });

  await app.register(import('@fastify/swagger-ui'), {
    logLevel: 'silent',
    routePrefix: '/docs'
  });
};
