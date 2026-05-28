import rateLimit from '@fastify/rate-limit';
import type { FastifyInstance } from 'fastify';

export const registerRateLimit = (app: FastifyInstance) => {
  app.register(rateLimit, {
    // Global default: 200 requests per minute per client (by IP).
    // Override per-route via { config: { rateLimit: { max, timeWindow } } } in the route options.
    max: 200,
    timeWindow: '1 minute'
  });
};
