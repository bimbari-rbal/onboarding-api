"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSpec = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const env_1 = require("./env");
const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Chatbot API',
        version: '1.0.0',
        description: 'A modern chatbot API backend with Stack.AI integration, similar to ChatGPT',
        contact: {
            name: 'API Support',
            email: 'support@example.com'
        }
    },
    servers: [
        {
            url: `http://localhost:${env_1.config.port}`,
            description: 'Development server'
        },
        {
            url: 'https://api.example.com',
            description: 'Production server'
        }
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                description: 'Enter your JWT token in the format: Bearer <token>'
            }
        },
        schemas: {
            User: {
                type: 'object',
                properties: {
                    id: {
                        type: 'string',
                        description: 'User ID'
                    },
                    email: {
                        type: 'string',
                        format: 'email',
                        description: 'User email address'
                    },
                    name: {
                        type: 'string',
                        description: 'User name'
                    },
                    createdAt: {
                        type: 'string',
                        format: 'date-time',
                        description: 'User creation timestamp'
                    }
                }
            },
            Conversation: {
                type: 'object',
                properties: {
                    id: {
                        type: 'string',
                        description: 'Conversation ID'
                    },
                    title: {
                        type: 'string',
                        description: 'Conversation title'
                    },
                    createdAt: {
                        type: 'string',
                        format: 'date-time',
                        description: 'Creation timestamp'
                    },
                    updatedAt: {
                        type: 'string',
                        format: 'date-time',
                        description: 'Last update timestamp'
                    }
                }
            },
            Message: {
                type: 'object',
                properties: {
                    id: {
                        type: 'string',
                        description: 'Message ID'
                    },
                    role: {
                        type: 'string',
                        enum: ['user', 'assistant', 'system'],
                        description: 'Message role'
                    },
                    content: {
                        type: 'string',
                        description: 'Message content'
                    },
                    createdAt: {
                        type: 'string',
                        format: 'date-time',
                        description: 'Message timestamp'
                    }
                }
            },
            Error: {
                type: 'object',
                properties: {
                    error: {
                        type: 'string',
                        description: 'Error message'
                    },
                    details: {
                        type: 'array',
                        items: {
                            type: 'object'
                        },
                        description: 'Validation error details'
                    }
                }
            }
        }
    },
    tags: [
        {
            name: 'Authentication',
            description: 'User authentication and profile management'
        },
        {
            name: 'Conversations',
            description: 'Conversation management endpoints'
        },
        {
            name: 'Chat',
            description: 'Chat messaging endpoints with AI integration'
        },
        {
            name: 'Health',
            description: 'Health check endpoint'
        }
    ]
};
const options = {
    swaggerDefinition,
    apis: ['./src/routes/*.ts', './src/index.ts']
};
exports.swaggerSpec = (0, swagger_jsdoc_1.default)(options);
//# sourceMappingURL=swagger.js.map