"use client";
import { useEffect, useState } from "react";

interface CountdownProps {
  checkInISO: string;
  ceremonyStartISO: string;
  ceremonyEndISO: string;
}

export default function Countdown({ checkInISO, ceremonyStartISO, ceremonyEndISO }: CountdownProps) {
  const CHECKIN_START = new Date(checkInISO);
  const CEREMONY_START = new Date(ceremonyStartISO);
  const CEREMONY_END = new Date(ceremonyEndISO);

  const [diff, setDiff] = useState(CHECKIN_START.getTime() - Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setDiff(CHECKIN_START.getTime() - Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, [CHECKIN_START]);

  const isEventLive = Date.now() >= CEREMONY_START.getTime() && Date.now() <= CEREMONY_END.getTime();
  const isAfterEvent = Date.now() > CEREMONY_END.getTime();

  if (isAfterEvent) {
    return (
      <div className="text-center">
        <div className="text-lg font-semibold mb-2">Lễ tốt nghiệp đã kết thúc 🎓</div>
      </div>
    );
  }

  if (isEventLive) {
    return (
      <div className="text-center">
        <div className="text-lg font-semibold mb-2">
          Sự kiện đang diễn ra: {formatTime(CEREMONY_START)} – {formatTime(CEREMONY_END)}, 22/11/2025
        </div>
        <div className="text-xl font-bold">🎉 Đang diễn ra!</div>
      </div>
    );
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return (
    <div className="text-center">
      <div className="text-lg font-semibold mb-3">
        Giờ check-in: {formatTime(CHECKIN_START)} | Giờ trao bằng: {formatTime(CEREMONY_START)} – {formatTime(CEREMONY_END)}, 22/11/2025
      </div>
      <div className="flex justify-center gap-3 mb-3">
        <TimeBlock label="Ngày" value={days} />
        <TimeBlock label="Giờ" value={hours} />
        <TimeBlock label="Phút" value={minutes} />
        <TimeBlock label="Giây" value={seconds} />
      </div>
    </div>
  );
}

function TimeBlock({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white/80 px-4 py-2 rounded-lg shadow">
      <div className="text-2xl font-bold">{String(value).padStart(2, "0")}</div>
      <div className="text-xs text-gray-600">{label}</div>
    </div>
  );
}

function formatTime(date: Date) {
  const h = date.getHours().toString().padStart(2, "0");
  const m = date.getMinutes().toString().padStart(2, "0");
  return `${h}:${m}`;
}
