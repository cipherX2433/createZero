import { FastifyRequest, FastifyReply } from 'fastify';
import { verifyToken } from '../utils/jwt';

export const authMiddleware = async (request: FastifyRequest, reply: FastifyReply) => {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
        return reply.status(401).send({
            success: false,
            error: 'Authorization header missing',
        });
    }

    try {
        const token = authHeader.replace('Bearer ', '');
        const decoded: any = verifyToken(token);

        if (!decoded || !decoded.sub) {
            throw new Error('Invalid token');
        }

        // Attach user info to request context
        (request as any).user = {
            id: decoded.sub,
            email: decoded.email,
        };
    } catch (err) {
        return reply.status(401).send({
            success: false,
            error: 'Invalid or expired token',
        });
    }
};

