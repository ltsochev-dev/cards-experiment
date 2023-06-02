import type { Metadata } from "next";
import Image from "next/image";
import ShineImage from "@/public/images/shine.svg";
import GameBar from "@/components/GameBar";
import Section from "@/components/Section";

export default function Page() {
  return (
    <>
      <div className="game-body relative">
        <div className="game-container min-h-screen overflow-hidden">
          <Section>
            <div className="play-section relative flex min-h-screen flex-col flex-wrap items-center justify-between">
              <Image
                src={ShineImage}
                width={4000}
                alt=""
                className="pointer-events-none absolute -top-[1600px] z-0 max-w-none animate-[spin_240s_linear_infinite] select-none opacity-5"
              />
              <div className="logo-box mb-4 flex flex-col items-center justify-center pt-8">
                <a href="#">LOGO</a>
                <h1 className="text-lg text-white">
                  The free multiplayer game
                </h1>
              </div>
              <GameBar />
            </div>
          </Section>
        </div>
      </div>
    </>
  );
}

export const metadata: Metadata = {
  title: "Cards Against Humanity",
};
