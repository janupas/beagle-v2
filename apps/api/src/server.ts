import express from 'express'
import { Request, Response } from 'express'
import userRoutes from './routes/user.route'
import lobbyRoutes from './routes/lobby.route'
import cors from 'cors'
import { Server } from 'socket.io'
import { createServer } from 'http'
import { logger } from './config/logger'
import { getLobbyMessagesService, insertNewMessageService } from './db/queries'

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

const DUMMY_MESSAGES = [
  {
    id: 1,
    value: 'Hellow',
    userId: 2,
    roomId: 7,
  },
  {
    id: 2,
    value: 'Hi',
    userId: 2,
    roomId: 7,
  },
  {
    id: 3,
    value: 'Good morning',
    userId: 3,
    roomId: 8,
  },
  {
    id: 4,
    value: 'Fuck you mate',
    userId: 3,
    roomId: 7,
  },
]

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
    const supabase_uid = userDetails?.supabase_uid

    if (!supabase_uid) return

    // Attach user ID to the socket's data
    socket.data.supabase_uid = supabase_uid

    // Register the socket if not already tracked
    if (!activeSockets[socket.id]) {
      activeSockets[socket.id] = socket
    }

    // Register or update the user entry
    if (!activeUsers[supabase_uid]) {
      activeUsers[supabase_uid] = {
        userDetails: userDetails,
        sockets: [socket.id],
      }
    } else {
      const userSockets = activeUsers[supabase_uid].sockets
      if (!userSockets.includes(socket.id)) {
        userSockets.push(socket.id)
      }
    }

    logger.info(activeUsers)
    logger.info(activeSockets)

    // Emit updated active users
    io.emit('users', activeUsers)
  })

  socket.on('disconnect', () => {
    logger.info('User disconnected: ' + socket.id)

    const socketData = activeSockets[socket.id]?.data
    if (!socketData) return

    const socketId = socket.id
    const supabase_uid = socketData.supabase_uid

    let userSocketList = activeUsers[supabase_uid]?.sockets
    if (userSocketList) {
      userSocketList.splice(userSocketList.indexOf(socketId), 1)
    }

    delete activeSockets[socketId]

    if (userSocketList && userSocketList.length === 0) {
      delete activeUsers[supabase_uid]
    }

    logger.info(activeUsers)
    logger.info(activeSockets)

    // emitting the active users
    io.emit('users', activeUsers)
  })

  socket.on('initial-room-join', async (roomId: number) => {
    socket.join(roomId.toString())
    logger.info('room id: ' + roomId)
    const msgs = await getLobbyMessagesService(roomId)
    io.to(roomId.toString()).emit('messages', msgs)
  })

  /**
   * Socket event to handle messages
   */
  socket.on('message', (payload) => {
    insertNewMessageService({
      value: payload.data.value,
      userId: payload.user.supabase_uid,
      roomId: payload.room.id,
      display_name: payload.user.display_name,
    })
    logger.info(payload)

    // emit the sent message too
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
