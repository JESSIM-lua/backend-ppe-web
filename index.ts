import express from "express";
import { ApolloServer } from "apollo-server-express";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { typeDefs } from "./schema/typeDefs";
import { resolvers } from "./schema/resolvers";

dotenv.config();

async function startServer() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  // 🚪 Route de login
  app.post("/api/auth/login", (req, res) => {
    const { username, password } = req.body;

    if (username === "admin" && password === "admin") {
      const token = jwt.sign(
        { username },
        process.env.JWT_SECRET as string,
        { expiresIn: "60s" } // ou "20s" pour test rapide
      );

      return res.json({
        access_token: token,
        username: username,
      });
    } else {
      return res.status(401).json({ message: "Unauthorized" });
    }
  });

  // 🔒 Middleware de vérification du token
  app.use("/graphql", (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    try {
      jwt.verify(token, process.env.JWT_SECRET as string);
      next();
    } catch (err) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }
  });

  // 🚀 Serveur Apollo
  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();
  server.applyMiddleware({ app });

  const PORT = parseInt(process.env.PORT || "4000", 10);
  app.listen(PORT, "0.0.0.0", () =>
    console.log(
      `🚀 Server ready at http://${getLocalIp()}:${PORT}${server.graphqlPath}`
    )
  );

  function getLocalIp() {
    const { networkInterfaces } = require("os");
    const nets = networkInterfaces();
    for (const name of Object.keys(nets)) {
      for (const net of nets[name]) {
        if (net.family === "IPv4" && !net.internal) {
          return net.address;
        }
      }
    }
    return "localhost";
  }
}

startServer();
