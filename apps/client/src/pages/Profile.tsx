import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import {
  Box,
  Stack,
  Typography,
  Avatar,
  CircularProgress,
  IconButton,
  Divider,
} from '@mui/material'
import MuiCard from '@mui/material/Card'
import { styled } from '@mui/material/styles'
import HomeIcon from '@mui/icons-material/Home'
import LogoutIcon from '@mui/icons-material/Logout'
import CssBaseline from '@mui/material/CssBaseline'
import AppTheme from '../mui/components/Apptheme'
import { UserAuth } from '../context/AuthContext'
import axios from 'axios'

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  maxWidth: 450,
  padding: theme.spacing(4),
  gap: theme.spacing(3),
  margin: 'auto',
  boxShadow: '0px 10px 20px rgba(0,0,0,0.05), 0px 6px 6px rgba(0,0,0,0.05)',
  borderRadius: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(5),
  },
  ...theme.applyStyles('dark', {
    boxShadow: '0px 10px 25px rgba(0,0,0,0.4)',
  }),
}))

const ProfileContainer = styled(Stack)(({ theme }) => ({
  height: '100dvh',
  padding: theme.spacing(2),
  justifyContent: 'center',
  alignItems: 'center',
  background:
    'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
  ...theme.applyStyles('dark', {
    background:
      'radial-gradient(ellipse at 50% 50%, hsl(220, 40%, 8%), hsl(220, 30%, 5%))',
  }),
}))

export default function ProfilePage(props: { disableCustomTheme?: boolean }) {
  const [user, setUser] = useState<any>()
  const [loading, setLoading] = useState<boolean>(false)
  const [signoutLoading, setSignoutLoading] = useState<boolean>(false)
  const { session, signOut }: any = UserAuth()
  const navigate = useNavigate()

  useEffect(() => {
    setLoading(true)
    axios
      .get(`http://localhost:5000/api/users/${session.user.id}`)
      .then((res) => {
        setUser(res.data.user)
        setLoading(false)
      })
      .catch((err) => {
        console.log(err)
        setLoading(false)
      })
  }, [session.user.id])

  const handleSignOut = async () => {
    setSignoutLoading(true)

    try {
      await signOut()
      setSignoutLoading(false)
      navigate('/signin')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <ProfileContainer>
        {loading ? (
          <CircularProgress />
        ) : (
          <Card variant="outlined">
            {/* Top Action Buttons */}
            <Stack direction="row" justifyContent="space-between">
              <IconButton
                color="primary"
                onClick={() => navigate('/')}
                aria-label="Go to homepage"
              >
                <HomeIcon />
              </IconButton>
              <IconButton
                color="error"
                onClick={handleSignOut}
                aria-label="Sign out"
              >
                {signoutLoading ? (
                  <CircularProgress size={20} />
                ) : (
                  <LogoutIcon />
                )}
              </IconButton>
            </Stack>

            {/* Avatar */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
              <Avatar
                src={user?.photoURL || ''}
                sx={{
                  width: 96,
                  height: 96,
                  fontSize: 32,
                  bgcolor: 'primary.main',
                }}
              >
                {user?.displayName?.charAt(0) || 'G'}
              </Avatar>
            </Box>

            {/* User Info */}
            <Stack spacing={1} alignItems="center" textAlign="center">
              <Typography variant="h5" fontWeight="bold">
                {user?.display_name || 'Unknown User'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {session.user?.email || 'No email available'}
              </Typography>
            </Stack>
          </Card>
        )}
      </ProfileContainer>
    </AppTheme>
  )
}
