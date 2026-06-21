import Fastify from 'fastify';
import { registerPlugins } from './db/plugins.js';
import { registerRoutes } from './routes/index.js';
import './db/init.js';
import path from 'path';
import fs from 'fs';

const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const fastify = Fastify({
  logger: true
});

await registerPlugins(fastify);
await registerRoutes(fastify);

const PORT = parseInt(process.env.PORT || '3001');

try {
  await fastify.listen({ port: PORT, host: '0.0.0.0' });
  console.log(`Server running at http://localhost:${PORT}`);
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
