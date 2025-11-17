// components/MusicPlayer.jsx
"use client";
import { useEffect, useRef, useState } from "react";

export default function MusicPlayer({ src }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Try autoplay (will be blocked sometimes on browsers without gesture)
    const tryPlay = async () => {
      try {
        await audio.play();
        setPlaying(true);
      } catch (e) {
        setPlaying(false);
      }
    };
    tryPlay();
    return () => audio.pause();
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
