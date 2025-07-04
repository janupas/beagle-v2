import { logger } from '../config/logger'
import { prisma } from '../config/prisma.config'

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
        avatar: '',
      },
    })

    if (createdUser) {
      logger.info('A new user created: ' + JSON.stringify(createdUser))
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
      logger.info('Users array returned successfully')
      return users
    }

    return false
  } catch (error) {
    logger.error(error)
    return false
  }
}

/**
 * Get a single user that matches the id
 */
export const getSingleUserService = async (
  supabase_uid: string
): Promise<boolean | UserI> => {
  try {
    const user: UserI | null = await prisma.user.findFirst({
      where: {
        supabase_uid: supabase_uid,
      },
    })

    if (user) {
      logger.info('User returned: ' + JSON.stringify(user))
      return user
    }

    return false
  } catch (error) {
    logger.error(error)
    return false
  }
}

/**
 * Patch a request to update user avatar field
 */
export const updateUserAvatarService = async (id: string, url: string) => {
  try {
    const updatedUser = await prisma.user.update({
      where: {
        supabase_uid: id,
      },
      data: {
        avatar: url,
      },
    })

    if (updatedUser) {
      logger.info('User updated: ' + JSON.stringify(updatedUser))
      return updatedUser
    }

    return false
  } catch (err) {
    logger.error(err)
    return false
  }
}

/**
 * Create a new lobby in the database
 */
export const createNewLobbyService = async ({
  name,
  adminId,
}: {
  name: string
  adminId: string
}) => {
  try {
    const createdLobby = await prisma.lobby.create({
      data: {
        name: name,
        admin: {
          connect: {
            supabase_uid: adminId,
          },
        },
      },
    })

    if (createdLobby) {
      logger.info('lobby created: ' + JSON.stringify(createdLobby))
      return createdLobby
    }

    return false
  } catch (err) {
    logger.error(err)
    return false
  }
}

/**
 * Gets all the lobbies from the database
 */
export const getAllLobbiesService = async () => {
  try {
    const lobbies = await prisma.lobby.findMany()

    if (lobbies) {
      return lobbies
    }

    return false
  } catch (err) {
    logger.error(err)
    return false
  }
}

/**
 * Get a single lobby using the id
 */
export const getLobbyInformationService = async (id: number) => {
  try {
    const lobby = await prisma.lobby.findFirst({
      where: {
        id: id,
      },
    })

    if (lobby) {
      logger.info('Lobby info: ' + JSON.stringify(lobby))
      return lobby
    }

    return false
  } catch (err) {
    logger.error(err)
    return false
  }
}

export const insertNewMessageService = async ({
  userId,
  roomId,
  value,
  display_name,
  created_at,
  type,
}: {
  userId: string
  roomId: number
  value: string
  display_name: string
  created_at: string
  type: string
}) => {
  try {
    const insertedMessage = await prisma.message.create({
      data: {
        value: value,
        userId: userId,
        roomId: roomId,
        sender_display_name: display_name,
        created_at: created_at,
        type: type,
      },
    })

    if (insertedMessage) {
      logger.info('Inserted message: ' + JSON.stringify(insertedMessage))
      return
    }

    return false
  } catch (err) {
    logger.error(err)
    return false
  }
}

export const getLobbyMessagesService = async (id: number) => {
  try {
    const returnedMessages = await prisma.message.findMany({
      where: {
        roomId: id,
      },
    })

    if (returnedMessages) {
      logger.info('Messages returned, ' + JSON.stringify(returnedMessages))
      return returnedMessages
    }

    return false
  } catch (err) {
    logger.error(err)
    return false
  }
}
