import { Router } from 'express'
import UserController from '../controllers/user.controller'

const router = Router()

router.get('/users', UserController.getAllUsers)
router.post('/users', UserController.createNewUser)
router.get('/users/:id', UserController.getSingleUser)
router.patch('/users/:id', UserController.updateUserAvatar)

export default router
