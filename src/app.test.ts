import { build } from './app';

describe('requests the "/" route', () => {
  it('returns a 200', async () => {
    const app = build({});

    const response = await app.inject({
      method: 'GET',
      url: '/'
    });

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual(JSON.stringify({ hello: 'world' }));
  });
});
