import { getAllUsersService } from '../db/queries'
import { Request, Response } from 'express'

const getAllUsers = async (req: Request, res: Response) => {
  const users = await getAllUsersService()

  if (users) {
    res.json(users)
  } else {
    res.json({
      success: false,
      error: 'An error occured',
    })
  }
}

export default {
  getAllUsers,
}
