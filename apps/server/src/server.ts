import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'
import { clearTimeout } from 'timers'
import { randomUUID } from 'crypto'
import { getPayload } from '@cards/jwt'
import {
  JWTUser,
  ChatMessage,
  GameState,
  GamePhase
} from '@cards/types/default'
import { getTimestamp } from '@cards/utils'
import GameStateMap, {
  getDefaultWorldState,
  createPlayerState
} from './GameState'
import UserList from './UserList'
import RoomCardDeck, { createCardManager } from './CardManager'
import { ServerEvents, ClientEvents } from './Events'
import SocketData from './SocketData'
import GameStateDTO from './DTO/GameStateDTO'
import PlayerStateDTO from './DTO/PlayerStateDTO'

let tickTimerId: NodeJS.Timer
let lastFrameTime = 0
const tickRate = 1000 / 1 // 1fps | 1000 / 60 = 60fps
const maxIdleTime = 30_000 // 5 minutes in miliseconds
const connectionLimit = 5

const app = express()
const server = createServer(app)
const io = new Server<ClientEvents, ServerEvents, DefaultEventsMap, SocketData>(
  server,
  {
    cors: {
      origin: `http://localhost:3000`,
      methods: ['GET', 'POST']
    }
  }
)

app.get('/', (_, res) => {
  res.status(401).send('Forbidden')
})

io.on('connection', socket => {
  console.log('new connection inbound', socket.id)

  const { jwt } = socket.handshake.auth
  if (!jwt) {
    console.error('Invalid JWT token on connection from socket: ', socket.id)
    socket.disconnect()
    return
  }

  try {
    const payload = getPayload<JWTUser>(jwt)

    const totalConnections = UserList.playerSocketSize(payload.sub)
    if (totalConnections >= connectionLimit) {
      socket.emit('tooManyConnections', { total: totalConnections })
      socket.disconnect()
      return
    }

    socket.data.ping = 0
    socket.data.user = {
      id: payload.sub,
      name: payload.name,
      avatar: payload.avatar
    }

    UserList.add(payload.sub, socket)

    const existingRooms = UserList.get(payload.sub).rooms
    if (existingRooms.size > 0) {
      socket.join(Array.from(existingRooms))
    }

    socket.emit('who', payload)
  } catch (e) {
    console.error(e)
    socket.disconnect()
  }

  socket.onAny(() => {
    if (socket.data.user?.id) {
      UserList.update(socket.data.user.id)
    }
  })

  socket.on('create', ({ name }: { name: string }) => {
    console.log('======= CREATE CALLED =============')
    if (name && name.length >= 3 && !GameStateMap.has(name.trim())) {
      GameStateMap.set(
        name.trim(),
        getDefaultWorldState(name.trim(), createPlayerState(socket))
      )

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      UserList.get(socket.data.user!.id).rooms.add(name)

      RoomCardDeck.set(name.trim(), createCardManager())

      socket.emit('created', {
        name,
        state: new GameStateDTO(
          GameStateMap.get(name.trim()) as GameState
        ).transform()
      })
    }
  })

  socket.on('chat', ({ room, message }) => {
    if (!GameStateMap.has(room)) {
      return
    }

    const state = GameStateMap.get(room) as GameState

    if (state.players.has(socket.data.user?.id ?? '')) {
      // The room exists, the player is part of the room, broadcast away
      const chatMessage: ChatMessage = {
        id: randomUUID(),
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        author: socket.data.user!.id,
        message: message.substring(0, Math.min(256, message.length)),
        createdAt: new Date()
      }

      state.messages.push(chatMessage)

      io.to(room).emit('chat', chatMessage)

      // Make sure we only have like 5 messages in history
      if (state.messages.length > 5) {
        state.messages = state.messages.slice(-5)
      }
    } else {
      console.log('player doesnt belong to', room)
    }
  })

  socket.on('getRoom', ({ room }) => {
    const roomState = GameStateMap.get(room)
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    if (!roomState || !roomState.players.has(socket.data.user!.id)) {
      socket.emit('roomNotFound', { room })
      return
    }

    socket.emit('roomInfo', {
      json: new GameStateDTO(roomState, socket.data.user?.id).toString()
    })
  })

  socket.on('getRooms', () => {
    const rooms = [] as string[]

    GameStateMap.forEach((state, name) => {
      if (state.private === false) {
        return rooms.push(name)
      }

      if (state.players.has(socket.data.user?.id ?? '')) {
        return rooms.push(name)
      }
    })

    rooms.sort()

    socket.emit('rooms', { rooms })
  })

  socket.on('join', async room => {
    const roomState = GameStateMap.get(room)
    if (!roomState) return

    if (roomState.players.has(socket.data.user!.id)) {
      const playerState = roomState.players.get(socket.data.user!.id)!
      const player = new PlayerStateDTO(playerState).toDtoObject()

      io.to(room).emit('joined', { room, player })
      return
    }

    // Deal cards to the current player
    const playerState = createPlayerState(socket, roomState.players.size)

    playerState.cards =
      (await RoomCardDeck.get(room)?.drawPlayerCards(10)) ?? []

    // roomState.players.set(socket.data.user?.id, playerState)

    // @todo Add the player state object
    // io.to(room).emit('joined', { room })
  })

  socket.on('pong', ({ time }) => {
    socket.data.ping = performance.now() - time
  })

  socket.on('disconnect', () => {
    console.log('Client disconnected.', socket.id)
    const playerId = socket.data.user?.id

    if (playerId) {
      UserList.remove(playerId, socket)
    }
  })

  socket.emit('begin')
})

