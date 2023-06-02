import { Socket } from 'socket.io'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'
import { EmitEvents, ListenEvents } from './events'

export type Nullable<T> = T | null

export interface JWTUser {
  sub: string
  name: string
  avatar: string
  locale: string
  iat: number
  exp: number
}

export interface Card {
  id: string
  number: number
  value: string
  type: CardType
}

export interface QuestionCard extends Card {
  type: CardType.QuestionCard
  words: number
}

export enum CardType {
  PlayerCard,
  QuestionCard
}

export interface ChatMessage {
  id: string
  author: string
  message: string
  createdAt: Date
}

export type PlayerId = string

export enum GamePhase {
  Waiting,
  Started,
  Choosing,
  Voting,
  Ended
}

export interface SocketData {
  user: {
    id: string
    name: string
    avatar: string
  }
  ping: number
}

export type UserServerSocket = Socket<
  ListenEvents,
  EmitEvents,
  DefaultEventsMap,
  SocketData
>

export type PlayerState = {
  id: PlayerId
  name: string
  sortOrder: number
  cards: Card[]
  socket: UserServerSocket
}

export type GameState = {
  name: string
  owner: PlayerId
  private: boolean
  phase: GamePhase
  currentPlayer: Nullable<PlayerId>
  currentQuestionCard: Nullable<QuestionCard>
  players: Map<PlayerId, PlayerState>
  messages: ChatMessage[]
  currentTurnReadiness: Set<PlayerId>
  turnsPassed: number
  createdAt: number
  lastUpdatedAt: number
}

export type SharedGameState = Omit<GameState, 'players'> & {
  players: Map<
    PlayerId,
    {
      name: string
      sortOrder: number
      cards: PlayerState['cards']
    }
  >
}
