import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import { startServer } from './index.js';

export { startServer };

const isDirectExecution = process.argv[1]
  && import.meta.url === pathToFileURL(resolve(process.argv[1])).href;

if (isDirectExecution) {
  await startServer();
}
