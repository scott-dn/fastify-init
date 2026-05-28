/* eslint-disable no-console */
// Idempotently patches `drizzle-kit pull` output so it runs under the project's strict NodeNext + ESM setup:
//   1. Rewrites every relative import to the `#/` alias so it flows through the dev/prod conditional
//      `imports` field (relative paths don't — they're resolved literally, so dev would look for a
//      non-existent .js file next to the .ts source).
//      e.g. `from './schema'` → `from '#/storage/drizzle/schema.js'`
//   2. Prepends `// @ts-nocheck` + `/* eslint-disable */` to silence unused-import/param errors
//      drizzle-kit leaves behind.
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const srcRoot = path.join(root, 'src');
const files = ['src/storage/drizzle/schema.ts', 'src/storage/drizzle/relations.ts'];

const HEADER_MARKER = '@ts-nocheck';
const HEADER = '// @ts-nocheck\n/* eslint-disable */\n\n';
const RELATIVE_IMPORT_RE = /(from\s+['"])(\.\.?\/[^'"]+?)(['"])/g;
const HAS_EXTENSION_RE = /\.[a-zA-Z0-9]+$/;

const toAlias = (filePath: string, spec: string): string | undefined => {
  const resolved = path.resolve(path.dirname(filePath), spec);
  if (!resolved.startsWith(srcRoot + path.sep)) return undefined;

  let rel = path.relative(srcRoot, resolved).split(path.sep).join('/');
  if (rel.endsWith('.ts')) rel = `${rel.slice(0, -3)}.js`;
  else if (!HAS_EXTENSION_RE.test(rel)) rel = `${rel}.js`;

  return `#/${rel}`;
};

const rewriteImports = (filePath: string, src: string): string =>
  src.replaceAll(
    RELATIVE_IMPORT_RE,
    (_match: string, prefix: string, spec: string, suffix: string) => {
      const aliased = toAlias(filePath, spec);
      return aliased ? `${prefix}${aliased}${suffix}` : `${prefix}${spec}${suffix}`;
    }
  );

const addHeader = (src: string): string => (src.includes(HEADER_MARKER) ? src : HEADER + src);

const isMissingFileError = (error: unknown): boolean =>
  error instanceof Error && 'code' in error && error.code === 'ENOENT';

for (const rel of files) {
  const filePath = path.resolve(root, rel);
  let src: string;
  try {
    src = await readFile(filePath, 'utf8');
  } catch (error) {
    if (isMissingFileError(error)) {
      console.warn(`skip (not found): ${rel}`);
      continue;
    }
    throw error;
  }

  const patched = addHeader(rewriteImports(filePath, src));
  if (patched === src) {
    console.log(`ok: ${rel}`);
    continue;
  }

  await writeFile(filePath, patched);
  console.log(`patched: ${rel}`);
}
