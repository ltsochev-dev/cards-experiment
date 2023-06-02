import { GameState, PlayerId, SharedGameState } from '@cards/types/default'
import superjson from 'superjson'

export default class GameStateDTO {
  private state: GameState
  private playerId?: PlayerId

  constructor(state: GameState, forPlayer?: PlayerId) {
    this.state = state
    this.playerId = forPlayer
  }

  transform() {
    const state = { ...this.state, players: new Map() } as SharedGameState

    this.state.players.forEach(({ name, cards, sortOrder }, id) => {
      state.players.set(id, {
        name,
        sortOrder,
        cards: this.playerId === id ? cards : []
      })
    })

    return superjson.stringify(state)
  }

  toString() {
    return this.transform()
  }
}
