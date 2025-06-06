import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router'
import {
  Box,
  Stack,
  Typography,
  Avatar,
  CircularProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material'
import MuiCard from '@mui/material/Card'
import { styled } from '@mui/material/styles'
import HomeIcon from '@mui/icons-material/Home'
import LogoutIcon from '@mui/icons-material/Logout'
import CssBaseline from '@mui/material/CssBaseline'
import AppTheme from '../mui/components/Apptheme'
import { UserAuth } from '../context/AuthContext'
import EditIcon from '@mui/icons-material/Edit'
import axios from 'axios'
import { supabase } from '../supabaseClient'
import { socket } from '../socket/socket'

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
  const [previewURL, setPreviewURL] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [signoutLoading, setSignoutLoading] = useState<boolean>(false)
  const [avatarLoading, setAvatarLoading] = useState<boolean>(false)
  const { session, signOut }: any = UserAuth()
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement | null>(null)

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
      socket.disconnect()
      await signOut()
      setSignoutLoading(false)
      navigate('/signin')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const objectURL = URL.createObjectURL(file)
    setPreviewURL(objectURL)
    setSelectedFile(file)
    setDialogOpen(true)
  }

  const handleConfirmUpload = async () => {
    if (!selectedFile) return

    setAvatarLoading(true)

    const fileExt = selectedFile.name.split('.').pop()
    const fileName = `${session.user.id}-${Date.now()}.${fileExt}`
    const filePath = `avatars/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, selectedFile, {
        cacheControl: '3600',
        upsert: true,
      })

    if (uploadError) {
      console.error('Upload failed:', uploadError)
      return
    }

    const { data: publicUrlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath)

    const publicUrl = publicUrlData?.publicUrl
    if (!publicUrl) {
      console.error('Failed to get public URL')
      return
    }

    try {
      const res = await axios.patch(
        `http://localhost:5000/api/users/${session.user.id}`,
        {
          url: publicUrl,
        }
      )

      if (res.data.success) {
        setUser((prev: any) => ({
          ...prev,
          photoURL: publicUrl,
        }))

        setAvatarLoading(false)
        window.location.reload()
      } else {
        console.log('Some error occurred')
      }
    } catch (err) {
      console.error('Failed to update photoURL in custom DB:', err)
    }
  }

  const handleCancelUpload = () => {
    setDialogOpen(false)
    setPreviewURL(null)
    setSelectedFile(null)

    // Making sure the preview comes in if you cancel it once
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
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

            {/* Avatar with Upload */}
            <Box
              sx={{
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                mt: 1,
              }}
            >
              <Avatar
                src={user?.avatar || ''}
                sx={{
                  width: 96,
                  height: 96,
                  fontSize: 32,
                  bgcolor: 'primary.main',
                  cursor: 'pointer',
                }}
                onClick={handleAvatarClick}
              >
                {user?.displayName?.charAt(0) || 'U'}
              </Avatar>
              <IconButton
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: 'calc(50% - 48px)',
                  bgcolor: 'background.paper',
                  boxShadow: 2,
                }}
                size="small"
                onClick={handleAvatarClick}
              >
                <EditIcon fontSize="small" />
              </IconButton>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept="image/*"
                onChange={handleFileChange}
              />
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

        {/* Image Preview Dialog */}
        <Dialog open={dialogOpen} onClose={handleCancelUpload}>
          <DialogTitle>Preview Image</DialogTitle>
          <DialogContent>
            {previewURL ? (
              <img
                src={previewURL}
                alt="Preview"
                style={{ width: '100%', borderRadius: 8 }}
              />
            ) : (
              <Typography>No image selected</Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelUpload}>Cancel</Button>
            <Button onClick={handleConfirmUpload}>
              {avatarLoading ? <CircularProgress size={20} /> : 'Upload'}
            </Button>
          </DialogActions>
        </Dialog>
      </ProfileContainer>
    </AppTheme>
  )
}
