import { useEffect, useState } from "react";
import { ManagerOptions, Socket, io } from "socket.io-client";
import { Nullable } from "@cards/types/default";
import { EmitEvents, ListenEvents } from "@/../../packages/types/events";
import { DisconnectDescription } from "socket.io-client/build/esm/socket";

interface Props {
  server: string;
  jwt: Nullable<string>;
  opts?: Partial<ManagerOptions>;
}

export type UserSocket = Socket<EmitEvents, ListenEvents> &
  Partial<{
    connect(): void;
    connect_error(err: Error): void;
    disconnect(
      reason: Socket.DisconnectReason,
      description?: DisconnectDescription
    ): void;
  }>;

const useSocket = ({ server, jwt, opts }: Props) => {
  const [socket, setSocket] = useState<Nullable<UserSocket>>(null);

  useEffect(() => {
    if (socket) return;

    const socketInst = io(server, {
      auth: {
        jwt,
      },
      ...opts,
    }) as UserSocket;

    setSocket(socketInst);

    return () => {
      socketInst.disconnect();
    };
  }, [jwt, opts, server, socket]);

  return socket;
};

export default useSocket;
