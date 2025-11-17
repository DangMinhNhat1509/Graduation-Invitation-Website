// components/Countdown.jsx
"use client";
import { useEffect, useState } from "react";

export default function Countdown({ targetISO }) {
  const target = new Date(targetISO).getTime();
  const [diff, setDiff] = useState(target - Date.now());

  useEffect(() => {
    const t = setInterval(() => setDiff(target - Date.now()), 1000);
    return () => clearInterval(t);
  }, [target]);

  if (diff <= 0) return <div className="text-xl font-semibold">Đang diễn ra 🎉</div>;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const mins = Math.floor((diff / (1000 * 60)) % 60);
  const secs = Math.floor((diff / 1000) % 60);

  return (
    <div className="flex gap-3 justify-center text-center mt-4">
      <TimeBlock label="Ngày" value={days} />
      <TimeBlock label="Giờ" value={hours} />
      <TimeBlock label="Phút" value={mins} />
      <TimeBlock label="Giây" value={secs} />
    </div>
  );
}

function TimeBlock({ label, value }) {
  return (
    <div className="bg-white/80 px-4 py-2 rounded-lg shadow">
      <div className="text-2xl font-bold">{String(value).padStart(2, "0")}</div>
      <div className="text-xs text-gray-600">{label}</div>
    </div>
  );
}
