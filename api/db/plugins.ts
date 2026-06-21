import { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';

export async function registerPlugins(fastify: FastInstance) {
  await fastify.register(cors, {
    origin: true,
    credentials: true
  });
}
