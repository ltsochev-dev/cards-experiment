import { ReactNode } from "react";
import WSProvider from "@/components/Providers/WebSocketProvider";

export default function Layout({
  children,
}: {
  children: ReactNode | undefined;
}) {
  return <WSProvider>{children}</WSProvider>;
}
