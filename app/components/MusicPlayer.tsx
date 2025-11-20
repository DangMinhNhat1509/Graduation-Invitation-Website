"use client";

import { useEffect, useRef, useState } from "react";

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const tryPlay = async () => {
      try {
        await audio.play(); // cố gắng auto play khi component mount
        setPlaying(true);
      } catch {
        setPlaying(false); // nếu trình duyệt chặn autoplay
      }
    };

    tryPlay();

    return () => {
      audio.pause(); // dừng nhạc khi unmount
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
