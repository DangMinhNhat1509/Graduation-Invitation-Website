"use client";

import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import Hero from "@/components/Hero";
import MapSection from "@/components/MapSection";

export default function Page() {
  const [guest, setGuest] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("to");
    if (!id) return;

    fetch(`/api/guest?id=${id}`)
      .then((res) => res.json())
      .then((data) => {
        setGuest(data);
        confetti();
      });
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-5">
      <Hero guest={guest} />
      <MapSection />

      <div className="text-center mt-10">
        <a
          className="px-6 py-3 bg-black text-white rounded-xl"
          href="https://maps.google.com/?q=10.773374,106.660728"
          target="_blank"
        >
          Chỉ đường tới sự kiện
        </a>
      </div>
    </div>
  );
}
