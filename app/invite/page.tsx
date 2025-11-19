"use client";
import { useEffect, useState } from "react";
import Hero from "@/app/components/Hero";
import Footer from "@/app/components/Footer";
import BackgroundParticles from "@/app/components/BackgroundParticles";
import MusicPlayer from "@/app/components/MusicPlayer";
import ThreeScene from "@/app/components/ThreeScene";
import RSVPForm from "@/app/components/RSVPForm";
import Countdown from "@/app/components/Countdown";
import confetti from "canvas-confetti";

interface Guest {
  name?: string;
  [key: string]: any;
}

export default function InvitePage() {
  const [guest, setGuest] = useState<Guest | null>(null);
  const [guestId, setGuestId] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("to") || params.get("id");
    setGuestId(id);

    if (!id) return;

    fetch(`/api/guest?id=${id}`)
      .then((r) => r.json())
      .then((data) => {
        setGuest(data);
        confetti({ particleCount: 80, spread: 70 });
      })
      .catch(() => setGuest({ name: "Bạn thân mến" }));
  }, []);

  const CHECKIN_START = "2025-11-22T11:20:00+07:00";
  const CEREMONY_START = "2025-11-22T11:40:00+07:00";
  const CEREMONY_END = "2025-11-22T12:20:00+07:00";
  const musicSrc = "/assets/music.mp3";

  return (
    <div className="min-h-screen relative">
      <BackgroundParticles />
      <MusicPlayer src={musicSrc} />
      <div className="max-w-4xl mx-auto p-6">
        <Hero guest={guest} />
        <Countdown
          checkInISO={CHECKIN_START}
          ceremonyStartISO={CEREMONY_START}
          ceremonyEndISO={CEREMONY_END}
        />

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="mt-4 flex gap-3">
              <a
                href={`https://maps.google.com/?q=${process.env.NEXT_PUBLIC_EVENT_LAT},${process.env.NEXT_PUBLIC_EVENT_LNG}`}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Mở chỉ đường
              </a>
              <a
                href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
                  "Lễ tốt nghiệp của Minh Nhật🎓"
                )}&dates=${formatGoogleDates(CHECKIN_START)}`}
                target="_blank"
                className="px-4 py-2 bg-gray-800 text-white rounded"
              >
                Thêm vào Google Calendar
              </a>
            </div>
          </div>

          <div>
            <ThreeScene />
            <RSVPForm guestId={guestId ?? ""} guestName={guest?.name ?? ""} />
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}

function formatGoogleDates(iso: string) {
  const d = new Date(iso);
  const y = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  const hh = String(d.getUTCHours()).padStart(2, "0");
  const mi = String(d.getUTCMinutes()).padStart(2, "0");
  const ss = String(d.getUTCSeconds()).padStart(2, "0");
  const endH = String(Number(hh) + 3).padStart(2, "0");
  return `${y}${mm}${dd}T${hh}${mi}${ss}Z/${y}${mm}${dd}T${endH}${mi}${ss}Z`;
}
