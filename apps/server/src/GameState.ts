import { getTimestamp } from '@cards/utils'
import {
  PlayerId,
  GamePhase,
  GameState,
  UserServerSocket,
  PlayerState,
  Card
} from '@cards/types/default'

export const getDefaultWorldState = (
  name: string,
  owner: PlayerState
): GameState => ({
  name,
  owner: owner.id,
  private: false,
  phase: GamePhase.Waiting,
  currentPlayer: null,
  currentQuestionCard: null,
  players: new Map<PlayerId, PlayerState>([[owner.id, owner]]),
  messages: [],
  currentTurnReadiness: new Set<PlayerId>(),
  turnsPassed: 0,
  createdAt: getTimestamp(),
  lastUpdatedAt: getTimestamp()
})

export const createPlayerState = (
  socket: UserServerSocket,
  sortOrder?: number,
  cards: Card[] = []
): PlayerState => ({
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  id: socket.data!.user!.id,
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  name: socket.data!.user!.name,
  cards,
  sortOrder: sortOrder ?? 0,
  socket: socket
})

const GameStateMap = new Map<string, GameState>()

export default GameStateMap
