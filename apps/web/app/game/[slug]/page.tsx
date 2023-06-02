import CardGame from "@/components/CardGame";
import { Metadata } from "next/types";

export default function Page({
  params: { slug },
}: {
  params: { slug: string };
}) {
  return (
    <>
      <div className="game-body relative">
        <CardGame room={slug} />
      </div>
    </>
  );
}

export const metadata: Metadata = {
  title: "Play Cards Against Humanity",
};
