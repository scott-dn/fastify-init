import fastify from 'fastify';

import { registerAppRoutes } from 'src/routes';

describe('Test hello controller', () => {
  const app = fastify();

  beforeAll(async () => {
    registerAppRoutes(app);
    await app.ready();
  });

  it('returns a 200', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/'
    });

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual(JSON.stringify({ hello: 'world' }));
  });
});
