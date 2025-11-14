"use client";
import { motion } from "framer-motion";

export default function NearPopup() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-white px-5 py-3 shadow-lg rounded-2xl"
    >
      <p className="font-semibold">Bạn đang đến gần địa điểm 🎉</p>
    </motion.div>
  );
}
