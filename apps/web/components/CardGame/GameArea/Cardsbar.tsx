import useMeasure from "react-use-measure";
import { motion } from "framer-motion";
import CardComponent from "../Card";
import type { Card } from "@cards/types/default";

interface Props {
  cards: Card[];
  disabled?: boolean;
  onCardSelect?: (card: Card) => void;
}

const cardWidth = 244;

const generateDegree = (slot: number, total: number, baseRotaDegree = 15) => {
  const middleCardIndex = Math.floor(total / 2);
  const maxOffset = middleCardIndex * baseRotaDegree;

  const offset = (slot - middleCardIndex) * baseRotaDegree;

  return Math.min(offset, maxOffset);
};

const CardsBar = ({ cards, disabled = false, onCardSelect }: Props) => {
  const [ref, { width: parentContainer }] = useMeasure();

  const totalCards = cards.length;
  const totalCardsWidth = totalCards * cardWidth;
  const spacing = (parentContainer - totalCardsWidth) / (totalCards + 1);

  const handleCardSelect = (card: Card) => {
    if (onCardSelect && disabled !== true) {
      onCardSelect(card);
    }
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
            x: (i + 1) * spacing + i * cardWidth,
            rotate: generateDegree(i, cards.length, 5),
          }}
          whileHover={{
            scale: 1.25,
            zIndex: 50,
          }}
          key={i}
        >
          <CardComponent
            card={card}
            disabled={disabled}
            onCardSelect={handleCardSelect}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default CardsBar;
