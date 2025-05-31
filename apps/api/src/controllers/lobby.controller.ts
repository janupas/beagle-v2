import { Request, Response } from 'express'
import { createNewLobbyService } from '../db/queries'

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

export default {
  CreateNewLobby,
}
