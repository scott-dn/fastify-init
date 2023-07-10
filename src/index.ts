import { build } from './app';

const bootstrap = async () => {
  const app = await build({
    logger: true
  });

  app.listen({ port: 5000 }, err => {
    if (err) throw err;
  });
};

bootstrap().catch(error => {
  console.error(error);
});
