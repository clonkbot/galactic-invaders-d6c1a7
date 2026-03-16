import { forwardRef, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface PlayerShipProps {
  position: [number, number, number];
  isInvincible: boolean;
}

export const PlayerShip = forwardRef<THREE.Group, PlayerShipProps>(
  ({ position, isInvincible }, ref) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const engineGlowRef = useRef<THREE.PointLight>(null);
    const blinkRef = useRef(0);

    useFrame((state) => {
      if (meshRef.current) {
        // Hover animation
        meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 3) * 0.05;
        meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 2) * 0.03;
      }

      if (engineGlowRef.current) {
        engineGlowRef.current.intensity = 1.5 + Math.sin(state.clock.elapsedTime * 10) * 0.5;
      }

      // Invincibility blink
      if (isInvincible) {
        blinkRef.current += 1;
        if (meshRef.current) {
          meshRef.current.visible = Math.floor(blinkRef.current / 5) % 2 === 0;
        }
      } else {
        if (meshRef.current) {
          meshRef.current.visible = true;
        }
      }
    });

    return (
      <group ref={ref} position={position}>
        <group ref={meshRef}>
          {/* Main body */}
          <mesh position={[0, 0.2, 0]}>
            <coneGeometry args={[0.3, 1, 6]} />
            <meshStandardMaterial
              color="#00ffff"
              emissive="#00ffff"
              emissiveIntensity={0.3}
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>

          {/* Cockpit */}
          <mesh position={[0, 0.4, 0.1]}>
            <sphereGeometry args={[0.15, 8, 8]} />
            <meshStandardMaterial
              color="#ff00ff"
              emissive="#ff00ff"
              emissiveIntensity={0.5}
              transparent
              opacity={0.8}
            />
          </mesh>

          {/* Left wing */}
          <mesh position={[-0.5, 0, 0.2]} rotation={[0, 0, -0.3]}>
            <boxGeometry args={[0.6, 0.05, 0.4]} />
            <meshStandardMaterial
              color="#00cccc"
              emissive="#00ffff"
              emissiveIntensity={0.2}
              metalness={0.9}
              roughness={0.1}
            />
          </mesh>

          {/* Right wing */}
          <mesh position={[0.5, 0, 0.2]} rotation={[0, 0, 0.3]}>
            <boxGeometry args={[0.6, 0.05, 0.4]} />
            <meshStandardMaterial
              color="#00cccc"
              emissive="#00ffff"
              emissiveIntensity={0.2}
              metalness={0.9}
              roughness={0.1}
            />
          </mesh>

          {/* Engine glow */}
          <pointLight
            ref={engineGlowRef}
            position={[0, -0.3, 0.3]}
            color="#00ffff"
            intensity={1.5}
            distance={2}
          />

          {/* Engine flame */}
          <mesh position={[0, -0.4, 0.2]}>
            <coneGeometry args={[0.15, 0.4, 6]} />
            <meshBasicMaterial color="#00ffff" transparent opacity={0.8} />
          </mesh>
        </group>
      </group>
    );
  }
);

PlayerShip.displayName = "PlayerShip";
