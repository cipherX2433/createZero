import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { authMiddleware } from '../middleware/auth.middleware';
import { scriptController } from '../controllers/script.controller';

export default async function scriptRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {
    // All script routes require authentication
    fastify.addHook('preHandler', authMiddleware);

    fastify.post('/generate', scriptController.generate);
    fastify.get('/history', scriptController.getHistory);
}
