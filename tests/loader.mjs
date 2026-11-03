import { isBuiltin } from 'node:module';
import { pathToFileURL } from 'node:url';
import fs from 'node:fs';
import path from 'node:path';

export async function resolve(specifier, context, defaultResolve) {
  const { parentURL } = context;

  // If it's a relative path without extension
  if (parentURL && (specifier.startsWith('./') || specifier.startsWith('../'))) {
    const parentDir = path.dirname(new URL(parentURL).pathname.replace(/^\/([A-Z]:)/, '$1'));
    const resolvedPath = path.resolve(parentDir, specifier);
    if (!path.extname(resolvedPath)) {
      if (fs.existsSync(resolvedPath + '.js')) {
        return defaultResolve(specifier + '.js', context);
      }
      if (fs.existsSync(resolvedPath + '.jsx')) {
        return defaultResolve(specifier + '.jsx', context);
      }
    }
  }

  return defaultResolve(specifier, context);
}
