import { build } from './app';

const bootstrap = async () => {
  const opts = {
    logger: {
      level: 'debug',
      transport: {
        target: 'pino-pretty',
        options: {
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname'
        }
      }
    }
  };

  const app = await build(opts);

  app.listen({ port: 5000 }, err => {
    if (err) throw err;
  });
};

bootstrap().catch(error => {
  throw error;
});
