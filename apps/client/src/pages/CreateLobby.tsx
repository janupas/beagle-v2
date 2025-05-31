import {
  Button,
  Typography,
  Stack,
  TextField,
  Card as MuiCard,
  CssBaseline,
  IconButton,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import HomeIcon from '@mui/icons-material/Home'
import AppTheme from '../mui/components/Apptheme'

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

const CreateLobbyContainer = styled(Stack)(({ theme }) => ({
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

export default function CreateLobbyPage(props: {
  disableCustomTheme?: boolean
}) {
  const [lobbyName, setLobbyName] = useState('')
  const [error, setError] = useState(false)
  const [nameError, setNameError] = useState('')
  const navigate = useNavigate()

  const handleCreate = () => {
    if (!lobbyName.trim()) {
      setError(true)
      setNameError('Lobby name is required')
      return
    } else {
      setError(false)
      setNameError('')
    }
    // Handle lobby creation logic here, e.g. API call or state update
    alert(`Creating lobby: ${lobbyName}`)
  }

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <CreateLobbyContainer>
        <Card>
          {/* Top Home Button */}
          <Stack
            direction="row"
            justifyContent="flex-start"
            sx={{ width: '100%' }}
          >
            <IconButton
              onClick={() => navigate('/')}
              aria-label="Go to homepage"
            >
              <HomeIcon />
            </IconButton>
          </Stack>

          <Typography variant="h4" textAlign="center">
            Create a New Lobby
          </Typography>
          <Typography color="text.secondary" textAlign="center">
            Enter a name for your new lobby.
          </Typography>

          <TextField
            onChange={(e) => setLobbyName(e.target.value)}
            autoComplete="name"
            name="name"
            required
            fullWidth
            id="name"
            placeholder="Jon Snow"
            error={error}
            helperText={nameError}
            color="error"
          />
          <Button
            variant="contained"
            size="large"
            fullWidth
            onClick={handleCreate}
          >
            Create New Lobby
          </Button>
        </Card>
      </CreateLobbyContainer>
    </AppTheme>
  )
}
