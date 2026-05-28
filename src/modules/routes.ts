import { type FastifyInstance } from 'fastify';

import { registerErrorController } from '#/modules/error/error.controller.js';
import { registerHelloController } from '#/modules/hello/hello.controller.js';
import { registerUserController } from '#/modules/user/user.controller.js';

export const registerAppRoutes = (app: FastifyInstance) => {
  registerHelloController(app);
  registerUserController(app);
  registerErrorController(app);
};
