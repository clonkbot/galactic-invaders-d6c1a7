import { Canvas } from "@react-three/fiber";
import { Suspense, useState, useRef, useCallback, useEffect } from "react";
import { Stars, OrbitControls } from "@react-three/drei";
import { GameScene } from "./GameScene";

interface SpaceGameProps {
  onGameOver: (result: { score: number; wave: number; aliensDestroyed: number }) => void;
  playerName: string;
}

export function SpaceGame({ onGameOver, playerName }: SpaceGameProps) {
  const [score, setScore] = useState(0);
  const [wave, setWave] = useState(1);
  const [lives, setLives] = useState(3);
  const [aliensDestroyed, setAliensDestroyed] = useState(0);
  const gameEndedRef = useRef(false);

  // Touch/drag controls state
  const [playerX, setPlayerX] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastTouchXRef = useRef<number | null>(null);
  const [isFiring, setIsFiring] = useState(false);

  const handleScoreChange = useCallback((points: number) => {
    setScore((prev) => prev + points);
    setAliensDestroyed((prev) => prev + 1);
  }, []);

  const handleWaveChange = useCallback((newWave: number) => {
    setWave(newWave);
  }, []);

  const handleLivesChange = useCallback((newLives: number) => {
    setLives(newLives);
    if (newLives <= 0 && !gameEndedRef.current) {
      gameEndedRef.current = true;
      // Delay to show explosion
      setTimeout(() => {
        onGameOver({ score, wave, aliensDestroyed });
      }, 1000);
    }
  }, [onGameOver, score, wave, aliensDestroyed]);

  // Touch handlers for mobile
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      lastTouchXRef.current = e.touches[0].clientX;
      setIsFiring(true);
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1 && lastTouchXRef.current !== null && containerRef.current) {
      const touch = e.touches[0];
      const deltaX = touch.clientX - lastTouchXRef.current;
      lastTouchXRef.current = touch.clientX;

      // Convert pixel movement to game units (scale factor)
      const moveScale = 0.02;
      setPlayerX((prev) => Math.max(-7, Math.min(7, prev + deltaX * moveScale)));
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    lastTouchXRef.current = null;
    setIsFiring(false);
  }, []);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === " " || e.code === "Space") {
        setIsFiring(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === " " || e.code === "Space") {
        setIsFiring(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 bg-black"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* HUD */}
      <div className="absolute top-0 left-0 right-0 z-10 p-2 md:p-4 flex justify-between items-start pointer-events-none">
        <div className="space-y-1">
          <div className="font-mono text-[10px] md:text-xs text-cyan-500/70">PILOT: {playerName}</div>
          <div className="font-display text-lg md:text-2xl text-cyan-400">SCORE: {score.toLocaleString()}</div>
        </div>

        <div className="text-right space-y-1">
          <div className="font-mono text-[10px] md:text-xs text-fuchsia-500/70">WAVE</div>
          <div className="font-display text-lg md:text-2xl text-fuchsia-400">{wave}</div>
        </div>
      </div>

      {/* Lives */}
      <div className="absolute bottom-2 md:bottom-4 left-2 md:left-4 z-10 flex gap-1 md:gap-2 pointer-events-none">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className={`w-5 h-5 md:w-8 md:h-8 ${
              i < lives ? "text-cyan-400" : "text-cyan-900"
            } transition-colors`}
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
          </div>
        ))}
      </div>

      {/* Mobile fire button indicator */}
      <div className="absolute bottom-2 md:bottom-4 right-2 md:right-4 z-10 md:hidden pointer-events-none">
        <div className="font-mono text-[10px] text-cyan-500/50 text-center">
          TAP & DRAG<br/>TO CONTROL
        </div>
      </div>

      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 8, 12], fov: 60 }}
        gl={{ antialias: true, alpha: false }}
      >
        <Suspense fallback={null}>
          <color attach="background" args={["#000008"]} />
          <fog attach="fog" args={["#000008", 15, 40]} />

          <ambientLight intensity={0.3} />
          <pointLight position={[0, 10, 10]} intensity={1} color="#00ffff" />
          <pointLight position={[-10, 5, -10]} intensity={0.5} color="#ff00ff" />

          <Stars radius={100} depth={50} count={3000} factor={4} fade speed={1} />

          <GameScene
            onScoreChange={handleScoreChange}
            onWaveChange={handleWaveChange}
            onLivesChange={handleLivesChange}
            lives={lives}
            playerX={playerX}
            setPlayerX={setPlayerX}
            isFiring={isFiring}
          />

          <OrbitControls enabled={false} />
        </Suspense>
      </Canvas>
    </div>
  );
}
