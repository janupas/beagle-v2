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

let activeUsers: any = {}
let activeSockets: any = {}

/**
 * Socket connection established
 */
io.on('connection', (socket) => {
  logger.info('Socket connected: ' + socket.id)

  /**
   * We expect the payload object like this
   *
   * {
   *   user: {
   *    avatar: string,
   *    created_at: string,
   *    display_name: string,
   *    id: number,
   *    supabase_id: string
   *   },
   *   lobby: {
   *    admin_id: string,
   *    created_at: string,
   *    id: number,
   *    name: string
   *   }
   * }
   */
  socket.on('user-connect', (payload) => {
    const userDetails = payload.user

    socket.data.supabase_uid = userDetails.supabase_uid

    if (!activeSockets.hasOwnProperty(socket.id)) {
      activeSockets[socket.id] = socket
    }

    if (!activeUsers.hasOwnProperty(userDetails.supabase_uid)) {
      activeUsers[userDetails.supabase_uid] = {
        userDetails: userDetails,
        sockets: [socket.id],
      }
    } else {
      // check if the socket id exists already
      let check = false

      activeUsers[userDetails.supabase_uid].sockets.forEach((sId: string) => {
        if (sId === socket.id) {
          check = true
        }
      })

      if (!check) activeUsers[userDetails.supabase_uid].sockets.push(socket.id)
    }

    logger.info(activeUsers)
    logger.info(activeSockets)

    // emitting the active users
    io.emit('users', activeUsers)
  })

  socket.on('disconnect', () => {
    logger.info('User disconnected: ' + socket.id)

    const socketId = socket.id
    const supabase_uid = activeSockets[socketId].data.supabase_uid

    let userSocketList = activeUsers[supabase_uid].sockets
    userSocketList.splice(userSocketList.indexOf(socketId), 1)
    delete activeSockets[socketId]

    if (userSocketList.length === 0) {
      delete activeUsers[supabase_uid]
    }

    logger.info(activeUsers)
    logger.info(activeSockets)

    // emitting the active users
    io.emit('users', activeUsers)
  })
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
