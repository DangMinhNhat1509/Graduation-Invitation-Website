"use client";

import { useEffect, useRef, useState } from "react";

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);

  useEffect(() => {
    const handleInteraction = () => {
      if (userInteracted) return;

      const audio = audioRef.current;
      if (!audio) return;

      audio.play().then(() => {
        setPlaying(true);
        setUserInteracted(true);
      }).catch(() => {
        setPlaying(false);
      });
    };

    // Lắng nghe lần click, touch hoặc keydown đầu tiên trên document
    document.addEventListener("click", handleInteraction, { once: true });
    document.addEventListener("touchstart", handleInteraction, { once: true });
    document.addEventListener("keydown", handleInteraction, { once: true });

    return () => {
      document.removeEventListener("click", handleInteraction);
      document.removeEventListener("touchstart", handleInteraction);
      document.removeEventListener("keydown", handleInteraction);
    };
  }, [userInteracted]);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <audio ref={audioRef} src="/music/nhacnen.mp3" loop />
      <button
        onClick={toggle}
        className="px-3 py-2 bg-white/90 backdrop-blur rounded-full shadow-md"
      >
        {playing ? " 🔊 " : " 🔈 "}
      </button>
    </div>
  );
}
