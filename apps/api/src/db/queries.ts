import { logger } from '../config/logger'
import { prisma } from '../config/prisma.config'
import { Prisma } from '../generated/prisma'

export interface NewUserI {
  uid: string
  name: string
}

export interface UserI {
  id: number
  supabase_uid: string
  display_name: string
  created_at: Date
}

/**
 * Create a new user in the database
 *
 * uid - supabase uid created by supabase
 * name - the display name entered by the user
 */
export const createNewUserService = async ({
  uid,
  name,
}: NewUserI): Promise<boolean> => {
  try {
    const createdUser = await prisma.user.create({
      data: {
        supabase_uid: uid,
        display_name: name,
      },
    })

    if (createdUser) {
      return true
    }

    return false
  } catch (error) {
    logger.error(error)
    return false
  }
}

/**
 * Get all the users from the database
 */
export const getAllUsersService = async (): Promise<boolean | Array<UserI>> => {
  try {
    const users: Array<UserI> = await prisma.user.findMany()

    if (users) {
      return users
    }

    return false
  } catch (error) {
    logger.error(error)
    return false
  }
}
