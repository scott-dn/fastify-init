import { FastifyInstance } from 'fastify';

export const registerRoutes = (app: FastifyInstance) => {
  app.get('/', req => {
    req.log.info(
      {
        hello: 'world',
        nested: { abc: 123, time: Date.now() }
      },
      'another msg'
    );
    return { hello: 'world' };
  });

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
