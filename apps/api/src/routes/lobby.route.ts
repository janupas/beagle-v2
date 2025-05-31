import { Router } from 'express'
import lobbyController from '../controllers/lobby.controller'

const router = Router()

router.post('/lobby', lobbyController.CreateNewLobby)

export default router
