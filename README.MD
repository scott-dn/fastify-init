# WHY

1. Fastify
   - Performance, Low-overhead, Fast Serialization, and Validation
   - Fast Logging
   - Schema-based (super lovely)
   - Lightweight
2. Prisma
   - Auto Entity|Model generated
   - Migration tracking with schema
   - Modern API
   - Built-in Mock|Test
3. Formatter - Strict linter - Truly Typescript
4. No dependency hell
5. No over-enginrerring dogma
6. Tests environment ready
7. Gracefully shutdown
8. Better error handling
9. `request-id` tracking
10. K8s prevent request loss...
11. Dockerfile - production ready
12. Beauty Logging
13. Fast responsive development mode with `yarn start:watch`
14. Pre-commit hook
15. SwaggerUI
16. CI/CD (TODO)

## DEMO

```bash
$ docker compose up -d
$ yarn db:migrate
$ yarn start:watch

$ curl -X POST http://localhost:5000/user \
-H 'content-type: application/json' \
-d '{"name":"scott","email":"scott@abc.com"}'

$ curl http://localhost:5000/users
```
