import { useRef, useState, useEffect, useCallback } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { PlayerShip } from "./PlayerShip";
import { Alien } from "./Alien";
import { Bullet } from "./Bullet";
import { Explosion } from "./Explosion";

interface GameSceneProps {
  onScoreChange: (points: number) => void;
  onWaveChange: (wave: number) => void;
  onLivesChange: (lives: number) => void;
  lives: number;
  playerX: number;
  setPlayerX: (x: number | ((prev: number) => number)) => void;
  isFiring: boolean;
}

interface AlienData {
  id: string;
  position: [number, number, number];
  type: number;
}

interface BulletData {
  id: string;
  position: [number, number, number];
  velocity: [number, number, number];
  isEnemy: boolean;
}

interface ExplosionData {
  id: string;
  position: [number, number, number];
  color: string;
}

export function GameScene({
  onScoreChange,
  onWaveChange,
  onLivesChange,
  lives,
  playerX,
  setPlayerX,
  isFiring,
}: GameSceneProps) {
  const [aliens, setAliens] = useState<AlienData[]>([]);
  const [bullets, setBullets] = useState<BulletData[]>([]);
  const [explosions, setExplosions] = useState<ExplosionData[]>([]);
  const [wave, setWave] = useState(1);
  const [alienDirection, setAlienDirection] = useState(1);
  const [alienMoveTimer, setAlienMoveTimer] = useState(0);

  const playerRef = useRef<THREE.Group>(null);
  const lastFireTime = useRef(0);
  const keysPressed = useRef<Set<string>>(new Set());
  const playerInvincible = useRef(false);

  // Initialize wave
  const initWave = useCallback((waveNum: number) => {
    const newAliens: AlienData[] = [];
    const rows = Math.min(3 + Math.floor(waveNum / 2), 5);
    const cols = Math.min(6 + waveNum, 10);

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        newAliens.push({
          id: `alien-${row}-${col}-${Date.now()}`,
          position: [
            (col - (cols - 1) / 2) * 1.5,
            6 - row * 1.2,
            -5 - row * 0.5,
          ],
          type: row % 3,
        });
      }
    }

    setAliens(newAliens);
    setBullets([]);
    setAlienDirection(1);
    onWaveChange(waveNum);
  }, [onWaveChange]);

  // Initialize first wave
  useEffect(() => {
    initWave(1);
  }, [initWave]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current.add(e.key.toLowerCase());
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key.toLowerCase());
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // Fire player bullet
  const firePlayerBullet = useCallback(() => {
    const now = Date.now();
    if (now - lastFireTime.current < 250) return;
    lastFireTime.current = now;

    setBullets((prev) => [
      ...prev,
      {
        id: `bullet-${now}`,
        position: [playerX, 0.5, 0],
        velocity: [0, 0, -0.4],
        isEnemy: false,
      },
    ]);
  }, [playerX]);

  // Game loop
  useFrame((state, delta) => {
    // Player movement
    const moveSpeed = 8 * delta;
    if (keysPressed.current.has("arrowleft") || keysPressed.current.has("a")) {
      setPlayerX((prev: number) => Math.max(-7, prev - moveSpeed));
    }
    if (keysPressed.current.has("arrowright") || keysPressed.current.has("d")) {
      setPlayerX((prev: number) => Math.min(7, prev + moveSpeed));
    }

    // Firing (keyboard space or touch)
    if (keysPressed.current.has(" ") || isFiring) {
      firePlayerBullet();
    }

    // Move aliens
    setAlienMoveTimer((prev) => {
      const newTimer = prev + delta;
      const moveInterval = Math.max(0.3, 1 - wave * 0.05);

      if (newTimer >= moveInterval) {
        // Check if aliens need to reverse
        let shouldReverse = false;
        let lowestAlienY = 10;

        setAliens((prevAliens) => {
          const movedAliens = prevAliens.map((alien) => {
            const newX = alien.position[0] + alienDirection * 0.3;
            if (Math.abs(newX) > 7) shouldReverse = true;
            if (alien.position[1] < lowestAlienY) lowestAlienY = alien.position[1];
            return alien;
          });

          if (shouldReverse) {
            setAlienDirection((d) => -d);
            return prevAliens.map((alien) => ({
              ...alien,
              position: [
                alien.position[0],
                alien.position[1] - 0.3,
                alien.position[2],
              ] as [number, number, number],
            }));
          }

          return prevAliens.map((alien) => ({
            ...alien,
            position: [
              alien.position[0] + alienDirection * 0.3,
              alien.position[1],
              alien.position[2],
            ] as [number, number, number],
          }));
        });

        // Random alien fire
        if (Math.random() < 0.3 + wave * 0.05) {
          setAliens((currentAliens) => {
            if (currentAliens.length > 0) {
              const randomAlien = currentAliens[Math.floor(Math.random() * currentAliens.length)];
              setBullets((prev) => [
                ...prev,
                {
                  id: `enemy-bullet-${Date.now()}-${Math.random()}`,
                  position: [...randomAlien.position] as [number, number, number],
                  velocity: [0, -0.15 - wave * 0.02, 0.1],
                  isEnemy: true,
                },
              ]);
            }
            return currentAliens;
          });
        }

        return 0;
      }
      return newTimer;
    });

    // Move bullets and check collisions
    setBullets((prev) => {
      const activeBullets: BulletData[] = [];

      for (const bullet of prev) {
        const newPos: [number, number, number] = [
          bullet.position[0] + bullet.velocity[0],
          bullet.position[1] + bullet.velocity[1],
          bullet.position[2] + bullet.velocity[2],
        ];

        // Out of bounds
        if (newPos[2] < -15 || newPos[2] > 5 || newPos[1] < -1 || newPos[1] > 10) {
          continue;
        }

        // Player bullet collision with aliens
        if (!bullet.isEnemy) {
          let hit = false;
          setAliens((currentAliens) => {
            const remaining = currentAliens.filter((alien) => {
              const dx = Math.abs(newPos[0] - alien.position[0]);
              const dy = Math.abs(newPos[1] - alien.position[1]);
              const dz = Math.abs(newPos[2] - alien.position[2]);

              if (dx < 0.6 && dy < 0.6 && dz < 0.6) {
                hit = true;
                // Create explosion
                setExplosions((e) => [
                  ...e,
                  {
                    id: `exp-${Date.now()}-${Math.random()}`,
                    position: [...alien.position] as [number, number, number],
                    color: alien.type === 0 ? "#ff00ff" : alien.type === 1 ? "#00ffff" : "#ffff00",
                  },
                ]);
                // Score based on alien type
                const points = (3 - alien.type) * 50 * wave;
                onScoreChange(points);
                return false;
              }
              return true;
            });
            return remaining;
          });

          if (hit) continue;
        }

        // Enemy bullet collision with player
        if (bullet.isEnemy && !playerInvincible.current) {
          const dx = Math.abs(newPos[0] - playerX);
          const dy = Math.abs(newPos[1] - 0);
          const dz = Math.abs(newPos[2] - 0);

          if (dx < 0.8 && dy < 0.8 && dz < 0.8) {
            playerInvincible.current = true;
            onLivesChange(lives - 1);
            setExplosions((e) => [
              ...e,
              {
                id: `exp-player-${Date.now()}`,
                position: [playerX, 0, 0],
                color: "#00ffff",
              },
            ]);
            setTimeout(() => {
              playerInvincible.current = false;
            }, 2000);
            continue;
          }
        }

        activeBullets.push({
          ...bullet,
          position: newPos,
        });
      }

      return activeBullets;
    });

    // Check for wave completion
    if (aliens.length === 0) {
      const newWave = wave + 1;
      setWave(newWave);
      initWave(newWave);
    }

    // Check for game over (aliens too low)
    const lowestAlien = aliens.reduce(
      (lowest, alien) => (alien.position[1] < lowest ? alien.position[1] : lowest),
      10
    );
    if (lowestAlien < 1 && aliens.length > 0) {
      onLivesChange(0);
    }

    // Clean up explosions
    setExplosions((prev) => prev.filter((_, i) => i >= prev.length - 10));
  });

  return (
    <group>
      {/* Player */}
      <PlayerShip
        ref={playerRef}
        position={[playerX, 0, 0]}
        isInvincible={playerInvincible.current}
      />

      {/* Aliens */}
      {aliens.map((alien) => (
        <Alien
          key={alien.id}
          position={alien.position}
          type={alien.type}
        />
      ))}

      {/* Bullets */}
      {bullets.map((bullet) => (
        <Bullet
          key={bullet.id}
          position={bullet.position}
          isEnemy={bullet.isEnemy}
        />
      ))}

      {/* Explosions */}
      {explosions.map((explosion) => (
        <Explosion
          key={explosion.id}
          position={explosion.position}
          color={explosion.color}
        />
      ))}

      {/* Ground grid */}
      <gridHelper args={[30, 30, "#00ffff", "#001a1a"]} position={[0, -0.5, -5]} />

      {/* Boundary markers */}
      <mesh position={[-8, 0, -5]}>
        <boxGeometry args={[0.1, 2, 15]} />
        <meshBasicMaterial color="#ff00ff" transparent opacity={0.3} />
      </mesh>
      <mesh position={[8, 0, -5]}>
        <boxGeometry args={[0.1, 2, 15]} />
        <meshBasicMaterial color="#ff00ff" transparent opacity={0.3} />
      </mesh>
    </group>
  );
}
