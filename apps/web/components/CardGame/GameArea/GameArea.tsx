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
import { UserSocket } from "@/context/websocket.context";
import CardsBar from "./Cardsbar";
import { QuestionCards } from "@cards/data";
import { randomNumber } from "@cards/utils";
import useToggle from "@/hooks/useToggle";
import Timer from "@/components/Timer/Timer";

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
      <div className="absolute right-0 top-0 pr-4 text-right">
        <h1>Current game phase: {getGamePhase(worldState.phase)}</h1>
        <button type="button" onClick={toggleDeck}>
          Toggle deck
        </button>
      </div>

      <div className="absolute left-0 right-0 top-[10%] text-center">
        <span className="text-3xl font-semibold text-white">
          Въпрос: {questionCard.value}
        </span>
      </div>

      <div className="timer-container absolute left-3 top-3">
        {deckOpen && <Timer seconds={125} />}
      </div>

      <div className="absolute inset-x-0 bottom-4">
        <CardsBar
          cards={cards}
          deckOpen={deckOpen}
          onCardSelect={handleCardSelect}
          onDeckOpenClick={toggleDeck}
        />
      </div>
    </div>
  );
};

export default GameArea;
