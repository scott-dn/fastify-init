import swaggerPlugin from '@fastify/swagger';
import swaggerUiPlugin from '@fastify/swagger-ui';
import { FastifyInstance } from 'fastify';

export const registerSwagger = async (app: FastifyInstance) => {
  await app.register(swaggerPlugin, {
    openapi: {
      info: {
        title: 'Test swagger',
        version: '0.1.0'
      },
      servers: [
        {
          url: 'http://localhost:5000'
        }
      ]
    }
  });

  await app.register(swaggerUiPlugin, {
    routePrefix: '/docs'
  });
};
