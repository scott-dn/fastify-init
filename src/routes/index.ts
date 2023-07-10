import { FastifyInstance } from 'fastify';

export const registerRoutes = (app: FastifyInstance) => {
  app.get('/', () => ({ hello: 'world' }));

  app.put(
    '/some-route/:id',
    {
      schema: {
        tags: ['routes'],
        params: {
          type: 'object',
          properties: {
            id: {
              type: 'string'
            }
          }
        },
        body: {
          type: 'object',
          properties: {
            hello: { type: 'string' },
            obj: {
              type: 'object',
              properties: {
                some: { type: 'string' }
              }
            }
          }
        }
      }
    },
    (_, reply) => reply.send()
  );
};
