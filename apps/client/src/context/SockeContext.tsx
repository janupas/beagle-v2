// context/SocketContext.tsx
import { createContext, useContext, useEffect } from 'react'
import { socket } from '../socket/socket'
import { UserAuth } from './AuthContext'

const SocketContext = createContext({})

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { session }: any = UserAuth()

  useEffect(() => {
    if (session?.user?.id) {
      const fetchAndEmit = async () => {
        try {
          const res = await fetch(
            `http://localhost:5000/api/users/${session.user.id}`
          )
          const data = await res.json()
          socket.emit('user-connect', { user: data.user })
        } catch (error) {
          console.error('Failed to emit user-connect', error)
        }
      }

      fetchAndEmit()
    }
  }, [session?.user?.id])

  return <SocketContext.Provider value={{}}>{children}</SocketContext.Provider>
}

export const useSocket = () => useContext(SocketContext)
