import { FastifyRequest, FastifyReply } from 'fastify';
import { authService } from '../services/auth.service';
import { z } from 'zod';

const authSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

export const authController = {
    signup: async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const { email, password } = authSchema.parse(request.body);
            const data = await authService.signup(email, password);
            return reply.send({ success: true, data });
        } catch (err: any) {
            if (err instanceof z.ZodError) {
                return reply.status(400).send({ success: false, error: err.issues });
            }
            return reply.status(500).send({ success: false, error: err.message });
        }
    },

    login: async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const { email, password } = authSchema.parse(request.body);
            const data = await authService.login(email, password);
            return reply.send({ success: true, data });
        } catch (err: any) {
            if (err instanceof z.ZodError) {
                return reply.status(400).send({ success: false, error: err.issues });
            }
            return reply.status(401).send({ success: false, error: err.message });
        }
    },
};
