import dotenv from 'dotenv';

dotenv.config();

export const config = {
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