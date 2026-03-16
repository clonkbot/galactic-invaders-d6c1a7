import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface AlienProps {
  position: [number, number, number];
  type: number;
}

export function Alien({ position, type }: AlienProps) {
  const meshRef = useRef<THREE.Group>(null);
  const timeOffset = useRef(Math.random() * Math.PI * 2);

  const colors = ["#ff00ff", "#00ffff", "#ffff00"];
  const color = colors[type];

  useFrame((state) => {
    if (meshRef.current) {
      // Floating animation
      meshRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime * 2 + timeOffset.current) * 0.1;
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime + timeOffset.current) * 0.2;
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 1.5 + timeOffset.current) * 0.1;
    }
  });

  // Different alien designs based on type
  if (type === 0) {
    // Octopus-like alien
    return (
      <group ref={meshRef} position={position}>
        <mesh>
          <sphereGeometry args={[0.35, 8, 8]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.4}
            metalness={0.5}
            roughness={0.3}
          />
        </mesh>
        {/* Eyes */}
        <mesh position={[-0.12, 0.1, 0.28]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <mesh position={[0.12, 0.1, 0.28]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        {/* Tentacles */}
        {[-0.2, 0, 0.2].map((x, i) => (
          <mesh key={i} position={[x, -0.3, 0]} rotation={[0.3, 0, (i - 1) * 0.2]}>
            <cylinderGeometry args={[0.05, 0.03, 0.3, 6]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} />
          </mesh>
        ))}
      </group>
    );
  }

  if (type === 1) {
    // Crab-like alien
    return (
      <group ref={meshRef} position={position}>
        <mesh>
          <boxGeometry args={[0.5, 0.3, 0.3]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.4}
            metalness={0.6}
            roughness={0.2}
          />
        </mesh>
        {/* Claws */}
        <mesh position={[-0.35, 0, 0.1]} rotation={[0, 0, -0.5]}>
          <boxGeometry args={[0.15, 0.25, 0.1]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} />
        </mesh>
        <mesh position={[0.35, 0, 0.1]} rotation={[0, 0, 0.5]}>
          <boxGeometry args={[0.15, 0.25, 0.1]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} />
        </mesh>
        {/* Eyes on stalks */}
        <mesh position={[-0.1, 0.25, 0.1]}>
          <cylinderGeometry args={[0.03, 0.03, 0.15, 6]} />
          <meshStandardMaterial color={color} />
        </mesh>
        <mesh position={[0.1, 0.25, 0.1]}>
          <cylinderGeometry args={[0.03, 0.03, 0.15, 6]} />
          <meshStandardMaterial color={color} />
        </mesh>
        <mesh position={[-0.1, 0.35, 0.1]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <mesh position={[0.1, 0.35, 0.1]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>
    );
  }

  // Squid-like alien (type 2)
  return (
    <group ref={meshRef} position={position}>
      <mesh rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.25, 0.5, 6]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.4}
          metalness={0.4}
          roughness={0.4}
        />
      </mesh>
      {/* Big eye */}
      <mesh position={[0, -0.1, 0.2]}>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0, -0.1, 0.28]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      {/* Side fins */}
      <mesh position={[-0.25, 0.1, 0]} rotation={[0, 0, 0.8]}>
        <coneGeometry args={[0.1, 0.2, 4]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[0.25, 0.1, 0]} rotation={[0, 0, -0.8]}>
        <coneGeometry args={[0.1, 0.2, 4]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} />
      </mesh>
    </group>
  );
}
