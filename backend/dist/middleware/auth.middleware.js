"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const supabase_1 = require("../db/supabase");
const authMiddleware = async (request, reply) => {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
        return reply.status(401).send({
            success: false,
            error: 'Authorization header missing',
        });
    }
    const token = authHeader.replace('Bearer ', '');
    const { data, error } = await supabase_1.supabase.auth.getUser(token);
    if (error || !data.user) {
        return reply.status(401).send({
            success: false,
            error: 'Invalid or expired token',
        });
    }
    // Attach user to request context
    request.user = data.user;
};
exports.authMiddleware = authMiddleware;
