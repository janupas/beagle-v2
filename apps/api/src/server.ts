import express from 'express'
import { Request, Response } from 'express'
import userRoutes from './routes/user.route'
import lobbyRoutes from './routes/lobby.route'
import cors from 'cors'
import { Server } from 'socket.io'
import { createServer } from 'http'
import { logger } from './config/logger'

const app = express()
app.use(express.json())
app.use(cors())

const httpServer = createServer(app)

const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
})

/**
 * Socket connection established
 */
io.on('connection', (socket) => {
  logger.info('Socket connected: ' + socket.id)
})

/**
 * / GET Endpoint
 */
app.get('/', (req: Request, res: Response) => {
  res.json({
    success: 1,
    message: 'Hello, World',
  })
})

/**
 * /api/users Endpoint
 */
app.use('/api/', userRoutes)

/**
 * /api/lobby Endpoint
 */
app.use('/api/', lobbyRoutes)

export default httpServer
