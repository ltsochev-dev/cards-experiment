import type { JWTUser, ChatMessage } from '@cards/types/default'
import type { GameState } from '../GameState'

export interface ServerEvents {
  // Socket events
  who: (user: JWTUser) => void
  begin: () => void
  created: ({ name, state }: { name: string; state: GameState }) => void
  roomInfo: ({ json }: { json: string }) => void
  roomNotFound: ({ room }: { room: string }) => void
  ping: ({ time }: { time: number }) => void
  tooManyConnections: ({ total }: { total: number }) => void

  // Broadcast events
  'player-disconnected': ({ id, name }: { id: string; name: string }) => void
  rooms: ({ rooms }: { rooms: string[] }) => void
  chat: (message: ChatMessage) => void
  srvUpdate: ({ state }: { state: GameState }) => void
  quit: ({ room }: { room: string }) => void
}
