"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const env_1 = require("./config/env");
const database_1 = require("./config/database");
const errorHandler_1 = require("./middleware/errorHandler");
const rateLimiter_1 = require("./middleware/rateLimiter");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const conversationRoutes_1 = __importDefault(require("./routes/conversationRoutes"));
const chatRoutes_1 = __importDefault(require("./routes/chatRoutes"));
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, morgan_1.default)('dev'));
app.use(rateLimiter_1.generalLimiter);
app.get('/health', (_req, res) => {
    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString()
    });
});
app.use('/api/auth', authRoutes_1.default);
app.use('/api/conversations', conversationRoutes_1.default);
app.use('/api/chat', chatRoutes_1.default);
app.use(errorHandler_1.errorHandler);
const startServer = async () => {
    try {
        await (0, database_1.connectDatabase)();
        const server = app.listen(env_1.config.port, () => {
            console.log(`Server running on port ${env_1.config.port}`);
            console.log(`Environment: ${env_1.config.nodeEnv}`);
        });
        const gracefulShutdown = async (signal) => {
            console.log(`\n${signal} received. Starting graceful shutdown...`);
            server.close(async () => {
                console.log('HTTP server closed');
                await (0, database_1.disconnectDatabase)();
                process.exit(0);
            });
            setTimeout(() => {
                console.error('Forced shutdown after timeout');
                process.exit(1);
            }, 10000);
        };
        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};
startServer();
//# sourceMappingURL=index.js.map