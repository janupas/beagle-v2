import { io, Socket } from 'socket.io-client'

export const socket: Socket = io('http://localhost:5000/')

socket.on('connect', () => {
  console.log('Socket connected: ' + socket.id)
})
