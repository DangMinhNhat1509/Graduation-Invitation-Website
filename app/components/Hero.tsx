"use client";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import sparkle from "@/assets/sparkle.json";
// import hình bạn đã tách nền
import myFace from "@/assets/my-face.png.png";

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
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold"
      >
        Thiệp Mời Tốt Nghiệp
      </motion.h1>

      {/* Hộp relative chứa hình + Lottie */}
      <div className="relative w-48 h-48 mx-auto my-6">
        {/* Hình mặt bạn */}
        <img
          src={myFace.src} // dùng import trực tiếp
          alt="Mặt tôi"
          className="w-40 h-40 rounded-full mx-auto absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-lg border-4 border-white"
        />

        {/* Lottie sparkle phía sau hình */}
        <Lottie animationData={sparkle} className="w-48 h-48 absolute top-0 left-0" />
      </div>

      <p className="mt-4 text-xl">
        Xin chào <strong>{guest?.name || "Bạn thân mến"}</strong>
      </p>

      <p className="text-gray-600 mt-2">
        {guest?.message || "Chúng mình rất vui mời bạn đến dự lễ tốt nghiệp 🎓"}
      </p>
    </div>
  );
}
