import express from 'express'
import { Request, Response } from 'express'
import userRoutes from './routes/user.route'
import lobbyRoutes from './routes/lobby.route'
import cors from 'cors'

const app = express()
app.use(express.json())
app.use(cors())

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

export default app
