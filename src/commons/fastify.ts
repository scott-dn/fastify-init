import { type TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import type {
  FastifyBaseLogger,
  FastifyInstance,
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
  RawServerDefault
} from 'fastify';

// Typed Fastify instance with the TypeBox type provider attached.
// Use this as the parameter type for controllers/plugins so route schemas
// auto-infer Body / Params / Querystring / Reply via `withTypeProvider()`.
export type App = FastifyInstance<
  RawServerDefault,
  RawRequestDefaultExpression,
  RawReplyDefaultExpression,
  FastifyBaseLogger,
  TypeBoxTypeProvider
>;
