import { useEffect, useRef, useState } from 'react'
import {
  Box,
  Typography,
  Stack,
  TextField,
  IconButton,
  CssBaseline,
  Paper,
} from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import { styled } from '@mui/material/styles'
import AppTheme from '../mui/components/Apptheme'
import { useLocation, useNavigate } from 'react-router'
import HomeIcon from '@mui/icons-material/Home'

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

const ChatBubble = styled(Box)(({ theme }) => ({
  alignSelf: 'flex-end',
  maxWidth: '80%',
  padding: theme.spacing(1.2, 2),
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  borderRadius: theme.spacing(2),
  boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
  wordBreak: 'break-word',
  fontSize: '0.95rem',
  transition: 'all 0.2s ease',
}))

const InputContainer = styled('form')(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  marginTop: theme.spacing(2),
}))

export default function ChatPage(props: { disableCustomTheme?: boolean }) {
  const [messages, setMessages] = useState<string[]>([
    'hello',
    'hi',
    'welcome to chat',
  ])
  const [input, setInput] = useState('')
  const chatEndRef = useRef<HTMLDivElement | null>(null)
  const [lobbyName, setLobbyName] = useState<string | null>(
    'Example lobby name'
  )
  const navigate = useNavigate()
  const location = useLocation()

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    setMessages((prev) => [...prev, input])
    setInput('')
  }

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (!location.state?.fromValidPage) {
      navigate('/')
    }
  }, [location, navigate])

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
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
              {lobbyName}
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
            {messages.map((msg, idx) => (
              <ChatBubble key={idx}>{msg}</ChatBubble>
            ))}
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
            <IconButton type="submit" color="primary" sx={{ flexShrink: 0 }}>
              <SendIcon />
            </IconButton>
          </InputContainer>
        </ChatCard>
      </ChatContainer>
    </AppTheme>
  )
}
