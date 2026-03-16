import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface BulletProps {
  position: [number, number, number];
  isEnemy: boolean;
}

export function Bullet({ position, isEnemy }: BulletProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.2;
    }
  });

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <octahedronGeometry args={[0.1, 0]} />
        <meshBasicMaterial
          color={isEnemy ? "#ff0000" : "#00ff00"}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Glow effect */}
      <pointLight
        color={isEnemy ? "#ff0000" : "#00ff00"}
        intensity={0.5}
        distance={1}
      />

      {/* Trail */}
      <mesh position={[0, isEnemy ? 0.2 : -0.2, isEnemy ? -0.1 : 0.1]}>
        <cylinderGeometry args={[0.02, 0.08, 0.3, 6]} />
        <meshBasicMaterial
          color={isEnemy ? "#ff0000" : "#00ff00"}
          transparent
          opacity={0.5}
        />
      </mesh>
    </group>
  );
}
