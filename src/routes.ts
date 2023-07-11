import { FastifyInstance } from 'fastify';

import { registerHelloController } from './modules/hello/hello.controller';
import { registerUserController } from './modules/user/user.controller';

export const registerAppRoutes = (app: FastifyInstance) => {
  registerHelloController(app);
  registerUserController(app);
};
