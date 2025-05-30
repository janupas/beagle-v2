import { createNewUserService, getAllUsersService } from '../db/queries'
import { Request, Response } from 'express'

/**
 * /api/users GET endpoint
 */
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

/**
 * /api/users POST endpoint
 */
const createNewUser = async (req: Request, res: Response) => {
  const { supabase_uid, display_name } = req.body

  try {
    const newUser = await createNewUserService({
      uid: supabase_uid,
      name: display_name,
    })

    if (newUser) {
      res.json({
        success: true,
        message: 'New User Created',
        user: newUser,
      })
    } else {
      res.json({
        success: false,
        message: 'An error occurred',
      })
    }
  } catch (error) {
    res.json({
      success: false,
      message: 'An error occurred',
    })
  }
}

export default {
  getAllUsers,
  createNewUser,
}
