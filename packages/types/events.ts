import { ChatMessage, JWTUser } from './default'
import type { Socket } from 'socket.io-client'
import type { DisconnectDescription } from 'socket.io-client/build/esm/socket'

export interface EmitEvents extends SocketReservedEvents {
  who: (user: JWTUser) => void
  begin: () => void
  created: ({ name, state }: { name: string; state: string }) => void
  roomInfo: ({ json }: { json: string }) => void
  roomNotFound: ({ room }: { room: string }) => void
  ping: ({ time }: { time: number }) => void
  tooManyConnections: ({ total }: { total: number }) => void

  // Broadcast events
  'player-disconnected': ({ id, name }: { id: string; name: string }) => void
  rooms: ({ rooms }: { rooms: string[] }) => void
  chat: (message: ChatMessage) => void
  srvUpdate: ({ state }: { state: string }) => void
  quit: ({ room }: { room: string }) => void
}

export interface ListenEvents extends SocketReservedEvents {
  join: ({ jwt }: { jwt: string }) => void
  quit: ({ room }: { room: string }) => void
  create: ({ name }: { name: string }) => void
  disconnect: () => void
  pong: ({ time }: { time: number }) => void
  chat: ({ room, message }: { room: string; message: string }) => void
  getRoom: ({ room }: { room: string }) => void
  getRooms: () => void
}

export interface SocketReservedEvents {
  connect: () => void
  connect_error: (err: Error) => void
  disconnect: (
    reason: Socket.DisconnectReason,
    description?: DisconnectDescription
  ) => void
}
