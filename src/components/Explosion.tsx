import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ExplosionProps {
  position: [number, number, number];
  color: string;
}

export function Explosion({ position, color }: ExplosionProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [scale, setScale] = useState(0.1);
  const [opacity, setOpacity] = useState(1);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  useFrame((_, delta) => {
    if (groupRef.current) {
      setScale((prev) => Math.min(prev + delta * 8, 2));
      setOpacity((prev) => Math.max(prev - delta * 3, 0));
      groupRef.current.rotation.y += delta * 5;
      groupRef.current.rotation.x += delta * 3;
    }
  });

  if (!visible || opacity <= 0) return null;

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Core */}
      <mesh>
        <icosahedronGeometry args={[0.3, 1]} />
        <meshBasicMaterial color={color} transparent opacity={opacity} />
      </mesh>

      {/* Outer burst */}
      <mesh>
        <icosahedronGeometry args={[0.5, 0]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={opacity * 0.5}
          wireframe
        />
      </mesh>

      {/* Particles */}
      {[...Array(8)].map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * 0.4 * scale,
              Math.sin(angle * 2) * 0.3 * scale,
              Math.sin(angle) * 0.4 * scale,
            ]}
          >
            <boxGeometry args={[0.1, 0.1, 0.1]} />
            <meshBasicMaterial color={color} transparent opacity={opacity * 0.8} />
          </mesh>
        );
      })}

      {/* Light flash */}
      <pointLight color={color} intensity={opacity * 3} distance={3} />
    </group>
  );
}
