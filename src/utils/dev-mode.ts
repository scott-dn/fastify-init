import { FastifyInstance } from 'fastify';

export const setupDevelopMode = async (app: FastifyInstance) => {
  await registerSwagger(app);

  // log request body
  app.addHook('preHandler', (req, _, done) => {
    if (req.body) {
      req.log.info({ body: req.body }, 'request body');
    }
    done();
  });
};

const registerSwagger = async (app: FastifyInstance) => {
  await app.register(import('@fastify/swagger'), {
    openapi: {
      info: {
        title: 'Test swagger',
        version: '0.1.0'
      },
      servers: [
        {
          url: 'http://0.0.0.0:5000'
        }
      ]
    }
  });

  await app.register(import('@fastify/swagger-ui'), {
    routePrefix: '/docs'
  });
};
