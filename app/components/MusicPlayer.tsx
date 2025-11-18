"use client";

import { useEffect, useRef, useState } from "react";

interface MusicPlayerProps {
  src: string;
}

export default function MusicPlayer({ src }: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState<boolean>(true);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const tryPlay = async () => {
      try {
        await audio.play();
        setPlaying(true);
      } catch (e) {
        setPlaying(false);
      }
    };

    tryPlay();
    return () => {
      audio.pause();
    };
  }, []);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play();
      setPlaying(true);
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <audio ref={audioRef} src={src} loop />
      <button
        onClick={toggle}
        className="px-3 py-2 bg-white/90 backdrop-blur rounded-full shadow-md"
      >
        {playing ? "🔊 Tắt nhạc" : "🔈 Bật nhạc"}
      </button>
    </div>
  );
}
