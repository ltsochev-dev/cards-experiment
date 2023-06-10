import { HTMLProps, Ref, forwardRef } from "react";
import { Card } from "@cards/types/default";
import BlankCard from "./BlankCard";

interface Props {
  card: Card;
  disabled?: boolean;
  onCardSelect?: (card: Card) => void;
}

type CardRef = HTMLDivElement;
type CardProps = HTMLProps<HTMLDivElement> & Props;

const CardComponent = (
  { card, onCardSelect, disabled = false, ...props }: CardProps,
  ref: Ref<CardRef>
) => {
  const handleClick = () => {
    if (onCardSelect && !disabled) {
      onCardSelect(card);
    }
  };

  return (
    <BlankCard {...props} disabled={disabled} onClick={handleClick} ref={ref}>
      <div className="mb-2 text-lg font-bold text-gray-800">{card.value}</div>
    </BlankCard>
  );
};

export default forwardRef<CardRef, CardProps>(CardComponent);
