import { build } from './app';

export const app = build({
  logger: true
});

app.listen({ port: 5000 }, err => {
  if (err) throw err;
});
