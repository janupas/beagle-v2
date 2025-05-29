import { Router } from 'express'
import UserController from '../controllers/user.controller'

const router = Router()

router.get('/users', UserController.getAllUsers)
router.post('/users', UserController.createNewUser)

export default router
