"use client";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, RoundedBox, Stage } from "@react-three/drei";

export default function ThreeSceneContent() {
  return (
    <Canvas>
      <Stage environment="city" intensity={0.6}>
        <RoundedBox args={[2.5, 1.6, 0.3]} radius={0.08} smoothness={4}>
          <meshStandardMaterial color="#6B21A8" metalness={0.6} roughness={0.2} />
        </RoundedBox>
      </Stage>
      <OrbitControls enableZoom={false} />
    </Canvas>
  );
}
