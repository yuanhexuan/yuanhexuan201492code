import Fastify from 'fastify';
import cors from '@fastify/cors';
import './db/init.js';
import { serverController, playerController } from './controllers/index.js';

const fastify = Fastify({ logger: true });

fastify.register(cors, { origin: true, credentials: true });

fastify.get('/api/server/status', async () => {
  return serverController.getStatus();
});

fastify.post('/api/server/start', async () => {
  return serverController.start();
});

fastify.post('/api/server/stop', async () => {
  return serverController.stop();
});

fastify.post('/api/server/restart', async () => {
  return serverController.restart();
});

fastify.get('/api/server/logs', async (request) => {
  const { limit = '50' } = request.query as { limit?: string };
  return serverController.getLogs(parseInt(limit));
});

fastify.post('/api/server/command', async (request) => {
  const { command } = request.body as { command: string };
  return serverController.sendCommand(command);
});

fastify.get('/api/players', async () => {
  return playerController.getOnline();
});

fastify.post('/api/players/kick', async (request) => {
  const { playerName } = request.body as { playerName: string };
  return playerController.kick(playerName);
});

fastify.post('/api/players/ban', async (request) => {
  const { playerName, reason } = request.body as { playerName: string; reason?: string };
  return playerController.ban(playerName, reason);
});

fastify.get('/api/bans', async () => {
  return playerController.getBans();
});

fastify.get('/api/health', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

const PORT = parseInt(process.env.PORT || '3001');

try {
  await fastify.listen({ port: PORT, host: '0.0.0.0' });
  console.log(`Server running at http://localhost:${PORT}`);
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
