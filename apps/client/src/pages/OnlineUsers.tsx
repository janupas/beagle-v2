import {
  Box,
  Typography,
  Stack,
  Card as MuiCard,
  CssBaseline,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import AppTheme from '../mui/components/Apptheme'
import { useEffect, useState } from 'react'
import { socket } from '../socket/socket'

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

export default function OnlineUsers(props: { disableCustomTheme?: boolean }) {
  const [users] = useState([
    { id: '1', username: 'Alice' },
    { id: '2', username: 'Bob' },
  ])

  useEffect(() => {
    socket.on('users', (data) => {
      console.log(data)
    })

    // Clean up the listener when the component unmounts
    return () => {
      socket.off('users')
    }
  }, [socket])

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <LobbyContainer>
        <Card>
          <Typography variant="h4" textAlign="center">
            Online users
          </Typography>
          <Box sx={{ width: '100%' }}>
            <Box
              sx={{
                maxHeight: 300,
                overflowY: 'auto',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <List disablePadding>
                {users.map((user, index) => (
                  <Box key={user.id}>
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
                        primary={
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                            }}
                          >
                            <Box
                              sx={{
                                width: 10,
                                height: 10,
                                borderRadius: '50%',
                                backgroundColor: 'limegreen',
                                boxShadow: '0 0 0 2px white',
                              }}
                            />
                            <Typography variant="body1">
                              {user.username}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < users.length && <Divider />}
                  </Box>
                ))}
              </List>
            </Box>
          </Box>
        </Card>
      </LobbyContainer>
    </AppTheme>
  )
}
