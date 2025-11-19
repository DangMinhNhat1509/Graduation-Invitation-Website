"use client";
import { useEffect, useState } from "react";

interface CountdownProps {
  targetISO: string;
}

export default function Countdown({ targetISO }: CountdownProps) {
  const target = new Date(targetISO).getTime();
  const [diff, setDiff] = useState(target - Date.now());

  useEffect(() => {
    const t = setInterval(() => setDiff(target - Date.now()), 1000);
    return () => clearInterval(t);
  }, [target]);

  // Nếu đã đến giờ → hiển thị “Đang diễn ra”
  if (diff <= 0) {
    return (
      <div className="text-center">
        <div className="text-lg font-semibold mb-2">
          Sự kiện diễn ra vào lúc <span className="font-bold">11:20 – 12:20, 22/11/2025</span>
        </div>
        <div className="text-xl font-bold">Đang diễn ra 🎉</div>
      </div>
    );
  }

  // Tính thời gian còn lại
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const mins = Math.floor((diff / (1000 * 60)) % 60);
  const secs = Math.floor((diff / 1000) % 60);

  return (
    <div className="text-center">
      {/* Phần hiển thị ngày giờ sự kiện */}
      <div className="text-lg font-semibold mb-3">
        Sự kiện diễn ra vào lúc{" "}
        <span className="font-bold">11:20 – 12:20, 22/11/2025</span>
      </div>

      {/* Đồng hồ đếm ngược */}
      <div className="flex gap-3 justify-center text-center">
        <TimeBlock label="Ngày" value={days} />
        <TimeBlock label="Giờ" value={hours} />
        <TimeBlock label="Phút" value={mins} />
        <TimeBlock label="Giây" value={secs} />
      </div>
    </div>
  );
}

interface TimeBlockProps {
  label: string;
  value: number;
}

function TimeBlock({ label, value }: TimeBlockProps) {
  return (
    <div className="bg-white/80 px-4 py-2 rounded-lg shadow">
      <div className="text-2xl font-bold">{String(value).padStart(2, "0")}</div>
      <div className="text-xs text-gray-600">{label}</div>
    </div>
  );
}
