import { createServer } from 'http'
import { Server } from 'socket.io'
import { instrument } from '@socket.io/admin-ui'

const PORT = isNaN(Number(process.env.ADMIN_PORT))
  ? 3010
  : Number(process.env.ADMIN_PORT)

const httpServer = createServer()

const io = new Server(httpServer, {
  cors: {
    origin: ['https://admin.socket.io'],
    credentials: true
  }
})

instrument(io, {
  auth: false,
  mode: 'development'
})

httpServer.listen(PORT, () => {
  console.log(
    `WebSocket Server Admin UI running - http://admin.socket.io/ and connect to http://localhost:${PORT}`
  )
})
