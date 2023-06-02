"use client";

import { useEffect } from "react";
import SuperJSON from "superjson";
import { GamePhase, SharedGameState } from "@cards/types/default";
import { UserSocket } from "@/hooks/useSocket";
import { playerCards } from "@/data/cards";
import CardsBar from "./Cardsbar";

interface Props {
  worldState: SharedGameState;
  socket: UserSocket;
  onStateUpdate?: (state: SharedGameState) => void;
}

const getGamePhase = (phase: GamePhase) => {
  switch (phase) {
    case GamePhase.Waiting:
      return "Waiting";
    case GamePhase.Started:
      return "Started";
    default:
      return "Unknown state";
  }
};

const GameArea = ({ worldState, onStateUpdate, socket }: Props) => {
  useEffect(() => {
    socket.on("srvUpdate", handleStateUpdate);

    return () => {
      socket.off("srvUpdate", handleStateUpdate);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  const handleStateUpdate = ({ state }: { state: string }) => {
    const world = SuperJSON.parse<SharedGameState>(state);

    if (onStateUpdate) {
      onStateUpdate(world);
    }
  };

  return (
    <div className="game-window relative h-[768px] border">
      <h1>Current game phase: {getGamePhase(worldState.phase)}</h1>
      <h1>hellooo</h1>

      <div className="absolute right-2.5 top-2.5">Question Card goes here</div>

      <div className="absolute bottom-72">
        <CardsBar cards={playerCards} />
      </div>
    </div>
  );
};

export default GameArea;
