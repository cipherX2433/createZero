"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = authRoutes;
const auth_middleware_1 = require("../middleware/auth.middleware");
async function authRoutes(fastify, options) {
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
