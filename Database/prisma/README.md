# Prisma REST API Project

This project demonstrates how to build a REST API using Prisma, Node.js, and Express.js.

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- A database (PostgreSQL, MySQL, or SQLite)

## Step-by-Step Setup Guide

1. **Initialize the Project**

   ```bash
   # Create a new directory and navigate into it
   mkdir prisma-rest-api
   cd prisma-rest-api

   # Initialize a new Node.js project
   npm init -y
   ```

2. **Install Dependencies**

   ```bash
   # Install required dependencies
   npm install @prisma/client express

   # Install development dependencies
   npm install -D prisma nodemon
   ```

3. **Initialize Prisma**

   ```bash
   # Initialize Prisma in your project
   npx prisma init
   ```

4. **Configure Database Schema**
   Create or modify the `prisma/schema.prisma` file:

   ```prisma
   datasource db {
     provider = "postgresql" // or "mysql" or "sqlite"
     url      = env("DATABASE_URL")
   }

   generator client {
     provider = "prisma-client-js"
   }

   model User {
     id    Int     @id @default(autoincrement())
     email String  @unique
     name  String?
   }
   ```

5. **Set Up Environment Variables**
   Create a `.env` file:

   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/your_database"
   # For SQLite, use: DATABASE_URL="file:./dev.db"
   ```

6. **Create Database Migration**

   ```bash
   # Create and apply the migration
   npx prisma migrate dev --name init
   ```

7. **Create Express Server**
   Create `src/index.js`:

   ```javascript
   const express = require("express");
   const { PrismaClient } = require("@prisma/client");

   const prisma = new PrismaClient();
   const app = express();

   app.use(express.json());

   // Routes will be added here

   const PORT = process.env.PORT || 3000;
   app.listen(PORT, () => {
     console.log(`Server is running on port ${PORT}`);
   });
   ```

8. **Add Scripts to package.json**
   Update your package.json with these scripts:

   ```json
   {
     "scripts": {
       "dev": "nodemon src/index.js",
       "start": "node src/index.js"
     }
   }
   ```

9. **Test the API**
   You can use the provided `test.http` file to test the following endpoints:
   - POST `/users` - Create a new user
   - GET `/users` - Get all users
   - GET `/users/:id` - Get user by ID

## Running the Project

1. **Start the Development Server**

   ```bash
   npm run dev
   ```

2. **Start Production Server**
   ```bash
   npm start
   ```

## API Endpoints

- `POST /users` - Create a new user

  ```json
  {
    "email": "user@example.com",
    "name": "User Name"
  }
  ```

- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID

## Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs/)
- [Express.js Documentation](https://expressjs.com/)
