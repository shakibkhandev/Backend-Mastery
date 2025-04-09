# TypeScript Express Server Setup Guide

This guide will walk you through creating a TypeScript Express server from scratch.

## Step-by-Step Setup

### Step 1: Initialize the Project

```bash
# Create a new directory and navigate into it
mkdir typescript-express
cd typescript-express

# Initialize a new Node.js project
npm init -y
```

### Step 2: Install Dependencies

```bash
# Install TypeScript and tsc-watch as development dependencies
npm install typescript tsc-watch -D

# Install Express and its type definitions
npm install express
npm install @types/express -D
```

### Step 3: Configure TypeScript

```bash
# Generate TypeScript configuration file
npx tsc --init
```

Update the `tsconfig.json` with these essential settings:

```json
{
  "compilerOptions": {
    "target": "es2016",
    "module": "commonjs",
    "rootDir": "./src",
    "outDir": "./dist",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true
  }
}
```

### Step 4: Update package.json Scripts

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "start": "node dist/index.js",
    "dev": "tsc-watch --onSuccess \"node dist/index.js\"",
    "build": "tsc -p ."
  }
}
```

### Step 5: Create Project Structure

```bash
# Create source directory
mkdir src

# Create the main application file
touch src/index.ts
```

Add this basic Express server code to `src/index.ts`:

```typescript
import express, { NextFunction, Request, Response } from "express";

const app = express();
const port = process.env.PORT || 3000;

// Middleware for parsing JSON bodies
app.use(express.json());

// Basic route
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Welcome to the Express + TypeScript Server!" });
});

// Sample route with parameters
app.get("/api/hello/:name", (req: Request, res: Response) => {
  const { name } = req.params;
  res.json({ message: `Hello, ${name}!` });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
```

## Running the Project

1. **Development Mode** (with hot-reloading):

   ```bash
   npm run dev
   ```

2. **Production Build**:

   ```bash
   npm run build
   ```

3. **Start Production Server**:
   ```bash
   npm start
   ```

## Testing the Server

Once the server is running, you can test it using:

- Browser: Visit `http://localhost:3000`
- API Endpoint: Visit `http://localhost:3000/api/hello/YourName`

## Project Structure

```
typescript-express/
├── src/               # Source files
│   └── index.ts      # Main application entry point
├── dist/             # Compiled JavaScript files
├── package.json      # Project dependencies and scripts
└── tsconfig.json     # TypeScript configuration
```

## Additional Tips

1. **Environment Variables**: Consider using `dotenv` for managing environment variables:

   ```bash
   npm install dotenv
   ```

2. **Code Organization**: As your project grows, consider organizing code into:

   - `src/routes/` - Route handlers
   - `src/controllers/` - Business logic
   - `src/middleware/` - Custom middleware
   - `src/models/` - Data models
   - `src/config/` - Configuration files

3. **Type Safety**: Take advantage of TypeScript's type system by:
   - Creating interfaces for your data models
   - Using type definitions for request/response objects
   - Adding proper error types

## Common Issues and Solutions

1. **TypeScript Compilation Errors**:

   - Ensure all dependencies have proper type definitions installed
   - Check `tsconfig.json` settings
   - Use proper import/export syntax

2. **Hot Reloading Not Working**:

   - Verify `tsc-watch` is properly installed
   - Check if the `dev` script is correctly configured
   - Ensure no TypeScript compilation errors

3. **Port Already in Use**:
   - Change the port number in your code
   - Kill the process using the port
   - Use environment variables to configure the port

## Next Steps

1. Add more routes and controllers
2. Implement database integration
3. Add authentication middleware
4. Set up testing with Jest
5. Configure CORS
6. Add API documentation with Swagger
