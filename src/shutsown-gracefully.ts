import { FastifyInstance } from 'fastify';

// NOTE: stop k8s from sending traffic to the server
export let IS_APP_CLOSED = false;

export const handleShutdownGracefully = (app: FastifyInstance) => {
  const handleSignal = (signal: NodeJS.Signals) => {
    app.log.info(`Received ${signal}. Close server gracefully`);

    // Ensure health check will return 503
    IS_APP_CLOSED = true;

    app.log.info('Closing server');

    app.close(() => {
      app.log.info('Closing database connection');
      // TODO: close database connection

      app.log.info('Server closed');
    });
  };

  process.on('SIGINT', handleSignal);
  process.on('SIGTERM', handleSignal);
};
