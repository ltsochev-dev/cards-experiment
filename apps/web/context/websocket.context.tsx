"use client";

import {
  FC,
  createContext,
  ReactNode,
  useState,
  useEffect,
  useContext,
} from "react";
import { ManagerOptions, Socket, io } from "socket.io-client";
import { DisconnectDescription } from "socket.io-client/build/esm/socket";
import { Nullable } from "@cards/types/default";
import { EmitEvents, ListenEvents } from "@cards/types/events";

export type UserSocket = Socket<EmitEvents, ListenEvents> &
  Partial<{
    connect(): void;
    connect_error(err: Error): void;
    disconnect(
      reason: Socket.DisconnectReason,
      description?: DisconnectDescription
    ): void;
  }>;

type WebSocketContextType = {
  server: Nullable<string>;
  socket: Nullable<UserSocket>;
};

const WebSocketContext = createContext<WebSocketContextType>({
  server: null,
  socket: null,
});

interface Props {
  server: string;
  jwt?: string;
  opts?: Partial<ManagerOptions>;
  children?: ReactNode | undefined;
}

export const WebSocketProvider: FC<Props> = ({
  server,
  jwt,
  opts,
  children,
}) => {
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

  return (
    <WebSocketContext.Provider value={{ socket, server }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const { socket, server } = useContext(WebSocketContext);

  if (!socket || !server) {
    throw new Error(
      "You can only use useWebSocket as part of WebSocketContextProvider"
    );
  }

  return { socket, server };
};
