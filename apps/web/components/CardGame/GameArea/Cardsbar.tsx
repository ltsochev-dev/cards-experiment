import type { Card } from "@cards/types/default";
import CardComponent from "../Card";
import { useEffect } from "react";
import useMeasure from "react-use-measure";

interface Props {
  cards: Card[];
}

const generateDegree = (slot: number, total: number) => {
  if (slot < 1 || slot > 10) {
    throw new Error("Number must be between 1 and 10");
  }

  const degreeRange = 75;
  const step = degreeRange / total;
  const degree = (slot - 1) * step - degreeRange / 2;

  return degree;
};

const CardsBar = ({ cards }: Props) => {
  const [ref, bounds] = useMeasure();
  useEffect(() => {
    const resizeCards = () => {
      console.log("resizing cards");
    };

    window.addEventListener("resize", resizeCards);

    resizeCards();

    return () => {
      window.removeEventListener("resize", resizeCards);
    };
  }, []);

  const cardWidth = 224;
  const parentContainer = 984;
  const totalWidth = cardWidth * cards.length;
  const totalOffset = totalWidth - parentContainer;

  console.log({ bounds });

  // @todo calculate offset

  return (
    <div className="gamebar flex flex-row space-x-1" ref={ref}>
      {cards.map((card, i) => (
        <div
          className={`absolute z-0 origin-[bottom_center] hover:z-10 left-[${Math.max(
            0,
            totalOffset / (i + 1)
          )}px]`}
          style={{
            transform: `rotate(${generateDegree(i + 1, cards.length)}deg`,
          }}
          key={card.id}
        >
          <CardComponent
            card={card}
            degree={generateDegree(i + 1, cards.length)}
          />
        </div>
      ))}
    </div>
  );
};

export default CardsBar;