const PORT = isNaN(Number(process.env.APP_PORT))
  ? 8080
  : Number(process.env.APP_PORT)

server.listen(PORT, 100, () => {
  console.log(`> Listening for websockets at port: ${PORT}`)

  beginTick()
})

// @todo This tickrate solution has got to go.
const beginTick = () => {
  lastFrameTime = performance.now()

  tick()
}

const _pauseServer = () => {
  clearTimeout(tickTimerId)
}

let pingCheck = false
const pingEnabled = false

const tick = () => {
  const currentFrameTime = performance.now()
  const elapsed = currentFrameTime - lastFrameTime

  for (const [room, state] of GameStateMap) {
    const [worldRemoved, reason] = gcWorld(room, state)

    if (worldRemoved) {
      console.log(`Shutting down world ${room} due to: ${reason}`)
      continue
    }

    // Game hasn't started yet, no need to apply game logic
    if (state.phase === GamePhase.Waiting) {
      io.to(room).emit('srvUpdate', {
        state: new GameStateDTO(state).transform()
      })
      continue
    }

    // Update world with game logic
    // updateWorld(room, state)

    // Broadcast the update to all clients
    io.to(room).emit('srvUpdate', {
      state: new GameStateDTO(state).transform()
    })
  }

  for (const [playerId, socketList] of UserList.all()) {
    if (
      socketList.sockets.size === 0 &&
      Date.now() - socketList.lastUpdate > maxIdleTime
    ) {
      console.log(
        `+++++++++ Player ${playerId} has no active sockets. Clearing... +++++++++ `
      )

      UserList.clear(playerId)
    }
  }

  // Everything is updated - off to the next tick

  const delay = Math.max(0, tickRate - elapsed)
  lastFrameTime = currentFrameTime

  tickTimerId = setTimeout(tick, delay)

  if (!pingCheck && pingEnabled) {
    io.fetchSockets()
      .then(sockets =>
        sockets.forEach(socket =>
          socket.emit('ping', { time: performance.now() })
        )
      )
      .finally(() => (pingCheck = false))
  }
}

const gcWorld = (room: string, state: GameState) => {
  // Close the world if the players in the room are 0
  if (state.players.size === 0) {
    closeWorld(room, state)
    return [true, 'emptyPlayers']
  }

  // Kill the world if there are no active sockets in it or it hasn't received updates in 10 minutes
  if (state.lastUpdatedAt < getTimestamp() - 60 * 10) {
    closeWorld(room, state)
    return [true, 'lastUpdate']
  }

  // Close the world if the state is GamePhase.Ended
  if (state.phase === GamePhase.Ended) {
    closeWorld(room, state)
    return [true, 'gameOver']
  }

  return [false, 'OK']
}

const closeWorld = (room: string, state: GameState) => {
  // Disconnect all users from the room
  state.players.forEach((player, id) => {
    // Remove disconnected sockets
    if (!player.socket.connected) {
      state.players.delete(id)
      io.to(room).emit('player-disconnected', { id, name: player.name })
      return
    }

    // Remove all players from the room
    UserList.get(id).rooms.delete(room)
  })

  // Notify everyone in the room that they should remove the room from UI
  io.to(room).emit('quit', { room })

  // Clean up the list
  GameStateMap.delete(room)
}

const gracefulShutdown = () => {
  console.log('Received a kill signal. Performing cleanup...')

  // @todo Implement gamestate save to Redis for example or to the filesystem
  // we could use superjson for Map serialization
  // @todo After serialization implement a unserialize from whatever we used to serialize
  console.log('Saving GameStateMap')

  try {
    server.close()
    io.close()
    process.exit(0)
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}

process.on('SIGINT', gracefulShutdown)
process.on('SIGTERM', gracefulShutdown)
