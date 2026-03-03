import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { authMiddleware } from '../middleware/auth.middleware';

export default async function authRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {
    // Simple check endpoint to verify token
    fastify.get('/me', { preHandler: [authMiddleware] }, async (request, reply) => {
        return {
            success: true,
            data: {
                user: (request as any).user,
            },
        };
    });
}
