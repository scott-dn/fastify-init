import { FastifyInstance } from 'fastify';

import { registerHelloController } from './modules/hello/hello.controller';
import { registerUserController } from './modules/user/user.controller';

export const registerRoutes = (app: FastifyInstance) => {
  registerHelloController(app);
  registerUserController(app);
};
