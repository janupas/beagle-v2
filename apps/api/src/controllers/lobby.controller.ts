import { Request, Response } from 'express'
import { createNewLobbyService, getAllLobbiesService } from '../db/queries'

const CreateNewLobby = async (req: Request, res: Response) => {
  const { name, id } = req.body

  try {
    const newLobby = await createNewLobbyService({ name, adminId: id })

    if (newLobby) {
      res.json({
        success: true,
        lobby: newLobby,
      })
    } else {
      res.json({
        success: false,
      })
    }
  } catch (err) {
    res.json({
      success: false,
    })
  }
}

const getLobbies = async (req: Request, res: Response) => {
  try {
    const lobbies = await getAllLobbiesService()

    if (lobbies) {
      res.json({
        success: true,
        data: lobbies,
      })
    } else {
      res.json({
        success: false,
      })
    }
  } catch (err) {
    res.json({
      success: false,
    })
  }
}

export default {
  CreateNewLobby,
  getLobbies,
}
