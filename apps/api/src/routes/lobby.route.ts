import { Router } from 'express'
import lobbyController from '../controllers/lobby.controller'

const router = Router()

router.post('/lobby', lobbyController.CreateNewLobby)
router.get('/lobby', lobbyController.getLobbies)
router.get('/lobby/:id', lobbyController.getSingleLobby)

export default router
