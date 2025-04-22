const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const express = require("express");
const cors = require("cors");
const axios = require("axios");

async function StartServer() {
  const app = express();

  // Apply Express middlewares BEFORE Apollo middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  const server = new ApolloServer({
    typeDefs: `
      type User {
        id: ID!
        name: String!
        username: String!
        email: String!
        phone: String!
        website: String!
      }

      type Todo { 
        userId: ID!         
        id : ID!
        title : String!
        completed : Boolean!
        user : User
      }

      type Query {             
        getTodos: [Todo]
        getAllUsers: [User]
        getUserById(id: ID!): User
      }
    `,
    resolvers: {
      Todo: {
        user: async (todo) => {
          return (
            await axios.get(
              `https://jsonplaceholder.typicode.com/users/${todo.userId}`
            )
          ).data;
        },
      },
      Query: {
        getTodos: async () => {
          return (
            await axios.get("https://jsonplaceholder.typicode.com/todos")
          ).data;
        },
        getAllUsers: async () => {
          return (
            await axios.get("https://jsonplaceholder.typicode.com/users")
          ).data;
        },
        getUserById: async (parent, args) => {
          return (
            await axios.get(
              `https://jsonplaceholder.typicode.com/users/${args.id}`
            )
          ).data;
        },
      },
    },
  });

  await server.start();

  // Apollo middleware should be applied AFTER express.json()
  app.use("/graphql", expressMiddleware(server, {})); // Pass an empty config object

  // Root route for testing
  app.get("/", (req, res) => {
    res.status(200).json({ success: true });
  });

  app.listen(5000, () => {
    console.log("🚀 Server ready at http://localhost:5000/graphql");
  });
}

StartServer();
