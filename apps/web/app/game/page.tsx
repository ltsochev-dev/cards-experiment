import type { Metadata } from "next";
import CardGame from "@/components/CardGame";

export default function Page() {
  return (
    <>
      <div className="game-body relative">
        <CardGame />
      </div>
    </>
  );
}

export const metadata: Metadata = {
  title: "Play Cards Against Humanity",
};
