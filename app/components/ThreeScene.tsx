"use client";
import dynamic from "next/dynamic";

interface ThreeSceneProps {
  className?: string;
}

const Scene = dynamic(() => import("./ThreeSceneContent"), { ssr: false });

export default function ThreeScene({ className = "h-60 w-full" }: ThreeSceneProps) {
  return (
    <div className={className}>
      <Scene />
    </div>
  );
}
