import WSProvider from "@/components/Providers/WebSocketProvider";
import { ReactNode } from "react";

export default function Layout({
  children,
}: {
  children: ReactNode | undefined;
}) {
  return <WSProvider>{children}</WSProvider>;
}
