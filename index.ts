import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import cors from 'cors'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import fs from 'fs'
import https from 'https'
import { typeDefs } from './schema/typeDefs'
import { resolvers } from './schema/resolvers'

dotenv.config()

async function startServer() {
  const app = express()
  app.use(cors())
  app.use(express.json())

  app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body
    if (username === 'admin' && password === 'admin') {
      const token = jwt.sign({ username }, process.env.JWT_SECRET as string, { expiresIn: '60s' })
      return res.json({ access_token: token, username })
    } else {
      return res.status(401).json({ message: 'Unauthorized' })
    }
  })

  app.use('/graphql', (req, res, next) => {
    const authHeader = req.headers.authorization
    const token = authHeader?.split(' ')[1]
    if (!token) return res.status(401).json({ error: 'No token provided' })

    try {
      jwt.verify(token, process.env.JWT_SECRET as string)
      next()
    } catch {
      return res.status(403).json({ error: 'Invalid or expired token' })
    }
  })

  const server = new ApolloServer({ typeDefs, resolvers })
  await server.start()
  server.applyMiddleware({ app })

  const credentials = {
    key: fs.readFileSync('./cert/172.18.158.191-key.pem'),
    cert: fs.readFileSync('./cert/172.18.158.191.pem'),
  }

  const PORT = parseInt(process.env.PORT || '4000', 10)
  https.createServer(credentials, app).listen(PORT, '0.0.0.0', () => {
    console.log(`✅ HTTPS server running at https://172.18.158.191:${PORT}${server.graphqlPath}`)
  })
}

startServer()

