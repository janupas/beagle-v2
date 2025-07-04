import { useState } from 'react'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import MuiCard from '@mui/material/Card'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Checkbox from '@mui/material/Checkbox'
import { styled } from '@mui/material/styles'
import LinkComponent from '@mui/material/Link'
import TextField from '@mui/material/TextField'
import FormLabel from '@mui/material/FormLabel'
import { CircularProgress } from '@mui/material'
import { Link, useNavigate } from 'react-router'
import Typography from '@mui/material/Typography'
import ErrorBox from '../components/ErrorBox.tsx'
import FormControl from '@mui/material/FormControl'
import CssBaseline from '@mui/material/CssBaseline'
import AppTheme from '../mui/components/Apptheme.tsx'
import { UserAuth } from '../context/AuthContext.tsx'
import FormControlLabel from '@mui/material/FormControlLabel'
import ForgotPassword from '../mui/components/ForgotPassword.tsx'
import { GoogleIcon, FacebookIcon } from '../mui/components/CustomIcons.tsx'
import ColorModeSelect from '../mui/components/customization/colorModeSelect.tsx'
import { socket } from '../socket/socket.ts'

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  [theme.breakpoints.up('sm')]: {
    maxWidth: '450px',
  },
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}))

const SignInContainer = styled(Stack)(({ theme }) => ({
  height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  minHeight: '100%',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage:
      'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    ...theme.applyStyles('dark', {
      backgroundImage:
        'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
  },
}))

export default function SignIn(props: { disableCustomTheme?: boolean }) {
  const [emailError, setEmailError] = useState<boolean | undefined>(false)
  const [emailErrorMessage, setEmailErrorMessage] = useState<string>('')
  const [passwordError, setPasswordError] = useState<boolean>(false)
  const [passwordErrorMessage, setPasswordErrorMessage] = useState<string>('')
  const [open, setOpen] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [showError, setShowError] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  const { signinUser }: any = UserAuth()
  const navigate = useNavigate()

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)

    if (emailError || passwordError) {
      return
    }

    const data = new FormData(event.currentTarget)

    try {
      const res = await signinUser({
        email: data.get('email'),
        password: data.get('password'),
      })

      if (res.success) {
        // log for success
        setLoading(false)
        navigate('/profile')
        socket.connect()
        // window.location.reload()
        console.log({
          success: true,
          message: 'Signin successfull',
        })
      } else {
        setLoading(false)
        setError('Authentication failed')
        setShowError(true)
      }
    } catch (e) {
      console.error(e)
    }
  }

  const validateInputs = () => {
    const email = document.getElementById('email') as HTMLInputElement
    const password = document.getElementById('password') as HTMLInputElement

    let isValid = true

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true)
      setEmailErrorMessage('Please enter a valid email address.')
      isValid = false
    } else {
      setEmailError(false)
      setEmailErrorMessage('')
    }

    if (!password.value || password.value.length < 6) {
      setPasswordError(true)
      setPasswordErrorMessage('Password must be at least 6 characters long.')
      isValid = false
    } else {
      setPasswordError(false)
      setPasswordErrorMessage('')
    }

    return isValid
  }

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <SignInContainer direction="column" justifyContent="space-between">
        <ColorModeSelect
          sx={{ position: 'fixed', top: '1rem', right: '1rem' }}
        />
        <Card variant="outlined">
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
          >
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              gap: 2,
            }}
          >
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                error={emailError}
                helperText={emailErrorMessage}
                id="email"
                type="email"
                name="email"
                placeholder="your@email.com"
                autoComplete="email"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={emailError ? 'error' : 'primary'}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">Password</FormLabel>
              <TextField
                error={passwordError}
                helperText={passwordErrorMessage}
                name="password"
                placeholder="••••••"
                type="password"
                id="password"
                autoComplete="current-password"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={passwordError ? 'error' : 'primary'}
              />
            </FormControl>
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <ErrorBox
              open={showError}
              message={error}
              onClose={() => setShowError(false)}
            />
            <ForgotPassword open={open} handleClose={handleClose} />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              onClick={validateInputs}
            >
              {loading ? (
                <CircularProgress size={20} color="secondary" />
              ) : (
                'Sign in'
              )}
            </Button>
            <LinkComponent
              component="button"
              type="button"
              onClick={handleClickOpen}
              variant="body2"
              sx={{ alignSelf: 'center' }}
            >
              Forgot your password?
            </LinkComponent>
          </Box>
          <Divider>or</Divider>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => alert('Sign in with Google')}
              startIcon={<GoogleIcon />}
            >
              Sign in with Google
            </Button>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => alert('Sign in with Facebook')}
              startIcon={<FacebookIcon />}
            >
              Sign in with Facebook
            </Button>
            <Typography sx={{ textAlign: 'center' }}>
              Don&apos;t have an account?{' '}
              <Link to="/signup">
                <LinkComponent variant="body2" sx={{ alignSelf: 'center' }}>
                  Sign up
                </LinkComponent>
              </Link>
            </Typography>
          </Box>
        </Card>
      </SignInContainer>
    </AppTheme>
  )
}
