"use client";

import { useEffect, useState } from "react";
import { Meow_Script } from "next/font/google";

const meow = Meow_Script({
  subsets: ["latin"],
  weight: ["400"]
});

export default function CountdownTimer() {
  const weddingDate = new Date("2026-10-10T15:00:00-07:00");

  const calculateTimeLeft = () => {
    const difference = weddingDate.getTime() - new Date().getTime();

    if (difference <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const Box = ({
    value,
    label,
  }: {
    value: number;
    label: string;
  }) => (
    <div className="flex flex-col items-center">
      <div className="flex h-28 w-28 items-center justify-center rounded-3xl border border-[#222222] bg-[#FFFDF8] shadow-lg">
        <span className="text-5xl font-semibold text-[#222222]">
          {value.toString().padStart(2, "0")}
        </span>
      </div>

      <span className="mt-3 text-xl text-[#ffffff]">
        {label}
      </span>
    </div>
  );

  return (
    <div className="w-full max-w-6xl text-center">

      <h2 className={`${meow.className} mb-6 font-script text-[clamp(3rem,5vw,5rem)] text-[#ffffff]`}>
        Faltan...
      </h2>

      <div className="flex flex-wrap justify-center gap-8">

        <Box value={timeLeft.days} label="Días" />

        <Box value={timeLeft.hours} label="Horas" />

        <Box value={timeLeft.minutes} label="Minutos" />

        <Box value={timeLeft.seconds} label="Segundos" />

      </div>

    </div>
  );
}