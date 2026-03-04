"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jwt_1 = require("../utils/jwt");
const authMiddleware = async (request, reply) => {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
        return reply.status(401).send({
            success: false,
            error: 'Authorization header missing',
        });
    }
    try {
        const token = authHeader.replace('Bearer ', '');
        const decoded = (0, jwt_1.verifyToken)(token);
        if (!decoded || !decoded.sub) {
            throw new Error('Invalid token');
        }
        // Attach user info to request context
        request.user = {
            id: decoded.sub,
            email: decoded.email,
        };
    }
    catch (err) {
        return reply.status(401).send({
            success: false,
            error: 'Invalid or expired token',
        });
    }
};
exports.authMiddleware = authMiddleware;
