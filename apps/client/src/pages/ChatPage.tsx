import { useEffect, useRef, useState } from 'react'
import {
  Box,
  Typography,
  Stack,
  TextField,
  IconButton,
  CssBaseline,
  Paper,
  CircularProgress,
} from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import { styled } from '@mui/material/styles'
import AppTheme from '../mui/components/Apptheme'
import { useNavigate, useParams } from 'react-router'
import HomeIcon from '@mui/icons-material/Home'
import axios from 'axios'
import { UserAuth } from '../context/AuthContext'
import { socket } from '../socket/socket'

const ChatContainer = styled(Stack)(({ theme }) => ({
  minHeight: '100dvh',
  padding: theme.spacing(2),
  justifyContent: 'center',
  alignItems: 'center',
  background:
    'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
  ...theme.applyStyles('dark', {
    background:
      'radial-gradient(at 50% 50%, hsla(220, 50%, 10%, 1), hsla(220, 30%, 5%, 1))',
  }),
}))

const ChatCard = styled(Paper)(({ theme }) => ({
  width: '100%',
  maxWidth: 600,
  height: '90vh',
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(3),
  borderRadius: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  backdropFilter: 'blur(10px)',
  boxShadow:
    '0px 10px 25px rgba(0, 0, 0, 0.08), 0px 5px 10px rgba(0, 0, 0, 0.05)',
  ...theme.applyStyles('dark', {
    backgroundColor: 'rgba(30, 30, 30, 0.9)',
    boxShadow: '0px 10px 25px rgba(0,0,0,0.4)',
  }),
}))

const ChatBox = styled(Box)(({ theme }) => ({
  flex: 1,
  overflowY: 'auto',
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
  borderRadius: theme.spacing(2),
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.04)'
      : 'rgba(0, 0, 0, 0.02)',
  border: `1px solid ${theme.palette.divider}`,
  '&::-webkit-scrollbar': {
    width: '6px',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor:
      theme.palette.mode === 'dark' ? '#555' : theme.palette.grey[400],
    borderRadius: '4px',
  },
}))

const InputContainer = styled('form')(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  marginTop: theme.spacing(2),
}))

