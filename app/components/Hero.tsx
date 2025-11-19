"use client";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import sparkle from "@/assets/sparkle.json";

interface Guest {
  name?: string;
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

      <Lottie animationData={sparkle} className="w-40 mx-auto" />

      <p className="mt-4 text-xl">
        Xin chào <strong>{guest?.name || "Bạn thân mến"}</strong>
      </p>
      <p className="text-gray-600 mt-2">
        Chúng mình rất vui mời bạn đến dự lễ tốt nghiệp 🎓
      </p>
    </div>
  );
}
