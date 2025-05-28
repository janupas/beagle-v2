import { CircularProgress, Box, Typography } from '@mui/material'

const Loading = () => {
  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        color: 'text.primary',
      }}
    >
      <CircularProgress />
      <Typography variant="h6" mt={2}>
        Loading...
      </Typography>
    </Box>
  )
}

export default Loading
