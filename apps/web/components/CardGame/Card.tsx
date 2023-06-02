import { HTMLProps, Ref, forwardRef } from "react";
import { Card } from "@cards/types/default";

interface Props {
  card: Card;
  degree: number;
  onCardSelect?: (card: Card) => void;
}

type CardRef = HTMLDivElement;
type CardProps = HTMLProps<HTMLDivElement> & Props;

const CardComponent = (
  { card, onCardSelect, degree, ...props }: CardProps,
  ref: Ref<CardRef>
) => {
  const handleClick = () => {
    if (onCardSelect) {
      onCardSelect(card);
    }
  };
  return (
    <div
      className="flex h-72 w-56 flex-col justify-between space-x-1 rounded-lg bg-white p-4 shadow-md transition-transform hover:-translate-y-1/4"
      onClick={handleClick}
      {...props}
      ref={ref}
    >
      <div className="mb-2 text-lg font-bold text-gray-800">{card.value}</div>
      <div className="text-sm text-gray-600">
        Cards Against Humanity {degree}
      </div>
    </div>
  );
};

export default forwardRef<CardRef, CardProps>(CardComponent);
