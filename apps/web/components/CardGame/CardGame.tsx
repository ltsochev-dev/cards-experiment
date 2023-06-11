"use client";

import React, { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SuperJSON from "superjson";
import LoadingSpinner from "ui/LoadingSpinner";
import { slug } from "@cards/utils";
import { JWTUser, Nullable, SharedGameState } from "@cards/types/default";
import Section from "@/components/Section";
import Chatbox, { ChatMessage } from "@/components/Chatbox";
import GameArea from "@/components/CardGame/GameArea";
import useSocket from "@/hooks/useSocket";

const CardGame = ({ room }: { room?: string }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<Nullable<JWTUser>>(null);
  const [rooms, setRooms] = useState<string[]>([]);
  const [roomState, setRoomState] = useState<Nullable<SharedGameState>>(null);
  const [chatMessagelist, setChatMessageList] = useState<ChatMessage[]>([]);
  const socket = useSocket({
    server: "http://localhost:8080",
    jwt:
      typeof window !== "undefined"
        ? localStorage.getItem("cggame-sess")
        : null,
    opts: {
      autoConnect: false,
    },
  });

  useEffect(() => {
    if (!socket) return;

    socket.on("roomNotFound", ({ room }) => {
      console.error(`Room "${room}" not found at the server.`);
      router.push("/game");
    });

    socket.on("roomInfo", ({ json }) => {
      const state = SuperJSON.parse<SharedGameState>(json);

      setRoomState(state);

      if (state.messages) {
        setChatMessageList(state.messages);
      }
    });

    socket.on("rooms", ({ rooms: srvRooms }) => setRooms(srvRooms));

    // On initial connection server sends WHO.
    socket.on("who", (user) => {
      setCurrentUser(user);
      setLoading(false);

      if (room) {
        socket.emit("getRoom", { room });
      } else {
        socket.emit("getRooms");
      }

      console.log("All set, start playing brutha");
    });

    socket.on("created", ({ name }) => router.push(`/game/${name}`));

    socket.on("ping", ({ time }) => socket.emit("pong", { time }));

    socket.on("disconnect", () => {
      console.log("Disconnected from the server");
    });

    if (!socket.connected) {
      socket.connect();

      if (room) {
        socket.emit("join", { room });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  const onFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = new FormData(e.target as HTMLFormElement);

    const name = slug((data.get("room") as string) ?? "");

    if (name.length >= 3) {
      socket?.emit("create", { name });
    }
  };

  const onSrvUpdate = (state: SharedGameState) => {
    setRoomState(state);
  };

  return loading ? (
    <Section>
      <LoadingSpinner />
    </Section>
  ) : (
    <Section>
      <div className="flex flex-col items-center justify-center">
        {!room && (
          <form onSubmit={onFormSubmit}>
            <label>Room name</label>
            <input
              type="text"
              name="room"
              placeholder="Room name"
              autoComplete="off"
            />
          </form>
        )}

        {room && socket && (
          <>
            <div className="game-area">
              <h1 className="text-xl">Game area for {room}</h1>
            </div>
            <div className="my-4 grid w-full grid-cols-5 gap-2">
              <div className="col-span-4">
                {roomState && currentUser && (
                  <GameArea
                    currentUser={currentUser}
                    worldState={roomState}
                    onStateUpdate={onSrvUpdate}
                    socket={socket}
                  />
                )}
              </div>
              <div className="col-span-1">
                <Chatbox
                  room={room}
                  messages={chatMessagelist}
                  socket={socket}
                />
              </div>
            </div>
          </>
        )}
        <div className="room-list">
          <ul>
            {rooms.map((room) => (
              <li key={room}>
                <a href={`/game/${room}`}>{room} &raquo;</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <h1 className="text-white">Let&apos;s play {currentUser?.name}</h1>
    </Section>
  );
};

export default CardGame;
