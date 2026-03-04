"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = authRoutes;
const auth_middleware_1 = require("../middleware/auth.middleware");
const auth_controller_1 = require("../controllers/auth.controller");
async function authRoutes(fastify, options) {
    // Custom Auth Endpoints
    fastify.post('/signup', auth_controller_1.authController.signup);
    fastify.post('/login', auth_controller_1.authController.login);
    // Profile Endpoints
    fastify.get('/profile', { preHandler: [auth_middleware_1.authMiddleware] }, auth_controller_1.authController.getProfile);
    fastify.put('/profile', { preHandler: [auth_middleware_1.authMiddleware] }, auth_controller_1.authController.updateProfile);
    // Simple check endpoint to verify token
    fastify.get('/me', { preHandler: [auth_middleware_1.authMiddleware] }, async (request, reply) => {
        return {
            success: true,
            data: {
                user: request.user,
            },
        };
    });
}
