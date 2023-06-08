"use client";

import { useEffect, useState } from "react";
import SuperJSON from "superjson";
import { Card, GamePhase, SharedGameState } from "@cards/types/default";
import { UserSocket } from "@/hooks/useSocket";
import CardsBar from "./Cardsbar";
import { PlayerCards } from "@cards/data";

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
  const [cards, setCards] = useState<Card[]>(PlayerCards);
  const [usedCards, setUsedCards] = useState<Card[]>([]);

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

  const handleCardSelect = (card: Card) => {
    setUsedCards((prevState) => [...prevState, card]);
    setCards((prevState) => prevState.filter((item) => item.id !== card.id));
  };

  return (
    <div className="game-window relative h-[768px] border">
      <h1>Current game phase: {getGamePhase(worldState.phase)}</h1>
      <h1>Изиграни карти до момента</h1>
      <div className="played-cards">
        <ul>
          {usedCards.map((card) => (
            <li key={card.id}>{card.value}</li>
          ))}
        </ul>
      </div>

      <div className="absolute right-2.5 top-2.5">Question Card goes here</div>

      <div className="absolute inset-x-0 bottom-4">
        <CardsBar cards={cards} onCardSelect={handleCardSelect} />
      </div>
    </div>
  );
};

export default GameArea;
