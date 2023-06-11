"use client";

import { useEffect, useState } from "react";
import SuperJSON from "superjson";
import {
  Card,
  GamePhase,
  JWTUser,
  QuestionCard,
  SharedGameState,
} from "@cards/types/default";
import { UserSocket } from "@/hooks/useSocket";
import CardsBar from "./Cardsbar";
import { QuestionCards } from "@cards/data";
import { randomNumber } from "@cards/utils";
import useToggle from "@/hooks/useToggle";

interface Props {
  currentUser: JWTUser;
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

const GameArea = ({
  currentUser,
  worldState,
  onStateUpdate,
  socket,
}: Props) => {
  const [deckOpen, toggleDeck] = useToggle(false);
  const [questionCard, _] = useState<QuestionCard>(
    () => QuestionCards[randomNumber(0, QuestionCards.length - 1)]
  );

  const currentPlayer = worldState.players.get(currentUser.sub);
  const cards = currentPlayer?.cards ?? [];

  useEffect(() => {
    socket.on("srvUpdate", handleStateUpdate);
    socket.on("removeCard", handleRemoveCard);

    return () => {
      socket.off("srvUpdate", handleStateUpdate);
      socket.off("removeCard", handleRemoveCard);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  const handleStateUpdate = ({ state }: { state: string }) => {
    const world = SuperJSON.parse<SharedGameState>(state);

    if (onStateUpdate) {
      onStateUpdate(world);
    }
  };

  const handleRemoveCard = ({ card: cardId }: { card: string }) => {
    const index = cards.findIndex((card) => card.id === cardId);

    if (index > -1) {
      cards.splice(index, 1);
    }
  };

  const handleCardSelect = (card: Card) => {
    socket.emit("playCard", { room: worldState.name, card: card.id });
  };

  return (
    <div className="game-window relative h-[768px] border">
      <h1>Current game phase: {getGamePhase(worldState.phase)}</h1>

      <div className="absolute right-2.5 top-2.5">
        Question Card: {questionCard.value}
      </div>

      <div className="absolute inset-x-0 bottom-4">
        <CardsBar
          cards={cards}
          deckOpen={deckOpen}
          onCardSelect={handleCardSelect}
          onDeckOpenClick={toggleDeck}
        />
      </div>
      <button type="button" onClick={toggleDeck}>
        Toggle deck
      </button>
    </div>
  );
};

export default GameArea;
