# Express Server

A basic Express server setup with common middleware and error handling.

## Features

- Express.js server
- CORS enabled
- JSON body parsing
- Error handling middleware
- Environment variable support
- Development mode with auto-reload

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the root directory (optional):

```bash
PORT=3000
```

3. Start the server:

```bash
# Production mode
npm start

# Development mode with auto-reload
npm run dev
```

## API Endpoints

- `GET /`: Welcome message
  - Response: `{ "message": "Welcome to the Express server!" }`

## Error Handling

The server includes a global error handling middleware that returns a 500 status code with an error message when something goes wrong.
