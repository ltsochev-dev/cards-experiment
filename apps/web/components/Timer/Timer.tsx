"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import ClockIcon from "public/images/clock.svg";

interface Props {
  seconds: number;
  tickRate?: number;
  isPaused?: boolean;
  onTick?: (secondsLeft: number) => void;
  onFinish?: () => void;
}

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds
  ).padStart(2, "0")}`;
};

const Timer = ({
  seconds,
  tickRate = 1000,
  isPaused = false,
  onTick,
  onFinish,
}: Props) => {
  const [secondsRemaining, setSecondsRemaining] = useState(seconds);
  const [isComplete, setComplete] = useState(false);

  // Update seconds if the parent component updates the value
  useEffect(() => {
    setSecondsRemaining(seconds);
    if (seconds > 0) {
      setComplete(false);
    }
  }, [seconds]);

  useEffect(() => {
    const tick = () => {
      setSecondsRemaining((prevSeconds) => {
        const newSeconds = Math.max(0, prevSeconds - 1);

        if (onTick) {
          onTick(newSeconds);
        }

        if (newSeconds <= 0) {
          setComplete(true);
          if (onFinish) {
            onFinish();
          }
        }

        return newSeconds;
      });
    };

    if (!isPaused && !isComplete) {
      const timerId = setTimeout(tick, tickRate);

      return () => clearTimeout(timerId);
    }
  }, [isComplete, isPaused, onFinish, onTick, secondsRemaining, tickRate]);

  return (
    <div className="pointer-events-none relative select-none">
      <div className="rounded-full bg-white bg-opacity-20 pl-8 pr-2 shadow-inner">
        <span className="text-stroke animate-text bg-gradient-to-r from-teal-500 via-purple-500 to-orange-500 bg-clip-text text-xl font-black text-transparent">
          {formatTime(secondsRemaining)}
        </span>
      </div>
      <div className="absolute left-0 top-0 flex h-7 w-7 items-center justify-center overflow-hidden rounded-full object-contain">
        <Image src={ClockIcon} alt="Clock icon" className="object-contain" />
      </div>
    </div>
  );
};

export default Timer;

// box-shadow: rgba(0, 0, 0, 0.2) 0px 3px 3px -2px, rgba(0, 0, 0, 0.14) 0px 3px 4px 0px, rgba(0, 0, 0, 0.12) 0px 1px 8px 0px
