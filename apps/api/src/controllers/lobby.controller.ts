import { Request, Response } from 'express'
import {
  createNewLobbyService,
  getAllLobbiesService,
  getLobbyInformationService,
} from '../db/queries'

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

const getSingleLobby = async (req: Request, res: Response) => {
  const { id } = req.params

  if (id) {
    const parsedId = parseInt(id)

    try {
      const lobby = await getLobbyInformationService(parsedId)

      if (lobby) {
        res.json({
          success: true,
          lobby,
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
  } else {
    res.json({
      success: false,
      message: 'No query params found',
    })
  }
}

export default {
  CreateNewLobby,
  getLobbies,
  getSingleLobby,
}
