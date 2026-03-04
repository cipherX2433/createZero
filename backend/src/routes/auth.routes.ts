import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { authMiddleware } from '../middleware/auth.middleware';
import { authController } from '../controllers/auth.controller';

export default async function authRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {
    // Custom Auth Endpoints
    fastify.post('/signup', authController.signup);
    fastify.post('/login', authController.login);

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
