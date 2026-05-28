import helmet from '@fastify/helmet';
import type { FastifyInstance } from 'fastify';

export const registerHelmet = (app: FastifyInstance) => {
  app.register(helmet, {
    // Defaults: solid baseline of security headers (X-Frame-Options, CSP, HSTS in prod, etc.).
    // Disable contentSecurityPolicy for Swagger UI in dev — it loads inline scripts/styles.
    contentSecurityPolicy: process.env['NODE_ENV'] === 'production'
  });
};
