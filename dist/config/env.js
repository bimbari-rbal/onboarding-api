"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
    port: process.env.PORT || 3000,
    mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/chatbot',
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
    stackAI: {
        apiKey: process.env.STACK_AI_API_KEY || '',
        apiUrl: process.env.STACK_AI_API_URL || 'https://api.stack-ai.com/v1'
    },
    nodeEnv: process.env.NODE_ENV || 'development'
};
//# sourceMappingURL=env.js.map