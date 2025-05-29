import express from 'express'
import config from './config/config'
import app from './server'

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`)
})

export default app
