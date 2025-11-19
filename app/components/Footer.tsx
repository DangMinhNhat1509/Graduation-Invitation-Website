// components/Footer.jsx
"use client";
import React from "react";

export default function Footer() {
  return (
    <footer className="mt-16 py-6 text-center text-sm text-gray-600">
      <div>© {new Date().getFullYear()} Thiệp mời tốt nghiệp — Minh Nhật</div>
      <div className="mt-2">
        <a className="underline" href="mailto:youremail@example.com">Liên hệ</a>
        {" • "}
        <a className="underline" href="https://vercel.com" target="_blank">Deployed on Vercel</a>
      </div>
    </footer>
  );
}
