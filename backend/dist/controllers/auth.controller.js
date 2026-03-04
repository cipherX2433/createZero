"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const auth_service_1 = require("../services/auth.service");
const zod_1 = require("zod");
const signupSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
    name: zod_1.z.string().min(2).optional(),
});
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
});
exports.authController = {
    signup: async (request, reply) => {
        try {
            const { email, password, name } = signupSchema.parse(request.body);
            const data = await auth_service_1.authService.signup(email, password, name);
            return reply.send({ success: true, data });
        }
        catch (err) {
            if (err instanceof zod_1.z.ZodError) {
                return reply.status(400).send({ success: false, error: err.issues });
            }
            return reply.status(500).send({ success: false, error: err.message });
        }
    },
    login: async (request, reply) => {
        try {
            const { email, password } = loginSchema.parse(request.body);
            const data = await auth_service_1.authService.login(email, password);
            return reply.send({ success: true, data });
        }
        catch (err) {
            if (err instanceof zod_1.z.ZodError) {
                return reply.status(400).send({ success: false, error: err.issues });
            }
            return reply.status(401).send({ success: false, error: err.message });
        }
    },
    getProfile: async (request, reply) => {
        try {
            const userId = request.user.id;
            const data = await auth_service_1.authService.getProfile(userId);
            return reply.send({ success: true, data });
        }
        catch (err) {
            return reply.status(500).send({ success: false, error: err.message });
        }
    },
    updateProfile: async (request, reply) => {
        try {
            const userId = request.user.id;
            const profileData = request.body;
            const data = await auth_service_1.authService.updateProfile(userId, profileData);
            return reply.send({ success: true, data });
        }
        catch (err) {
            return reply.status(500).send({ success: false, error: err.message });
        }
    },
};
