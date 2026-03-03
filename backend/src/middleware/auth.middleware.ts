import { FastifyRequest, FastifyReply } from 'fastify';
import { supabase } from '../db/supabase';

export const authMiddleware = async (request: FastifyRequest, reply: FastifyReply) => {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
        return reply.status(401).send({
            success: false,
            error: 'Authorization header missing',
        });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
        return reply.status(401).send({
            success: false,
            error: 'Invalid or expired token',
        });
    }

    // Attach user to request context
    (request as any).user = data.user;
};
