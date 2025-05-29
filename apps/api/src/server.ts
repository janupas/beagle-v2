import express from 'express'
import { prisma } from './config/prisma.config'

const app = express()

app.use(express.json())

export default app
