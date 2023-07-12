import { FastifyInstance } from 'fastify';

import { db } from 'src/storage/db';

// NOTE: stop k8s from sending traffic to the server
export let IS_APP_CLOSED = false;

export const handleShutdownGracefully = (app: FastifyInstance) => {
  const handleSignal = (signal: NodeJS.Signals) => {
    app.log.info(`Received ${signal}. Close server gracefully`);

    // Ensure health check will return 503
    IS_APP_CLOSED = true;

    return closeApp(app).catch(error => {
      throw error;
    }) as unknown;
  };

  process.on('SIGINT', handleSignal);
  process.on('SIGTERM', handleSignal);
};

const closeApp = async (app: FastifyInstance) => {
  app.log.info('Closing server');
  await app.close();

  app.log.info('Closing database connection');
  await db.$disconnect();
  app.log.info('Database connection closed');
  app.log.info('Server closed');
};
