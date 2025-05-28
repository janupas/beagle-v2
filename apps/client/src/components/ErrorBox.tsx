import CloseIcon from '@mui/icons-material/Close'
import { Alert, Collapse, IconButton } from '@mui/material'

interface ErrorBoxProps {
  open: boolean
  message: string
  onClose: () => void
}

export default function ErrorBox({ open, message, onClose }: ErrorBoxProps) {
  return (
    <Collapse in={open}>
      <Alert
        severity="error"
        variant="outlined"
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={onClose}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        }
        sx={{ mb: 2 }}
      >
        {message}
      </Alert>
    </Collapse>
  )
}
