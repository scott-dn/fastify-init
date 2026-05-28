import { type FastifyInstance } from 'fastify';

export let IS_APP_CLOSED = false;

export const handleShutdownGracefully = (app: FastifyInstance) => {
  const handleSignal = (signal: NodeJS.Signals) => {
    app.log.info(`Received ${signal}. Close server gracefully`);

    // Ensure health check will return 503
    IS_APP_CLOSED = true;

    return closeApp(app).catch((error: unknown) => {
      throw error;
    }) as unknown;
  };

  process.once('SIGINT', handleSignal);
  process.once('SIGTERM', handleSignal);
};

const closeApp = async (app: FastifyInstance) => {
  app.log.info('Closing server');
  await app.close();

  app.log.info('Closing database connection');
  await app.db.$client.end();
  app.log.info('Database connection closed');
  app.log.info('Server closed');
};
