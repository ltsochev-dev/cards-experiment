"use client";

import { WebSocketProvider } from "@/context/websocket.context";
import { ReactNode } from "react";

export default function WSProvider({ children }: { children: ReactNode }) {
  const jwt =
    typeof window !== "undefined"
      ? localStorage.getItem("cggame-sess")
      : undefined;

  return (
    <WebSocketProvider server="http://localhost:8080" jwt={jwt ?? undefined}>
      {children}
    </WebSocketProvider>
  );
}
