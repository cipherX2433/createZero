import { FastifyRequest, FastifyReply } from 'fastify';
import { authService } from '../services/auth.service';
import { z } from 'zod';

const signupSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().min(2).optional(),
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

export const authController = {
    signup: async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const { email, password, name } = signupSchema.parse(request.body);
            const data = await authService.signup(email, password, name);
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
            const { email, password } = loginSchema.parse(request.body);
            const data = await authService.login(email, password);
            return reply.send({ success: true, data });
        } catch (err: any) {
            if (err instanceof z.ZodError) {
                return reply.status(400).send({ success: false, error: err.issues });
            }
            return reply.status(401).send({ success: false, error: err.message });
        }
    },

    getProfile: async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const userId = (request as any).user.id;
            const data = await authService.getProfile(userId);
            return reply.send({ success: true, data });
        } catch (err: any) {
            return reply.status(500).send({ success: false, error: err.message });
        }
    },

    updateProfile: async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const userId = (request as any).user.id;
            const profileData = request.body as any;
            const data = await authService.updateProfile(userId, profileData);
            return reply.send({ success: true, data });
        } catch (err: any) {
            return reply.status(500).send({ success: false, error: err.message });
        }
    },
};


