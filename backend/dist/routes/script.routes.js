"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = scriptRoutes;
const auth_middleware_1 = require("../middleware/auth.middleware");
const script_controller_1 = require("../controllers/script.controller");
async function scriptRoutes(fastify, options) {
    // All script routes require authentication
    fastify.addHook('preHandler', auth_middleware_1.authMiddleware);
    fastify.post('/generate', script_controller_1.scriptController.generate);
}
