import { Socket } from 'socket.io'
import type { UserServerSocket, PlayerId } from '@cards/types/default'

type SocketList = {
  lastUpdate: number
  rooms: Set<string>
  sockets: Map<Socket['id'], UserServerSocket>
}

class UserListCollection {
  private userList: Map<PlayerId, SocketList> = new Map()

  public all(): ReadonlyMap<PlayerId, SocketList> {
    return this.userList
  }

  public get(id: PlayerId): SocketList {
    if (!this.userList.has(id)) {
      this.userList.set(id, this.generateList())
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.userList.get(id)!
  }

  public add(id: PlayerId, socket: UserServerSocket) {
    const socketList = this.get(id)

    if (!socketList.sockets.has(socket.id)) {
      socketList.sockets.set(socket.id, socket)
      this.userList.set(id, socketList)
    }

    return this
  }

  public update(id: PlayerId) {
    const socketList = this.userList.get(id)

    if (socketList) {
      socketList.lastUpdate = Date.now()
      this.userList.set(id, socketList)
    }
  }

  public remove(id: PlayerId, socket: Socket['id'] | Socket) {
    const socketId = socket instanceof Socket ? socket.id : socket

    this.get(id).sockets.delete(socketId)

    return this
  }

  public clear(id: PlayerId) {
    this.userList.delete(id)

    return this
  }

  public size() {
    return this.userList.size
  }

  public playerSocketSize(id: PlayerId) {
    return this.get(id).sockets.size
  }

  private generateList(): SocketList {
    return {
      rooms: new Set(),
      lastUpdate: Date.now(),
      sockets: new Map()
    }
  }
}

const UserList = new UserListCollection()

export default UserList
