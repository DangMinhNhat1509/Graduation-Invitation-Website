"use client";
import { useEffect, useState } from "react";

const CHECKIN_START = new Date("2025-11-22T11:20:00"); // giờ check-in
const CEREMONY_START = new Date("2025-11-22T11:40:00"); // giờ trao bằng
const CEREMONY_END = new Date("2025-11-22T12:20:00"); // kết thúc

export default function ConvocationCountdown() {
  const [diff, setDiff] = useState(CHECKIN_START.getTime() - Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setDiff(CHECKIN_START.getTime() - Date.now());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const isEventLive = Date.now() >= CEREMONY_START.getTime() && Date.now() <= CEREMONY_END.getTime();
  const isAfterEvent = Date.now() > CEREMONY_END.getTime();

  // Nếu đã kết thúc
  if (isAfterEvent) {
    return (
      <div className="text-center">
        <div className="text-lg font-semibold mb-2">Lễ tốt nghiệp đã kết thúc 🎓</div>
      </div>
    );
  }

  // Nếu đang diễn ra
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

  // Tính thời gian còn lại
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return (
    <div className="text-center">
      {/* Thông tin sự kiện */}
      <div className="text-lg font-semibold mb-3">
        Giờ check-in: {formatTime(CHECKIN_START)} | Giờ trao bằng: {formatTime(CEREMONY_START)} – {formatTime(CEREMONY_END)}, 22/11/2025
      </div>

      {/* Countdown */}
      <div className="flex justify-center gap-3 mb-3">
        <TimeBlock label="Ngày" value={days} />
        <TimeBlock label="Giờ" value={hours} />
        <TimeBlock label="Phút" value={minutes} />
        <TimeBlock label="Giây" value={seconds} />
      </div>

      {/* Add to Calendar */}
      <AddToCalendarButton />
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

// Add to Calendar button (ics file)
function AddToCalendarButton() {
  const handleClick = () => {
    const icsContent = `
BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:Lễ Tốt Nghiệp Convocation Day 2025
DTSTART:${formatICSDate(CEREMONY_START)}
DTEND:${formatICSDate(CEREMONY_END)}
DESCRIPTION:Check-in 11:20, trao bằng 11:40-12:20
LOCATION:Tầng 5 Hội trường A
END:VEVENT
END:VCALENDAR
`;
    const blob = new Blob([icsContent], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Convocation2025.ics";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleClick}
      className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow text-sm"
    >
      Thêm vào lịch
    </button>
  );
}

function formatICSDate(date: Date) {
  // YYYYMMDDTHHmmssZ
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}T${pad(
    date.getUTCHours()
  )}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}Z`;
}
