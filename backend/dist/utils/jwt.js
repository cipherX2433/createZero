"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
/**
 * Generates a Supabase-compatible JWT.
 * Supabase expects the JWT to be signed with the JWT Secret and contain specific claims.
 * We include the `sub` (user_id), `role`, and `email` to match standard Supabase behavior,
 * which allows RLS policies utilizing `request.jwt.claims` or `auth.uid()` (if properly set) to function.
 */
const generateToken = (userId, email, role = 'authenticated') => {
    // We use the Supabase JWT secret so that PostgREST accepts the token.
    // This should be in your .env as SUPABASE_JWT_SECRET or JWT_SECRET.
    const secret = process.env.SUPABASE_JWT_SECRET || process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('No JWT secret found in environment variables to sign the token.');
    }
    const payload = {
        aud: 'authenticated', // Important for Supabase RLS
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 7 days expiration
        sub: userId,
        email: email,
        app_metadata: {
            provider: 'email',
            providers: ['email'],
        },
        user_metadata: {},
        role: role,
        aal: 'aal1',
    };
    return jsonwebtoken_1.default.sign(payload, secret);
};
exports.generateToken = generateToken;
const verifyToken = (token) => {
    const secret = process.env.SUPABASE_JWT_SECRET || process.env.JWT_SECRET;
    if (!secret)
        throw new Error('No JWT secret found for verification');
    return jsonwebtoken_1.default.verify(token, secret);
};
exports.verifyToken = verifyToken;
