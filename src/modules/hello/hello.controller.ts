import { type App } from '#/commons/fastify.js';

export const registerHelloController = (app: App) => {
  app.get('/', request => {
    request.log.info(
      {
        hello: 'world',
        nested: { abc: 123, time: Date.now() }
      },
      'another msg'
    );
    return { hello: 'world' };
  });
};
