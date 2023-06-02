export interface ClientEvents {
  join: ({ jwt }: { jwt: string }) => void
  quit: ({ room }: { room: string }) => void
  create: ({ name }: { name: string }) => void
  disconnect: () => void
  pong: ({ time }: { time: number }) => void
  chat: ({ room, message }: { room: string; message: string }) => void
  getRoom: ({ room }: { room: string }) => void
  getRooms: () => void
}
