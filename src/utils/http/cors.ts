import cors from '@fastify/cors';
import type { FastifyInstance } from 'fastify';

export const registerCors = (app: FastifyInstance) => {
  app.register(cors, {
    logLevel: 'error',
    origin: 'http://localhost:5000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  });
};