export default function ChatPage(props: { disableCustomTheme?: boolean }) {
  const [messages, setMessages] = useState<
    Array<{
      created_at?: string
      id?: number
      roomId: number
      userId: string
      value: string
      sender_display_name: string
    }>
  >([])
  const [input, setInput] = useState('')
  const chatEndRef = useRef<HTMLDivElement | null>(null)
  const [lobbyData, setLobbyData] = useState<{
    id: number
    name: string
    created_at: string
    admin_id: string
  }>()
  const navigate = useNavigate()
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>()
  const { session }: any = UserAuth()

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    if (user && lobbyData) {
      const msgInfo: any = {
        room: lobbyData,
        user: user,
        data: {
          value: input,
          type: 'message',
        },
      }

      socket.emit('message', msgInfo)
      setInput('')
    } else {
      console.log('SOME ERROR OCCOURED')
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        const userRes = await axios.get(
          `http://localhost:5000/api/users/${session.user.id}`
        )
        const fetchedUser = userRes.data.user
        if (fetchedUser) {
          setUser(fetchedUser)
        }

        const lobbyRes = await axios.get(
          `http://localhost:5000/api/lobby/${id}`
        )
        const fetchedLobby = lobbyRes.data.lobby
        if (fetchedLobby) {
          setLobbyData(fetchedLobby)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [session.user.id, id])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (!id) return

    // Join the room and load initial messages
    socket.emit('initial-room-join', parseInt(id))

    // Handler for initial batch of messages (replace entire messages array)
    const handleMessages = (data: any[]) => {
      setMessages(data)
      console.log('Initial messages:', data)
    }

    // Handler for new incoming message (append to messages)
    const handleMessageBack = (data: any) => {
      console.log('New message:', data)
      setMessages((prevMessages) => [...prevMessages, data])
    }

    socket.on('messages', handleMessages)
    socket.on('message-back', handleMessageBack)

    // Cleanup on unmount or id change
    return () => {
      socket.off('messages', handleMessages)
      socket.off('message-back', handleMessageBack)
    }
  }, [id])

  const formateCreatedDate = (dateObject: number) => {
    const date = new Date(dateObject)

    const year = date.getFullYear().toString().slice(-2) // Get last two digits of the year
    const month = (date.getMonth() + 1).toString().padStart(2, '0') // Add 1 and pad with 0
    const day = date.getDate().toString().padStart(2, '0') // Pad with 0

    return `${year}-${month}-${day}`
  }

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center">
          <Box p={4}>
            <CircularProgress size={30} />
          </Box>
        </Box>
      ) : (
        <>
          {lobbyData ? (
            <>
              <ChatContainer>
                <ChatCard>
                  {/* Group Title */}
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={1}
                  >
                    <Typography variant="h5" fontWeight="bold">
                      {lobbyData?.name || 'Test chat page'}
                    </Typography>
                    <IconButton
                      onClick={() => navigate('/')}
                      aria-label="Go to homepage"
                      color="primary"
                    >
                      <HomeIcon />
                    </IconButton>
                  </Stack>

                  {/* Chat Box */}
                  <ChatBox>
                    {messages.map((msg, idx) => {
                      const isSender = msg.userId === session.user.id

                      return (
                        <Box
                          key={idx}
                          sx={{
                            alignSelf: isSender ? 'flex-end' : 'flex-start',
                            maxWidth: '75%',
                            bgcolor: isSender
                              ? 'primary.main'
                              : 'background.paper',
                            color: isSender
                              ? 'primary.contrastText'
                              : 'text.primary',
                            borderRadius: 3,
                            px: 2,
                            py: 1.25,
                            mb: 1.25,
                            boxShadow: isSender
                              ? '0 2px 8px rgba(25, 118, 210, 0.3)'
                              : '0 1px 4px rgba(0, 0, 0, 0.1)',
                            wordBreak: 'break-word',
                            fontSize: '0.95rem',
                            position: 'relative',
                            borderTopRightRadius: isSender ? 0 : 12,
                            borderTopLeftRadius: isSender ? 12 : 0,
                            border: isSender
                              ? 'none'
                              : '1px solid rgba(0, 0, 0, 0.12)',
                          }}
                        >
                          {/* Sender name for receiver messages */}
                          {!isSender && (
                            <Typography
                              variant="caption"
                              sx={{
                                fontWeight: 600,
                                mb: 0.5,
                                display: 'block',
                                color: 'text.secondary',
                                userSelect: 'none',
                              }}
                            >
                              {msg.sender_display_name || 'Unknown'}
                            </Typography>
                          )}

                          {/* Message text */}
                          <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                            {msg.value}
                          </Typography>

                          {/* Timestamp */}
                          {msg.created_at && (
                            <Typography
                              variant="caption"
                              sx={{
                                mt: 0.5,
                                fontSize: '0.7rem',
                                textAlign: 'right',
                                opacity: 0.6,
                                color: isSender
                                  ? 'primary.contrastText'
                                  : 'text.secondary',
                                userSelect: 'none',
                              }}
                            >
                              {formateCreatedDate(parseInt(msg.created_at))}
                            </Typography>
                          )}
                        </Box>
                      )
                    })}

                    <div ref={chatEndRef} />
                  </ChatBox>

                  {/* Input Section */}
                  <InputContainer onSubmit={handleSend}>
                    <TextField
                      fullWidth
                      placeholder="Type your message…"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      size="small"
                      sx={{ borderRadius: 2 }}
                    />
                    <IconButton
                      type="submit"
                      color="primary"
                      sx={{ flexShrink: 0 }}
                    >
                      <SendIcon />
                    </IconButton>
                  </InputContainer>
                </ChatCard>
              </ChatContainer>
            </>
          ) : (
            <>
              <Box display="flex" justifyContent="center" alignItems="center">
                <Box p={4}>
                  <Typography variant="body1">
                    Sorry lobby cannot be found...
                  </Typography>
                </Box>
              </Box>
            </>
          )}
        </>
      )}
    </AppTheme>
  )
}
