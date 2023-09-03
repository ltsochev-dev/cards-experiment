"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import type { ChatMessage } from "@cards/types/default";
import type { UserSocket } from "@/context/websocket.context";
import TextInput from "./TextInput";

interface Props {
  room: string;
  messages: ChatMessage[];
  socket: UserSocket;
}

const Chatbox = ({ room, messages, socket }: Props) => {
  const chatMessagesRef = useRef<ChatMessage[]>([]);
  const [_, setRenderFlag] = useState(false);

  useEffect(() => {
    socket.on("chat", onMessageRecv);

    chatMessagesRef.current = messages.slice();

    forceRender();

    return () => {
      socket.off("chat", onMessageRecv);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, messages]);

  const onMessageRecv = (message: ChatMessage) => {
    console.log("event caught", { message, chatMessagesRef });

    chatMessagesRef.current.push({
      ...message,
      createdAt: new Date(message.createdAt),
    });

    forceRender();
  };

  const forceRender = () => {
    setRenderFlag((prev) => !prev);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const message = formData.get("message") as string;

    if (message.length >= 2) {
      socket.emit("chat", { room, message });
      e.currentTarget.reset();
    }
  };

  return (
    <div className="chatbox flex h-full flex-col">
      <div className="flex flex-grow">
        <ul className="flex flex-col">
          {chatMessagesRef.current.map(({ id, message, createdAt }) => (
            <li key={id}>
              [{createdAt.getHours()}:{createdAt.getUTCMinutes()}:
              {createdAt.getUTCSeconds()}] {message}
            </li>
          ))}
        </ul>
      </div>
      <div className="relative">
        <form onSubmit={handleSubmit}>
          <div className="mt-4">
            <TextInput
              name="message"
              autoComplete="off"
              placeholder="Send a message"
              tabIndex={1}
              InputAdornment={
                <button
                  type="submit"
                  name="submit"
                  title="Send message"
                  className="flex items-center justify-center rounded-full bg-blue-500 p-2 text-white hover:bg-blue-600 focus:bg-blue-600 focus:outline-none"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-6 w-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                    />
                  </svg>
                </button>
              }
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chatbox;
