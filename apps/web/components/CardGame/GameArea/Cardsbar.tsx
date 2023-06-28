import { useState } from "react";
import useMeasure from "react-use-measure";
import { motion } from "framer-motion";
import { Nullable, type Card } from "@cards/types/default";
import CardComponent from "../Card";
import BlankCard from "../BlankCard";

interface Props {
  cards: Card[];
  deckOpen?: boolean;
  disabled?: boolean;
  onCardSelect?: (card: Card) => void;
  onDeckOpenClick?: () => void;
}

const cardWidth = 244;
const cardHeight = 288;

const generateDegree = (slot: number, total: number, baseRotaDegree = 15) => {
  const middleCardIndex = Math.floor(total / 2);
  const maxOffset = middleCardIndex * baseRotaDegree;

  const offset = (slot - middleCardIndex) * baseRotaDegree;

  return Math.min(offset, maxOffset);
};

const CardsBar = ({
  cards,
  deckOpen = false,
  disabled = false,
  onCardSelect,
  onDeckOpenClick,
}: Props) => {
  const [ref, { width: parentContainer }] = useMeasure();
  const [selectedCard, setSelectedCard] = useState<Nullable<Card>>(null);

  const totalCards = cards.length;
  const totalCardsWidth = totalCards * cardWidth;
  const spacing = (parentContainer - totalCardsWidth) / (totalCards + 1);

  const handleDeckOpenClick = () => {
    setSelectedCard(null);

    if (onDeckOpenClick) {
      onDeckOpenClick();
    }
  };

  const handleCardSelect = (card: Card) => {
    if (onCardSelect && disabled !== true && selectedCard?.id !== card.id) {
      setSelectedCard(card);

      setTimeout(() => {
        onCardSelect(card);
      }, 120);
    }
  };

  const generateCoords = (
    card: Card,
    i: number
  ): { x: number | string; y?: number; rotate?: number } => {
    if (selectedCard?.id === card.id && deckOpen) {
      return {
        x: cardHeight * 1.5,
        y: cardWidth * -1.5,
        rotate: 0,
      };
    }

    return {
      x: deckOpen ? (i + 1) * spacing + i * cardWidth : "16px",
    };
  };

  return (
    <div className="gamebar flex flex-row space-x-1" ref={ref}>
      {cards.map((card, i) => (
        <motion.div
          className="absolute bottom-0"
          style={{
            zIndex: cards.length - i,
          }}
          animate={{
            rotate: deckOpen ? generateDegree(i, cards.length, 5) : i * 0.5,
            ...generateCoords(card, i),
            transition: {
              ease: "anticipate",
            },
          }}
          {...(deckOpen
            ? {
                whileHover: {
                  scale: 1.25,
                  zIndex: 50,
                },
              }
            : {})}
          key={i}
        >
          <CardComponent
            card={card}
            disabled={disabled}
            onCardSelect={handleCardSelect}
          />
        </motion.div>
      ))}
      {!deckOpen && (
        <motion.div
          className="absolute bottom-0"
          style={{ zIndex: 100 }}
          animate={{ x: "16px" }}
        >
          <BlankCard onClick={handleDeckOpenClick} />
        </motion.div>
      )}
    </div>
  );
};

export default CardsBar;
