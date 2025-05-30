import {
  createNewUserService,
  getAllUsersService,
  getSingleUserService,
  updateUserAvatarService,
} from '../db/queries'
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

/**
 * /api/users/:id /GET Endpoint
 */
const getSingleUser = async (req: Request, res: Response) => {
  const { id } = req.params

  try {
    const user = await getSingleUserService(id)

    if (user) {
      res.json({
        success: true,
        user,
      })
    } else {
      res.json({
        success: false,
        message: 'User not found',
      })
    }
  } catch (error) {
    res.json({
      success: false,
      message: 'An error occurred',
    })
  }
}

/**
 * /api/users/:id /PATCH Endpoint
 */
const updateUserAvatar = async (req: Request, res: Response) => {
  const { id } = req.params
  const { url } = req.body

  try {
    const updatedUser = await updateUserAvatarService(id, url)

    if (updatedUser) {
      res.json({
        success: true,
        updatedUser,
      })
    } else {
      res.json({
        success: false,
        message: 'User not found',
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
  getSingleUser,
  updateUserAvatar,
}
