import { PlayerState, SharedPlayerState } from '@cards/types/default'
import superjson from 'superjson'

export default class PlayerStateDTO<T extends PlayerState> {
  private state: T

  constructor(state: T) {
    this.state = state
  }

  transform() {
    return superjson.stringify(this.toDtoObject())
  }

  toDtoObject(): SharedPlayerState {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { socket, sortOrder, ...state } = this.state

    return state
  }

  toString() {
    return this.transform()
  }
}
