"use client";

import { motion } from "framer-motion";
import Lottie from "lottie-react";
import sparkle from "@/assets/sparkle.json";
import myFace from "@/assets/my-face.png.png"; // ảnh đã tách nền

interface Guest {
  name?: string;
  message?: string;
}

interface HeroProps {
  guest?: Guest | null;
}

export default function Hero({ guest }: HeroProps) {
  return (
    <div className="text-center py-10">
      {/* Tiêu đề */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold"
      >
        Thiệp Mời Tốt Nghiệp
      </motion.h1>

      {/* Hộp relative chứa hình + Lottie */}
      <div className="relative mx-auto my-6 w-4/5 sm:w-1/3 lg:w-1/5">
        {/* Hình mặt – KHÔNG KHUNG + KHÔNG SHADOW */}
        <img
          src={myFace.src}
          alt="Mặt tôi"
          className="w-full h-auto mx-auto"
        />

        {/* Lottie sparkle xung quanh */}
        <Lottie
          animationData={sparkle}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none"
        />
      </div>

      {/* Lời chào và lời mời */}
      <p className="mt-4 text-xl">
        Xin chào <strong>{guest?.name || "Bạn thân mến"}</strong>
      </p>

      <p className="text-gray-600 mt-2">
        {guest?.message || "Chúng mình rất vui mời bạn đến dự lễ tốt nghiệp 🎓"}
      </p>
    </div>
  );
}
