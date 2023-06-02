import { HTMLProps, Ref, forwardRef } from "react";
import { Card } from "@cards/types/default";

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
    if (onCardSelect) {
      onCardSelect(card);
    }
  };

  return (
    <div
      className={`flex h-72 w-56 flex-col justify-between space-x-1 rounded-lg ${
        disabled !== true ? "bg-white" : "bg-gray-500"
      } p-4 shadow-md`}
      onClick={handleClick}
      {...props}
      ref={ref}
    >
      <div className="mb-2 text-lg font-bold text-gray-800">{card.value}</div>
      <div className="text-sm text-gray-600">Cards Against Humanity</div>
    </div>
  );
};

export default forwardRef<CardRef, CardProps>(CardComponent);
