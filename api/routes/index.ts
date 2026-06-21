import { FastifyInstance } from 'fastify';
import { serverController, playerController } from '../controllers/index.js';

export async function registerRoutes(fastify: FastifyInstance) {
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

  fastify.get('/api/console/logs', async (request) => {
    const { limit = '50' } = request.query as { limit?: string };
    const logs = serverController.getLogs(parseInt(limit));
    return { logs };
  });

  fastify.post('/api/console/command', async (request) => {
    const { command } = request.body as { command: string };
    return serverController.sendCommand(command);
  });

  fastify.get('/api/players', async () => {
    return playerController.getOnline();
  });

  fastify.post('/api/players/kick', async (request) => {
    const { name } = request.body as { name: string };
    return playerController.kick(name);
  });

  fastify.post('/api/players/ban', async (request) => {
    const { name, reason } = request.body as { name: string; reason?: string };
    return playerController.ban(name, reason);
  });

  fastify.get('/api/bans', async () => {
    return playerController.getBans();
  });

  fastify.delete('/api/bans/:id', async (request) => {
    const { id } = request.params as { id: string };
    return { success: true, message: `Ban ${id} removed` };
  });
}
