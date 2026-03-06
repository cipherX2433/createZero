import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import * as dotenv from 'dotenv';

dotenv.config();

const server = Fastify({
    logger: true,
});

// Register Plugins
server.register(helmet);
server.register(cors, {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
});

// Error Handler
server.setErrorHandler((error: any, request, reply) => {
    server.log.error(error);
    reply.status(error.statusCode || 500).send({
        success: false,
        error: error.message || 'Internal Server Error',
    });
});

// Register Routes
import authRoutes from './routes/auth.routes';
import scriptRoutes from './routes/script.routes';

server.register(authRoutes, { prefix: '/api/v1/auth' });
server.register(scriptRoutes, { prefix: '/api/v1/scripts' });

// Health Check
server.get('/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() };
});

const start = async () => {
    try {
        const port = Number(process.env.PORT) || 3001;
        await server.listen({ port, host: '0.0.0.0' });
        console.log(`Server listening on http://localhost:${port}`);
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};

start();
