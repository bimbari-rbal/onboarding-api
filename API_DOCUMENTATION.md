# Chatbot API Documentation

A modern, production-ready chatbot API backend built with Node.js, Express, TypeScript, MongoDB, and Stack.AI integration.

## Prerequisites

- Node.js 18+
- MongoDB instance running
- Stack.AI API key

## Environment Variables

Configure these variables in your `.env` file:

```
MONGODB_URI=mongodb://localhost:27017/chatbot
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d
STACK_AI_API_KEY=your-stack-ai-api-key
STACK_AI_API_URL=https://api.stack-ai.com/v1
PORT=3000
NODE_ENV=development
```

## Installation

```bash
npm install
```

## Running the Application

**Development mode:**
```bash
npm run dev
```

**Production build:**
```bash
npm run build
npm start
```

## API Endpoints

### Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "token": "jwt-token",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "jwt-token",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

#### Get Profile
```http
GET /api/auth/profile
Authorization: Bearer {token}
```

**Response:**
```json
{
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2025-09-30T00:00:00.000Z"
  }
}
```

### Conversations

All conversation endpoints require authentication via Bearer token.

#### Create Conversation
```http
POST /api/conversations
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "My Chat Session"
}
```

**Response:**
```json
{
  "message": "Conversation created successfully",
  "conversation": {
    "id": "conversation-id",
    "title": "My Chat Session",
    "createdAt": "2025-09-30T00:00:00.000Z",
    "updatedAt": "2025-09-30T00:00:00.000Z"
  }
}
```

#### Get All Conversations
```http
GET /api/conversations?page=1&limit=20
Authorization: Bearer {token}
```

**Response:**
```json
{
  "conversations": [
    {
      "id": "conversation-id",
      "title": "My Chat Session",
      "createdAt": "2025-09-30T00:00:00.000Z",
      "updatedAt": "2025-09-30T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1,
    "pages": 1
  }
}
```

#### Get Single Conversation
```http
GET /api/conversations/{conversationId}
Authorization: Bearer {token}
```

**Response:**
```json
{
  "conversation": {
    "id": "conversation-id",
    "title": "My Chat Session",
    "createdAt": "2025-09-30T00:00:00.000Z",
    "updatedAt": "2025-09-30T00:00:00.000Z"
  },
  "messages": [
    {
      "id": "message-id",
      "role": "user",
      "content": "Hello",
      "createdAt": "2025-09-30T00:00:00.000Z"
    },
    {
      "id": "message-id-2",
      "role": "assistant",
      "content": "Hi! How can I help you?",
      "createdAt": "2025-09-30T00:00:00.000Z"
    }
  ]
}
```

#### Update Conversation
```http
PUT /api/conversations/{conversationId}
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Updated Title"
}
```

#### Delete Conversation
```http
DELETE /api/conversations/{conversationId}
Authorization: Bearer {token}
```

### Chat

All chat endpoints require authentication via Bearer token.

#### Send Message (Non-Streaming)
```http
POST /api/chat/message
Authorization: Bearer {token}
Content-Type: application/json

{
  "conversationId": "conversation-id",
  "message": "What is Node.js?"
}
```

**Response:**
```json
{
  "userMessage": {
    "id": "message-id",
    "role": "user",
    "content": "What is Node.js?",
    "createdAt": "2025-09-30T00:00:00.000Z"
  },
  "assistantMessage": {
    "id": "message-id-2",
    "role": "assistant",
    "content": "Node.js is a JavaScript runtime...",
    "createdAt": "2025-09-30T00:00:00.000Z"
  }
}
```

#### Send Message (Streaming)
```http
POST /api/chat/message/stream
Authorization: Bearer {token}
Content-Type: application/json

{
  "conversationId": "conversation-id",
  "message": "Tell me about TypeScript"
}
```

**Response:** Server-Sent Events (SSE) stream

```
data: {"type":"user_message","message":{"id":"msg-id","role":"user","content":"Tell me about TypeScript"}}

data: {"type":"chunk","content":"TypeScript"}

data: {"type":"chunk","content":" is a"}

data: {"type":"chunk","content":" programming language..."}

data: {"type":"done","message":{"id":"msg-id-2","role":"assistant","content":"TypeScript is a programming language..."}}
```

#### Delete Message
```http
DELETE /api/chat/message/{messageId}
Authorization: Bearer {token}
```

### Health Check

```http
GET /health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-09-30T00:00:00.000Z"
}
```

## Rate Limits

- General API requests: 100 requests per 15 minutes
- Authentication endpoints: 5 requests per 15 minutes
- Chat endpoints: 20 requests per minute

## Error Responses

All error responses follow this format:

```json
{
  "error": "Error message",
  "details": []
}
```

Common HTTP status codes:
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing or invalid token)
- `404` - Not Found
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error

## Architecture

### Tech Stack
- **Runtime:** Node.js with TypeScript
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **AI Integration:** Stack.AI
- **Authentication:** JWT with bcrypt password hashing
- **Security:** Helmet, CORS, rate limiting

### Project Structure
```
src/
├── config/          # Configuration files (database, env)
├── controllers/     # Request handlers
├── middleware/      # Express middleware (auth, validation, error handling)
├── models/          # MongoDB models (User, Conversation, Message)
├── routes/          # API route definitions
├── services/        # Business logic (Stack.AI integration)
├── utils/           # Utility functions (JWT, password hashing)
└── index.ts         # Application entry point
```

## Features

- User authentication with JWT
- Conversation management
- Real-time streaming chat responses
- Message history tracking
- Rate limiting and request validation
- Secure password hashing
- MongoDB persistence
- Stack.AI integration
- Graceful shutdown handling
- Health check endpoint
- Error handling and logging