import { FastifyInstance } from 'fastify';

export const registerHelloController = (app: FastifyInstance) => {
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
};
