import {
  Box,
  Button,
  Typography,
  Stack,
  Card as MuiCard,
  CssBaseline,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import AppTheme from '../mui/components/Apptheme'
import { useNavigate } from 'react-router'
import { useEffect, useState } from 'react'
import axios from 'axios'

const Card = styled(MuiCard)(({ theme }) => ({
  padding: theme.spacing(4),
  width: '100%',
  maxWidth: 480,
  margin: 'auto',
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
  alignItems: 'center',
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}))

const LobbyContainer = styled(Stack)(({ theme }) => ({
  minHeight: '100dvh',
  padding: theme.spacing(2),
  justifyContent: 'center',
  alignItems: 'center',
  background:
    'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
  ...theme.applyStyles('dark', {
    background:
      'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
  }),
}))

// Dummy list of lobbies (static for UI-only version)
const dummyLobbies = [
  { id: 'abc123', name: 'Team Alpha' },
  { id: 'xyz789', name: 'Casual Match' },
  { id: 'lmn456', name: 'Speed Game' },
  { id: 'aiw912', name: 'Just chatting' },
  { id: 'apo128', name: 'Speed Game' },
]

export default function App(props: { disableCustomTheme?: boolean }) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [lobbies, setLobbies] = useState<
    Array<{ id: number; name: string; created_at: string; adminId: string }>
  >([])
  const [lobbiesLoading, setLobbiesLoading] = useState<boolean>(true)

  const handleCreate = () => {
    setLoading(true)
    navigate('/create')
    setLoading(false)
  }

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/lobby')
      .then((res) => {
        if (res.data.data) {
          setLobbies(res.data.data)
          setLobbiesLoading(false)
        }
      })
      .catch((err) => console.log(err))
  }, [])

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <LobbyContainer>
        <Card>
          <Typography variant="h4" textAlign="center">
            Select a lobby
          </Typography>
          <Typography color="text.secondary" textAlign="center">
            Select or create a lobby to get started.
          </Typography>
          <Button
            variant="contained"
            size="large"
            fullWidth
            onClick={handleCreate}
          >
            {loading ? <CircularProgress size={20} /> : 'Create new lobby'}
          </Button>

          <Box sx={{ width: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Available Lobbies
            </Typography>
            <Box
              sx={{
                maxHeight: 300,
                overflowY: 'auto',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              {!lobbiesLoading ? (
                <>
                  {lobbies.length === 0 ? (
                    <>
                      <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                      >
                        <Box p={4}>
                          <Typography variant="caption">
                            No lobbies created. Create one.
                          </Typography>
                        </Box>
                      </Box>
                    </>
                  ) : (
                    <List disablePadding>
                      {lobbies.map((lobby, index) => (
                        <Box key={lobby.id}>
                          <ListItem
                            sx={{
                              cursor: 'pointer',
                              borderRadius: 0,
                              px: 2,
                              py: 1.5,
                              '&:hover': {
                                backgroundColor: 'action.hover',
                              },
                            }}
                          >
                            <ListItemText
                              primary={lobby.name}
                              secondary={`Lobby ID: ${lobby.id}`}
                            />
                          </ListItem>
                          {index < dummyLobbies.length && <Divider />}
                        </Box>
                      ))}
                    </List>
                  )}
                </>
              ) : (
                <Box display="flex" justifyContent="center" alignItems="center">
                  <Box p={4}>
                    <CircularProgress size={30} />
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        </Card>
      </LobbyContainer>
    </AppTheme>
  )
}
