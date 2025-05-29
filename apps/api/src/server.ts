import express from 'express'
import { Request, Response } from 'express'
import userRoutes from './routes/user.route'

const app = express()
app.use(express.json())

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

export default app
