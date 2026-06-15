"use client";

import { useRef } from "react";

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  return (
    <>
      <audio ref={audioRef} src="/music/Enchanted.mp3" loop preload="auto" />

      {/* optional global button */}
      <button
        onClick={() => audioRef.current?.play()}
        className="fixed bottom-4 right-4 z-50 px-4 py-2 bg-black text-white rounded-full text-sm"
      >
        ▶ Music
      </button>
    </>
  );
}