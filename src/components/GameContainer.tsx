import { useState, useCallback } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { SpaceGame } from "./SpaceGame";

type GameState = "menu" | "playing" | "gameOver";

interface GameResult {
  score: number;
  wave: number;
  aliensDestroyed: number;
}

export function GameContainer() {
  const [gameState, setGameState] = useState<GameState>("menu");
  const [gameResult, setGameResult] = useState<GameResult | null>(null);
  const [playerName, setPlayerName] = useState("PILOT");

  const submitScore = useMutation(api.scores.submitScore);
  const profile = useQuery(api.scores.getProfile);

  const handleStartGame = useCallback(() => {
    setGameState("playing");
    setGameResult(null);
  }, []);

  const handleGameOver = useCallback(async (result: GameResult) => {
    setGameResult(result);
    setGameState("gameOver");

    try {
      await submitScore({
        score: result.score,
        wave: result.wave,
        playerName: profile?.displayName || playerName,
        aliensDestroyed: result.aliensDestroyed,
      });
    } catch (error) {
      console.error("Failed to submit score:", error);
    }
  }, [submitScore, profile, playerName]);

  if (gameState === "menu") {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-6">
        <div className="max-w-md w-full space-y-6 md:space-y-8 text-center">
          {/* Game title animation */}
          <div className="space-y-2">
            <div className="font-display text-4xl md:text-6xl tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-yellow-400 animate-text-shimmer">
              READY
            </div>
            <div className="font-display text-4xl md:text-6xl tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-fuchsia-400 to-cyan-400 animate-text-shimmer">
              PILOT?
            </div>
          </div>

          {/* Name input */}
          <div className="space-y-3">
            <label className="block font-mono text-xs text-fuchsia-400/70 tracking-wider">
              ENTER CALLSIGN
            </label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value.toUpperCase().slice(0, 12))}
              className="w-full px-3 md:px-4 py-2.5 md:py-3 bg-black/50 border border-cyan-500/30 rounded text-cyan-100 font-mono text-base md:text-lg text-center tracking-widest focus:outline-none focus:border-cyan-400 focus:shadow-glow-cyan transition-all"
              placeholder="PILOT"
            />
          </div>

          {/* Instructions */}
          <div className="space-y-2 text-cyan-500/70 font-mono text-xs md:text-sm">
            <p>ARROW KEYS / WASD / DRAG TO MOVE</p>
            <p>SPACE / TAP TO FIRE</p>
            <p>DESTROY ALL INVADERS!</p>
          </div>

          {/* Start button */}
          <button
            onClick={handleStartGame}
            className="w-full py-3 md:py-4 font-display text-xl md:text-2xl tracking-widest bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white rounded-lg hover:from-cyan-400 hover:to-fuchsia-400 transition-all shadow-glow-mixed transform hover:scale-105"
          >
            LAUNCH MISSION
          </button>

          {/* Profile stats */}
          {profile && (
            <div className="pt-4 md:pt-6 border-t border-cyan-500/20 grid grid-cols-3 gap-3 md:gap-4">
              <div>
                <div className="font-mono text-[10px] md:text-xs text-cyan-500/50">MISSIONS</div>
                <div className="font-display text-lg md:text-2xl text-cyan-400">{profile.totalGamesPlayed}</div>
              </div>
              <div>
                <div className="font-mono text-[10px] md:text-xs text-fuchsia-500/50">HIGH SCORE</div>
                <div className="font-display text-lg md:text-2xl text-fuchsia-400">{profile.highestScore.toLocaleString()}</div>
              </div>
              <div>
                <div className="font-mono text-[10px] md:text-xs text-yellow-500/50">BEST WAVE</div>
                <div className="font-display text-lg md:text-2xl text-yellow-400">{profile.highestWave}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (gameState === "gameOver" && gameResult) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-6">
        <div className="max-w-md w-full space-y-6 md:space-y-8 text-center">
          <div className="space-y-2">
            <div className="font-display text-3xl md:text-5xl tracking-widest text-red-500 animate-pulse">
              MISSION
            </div>
            <div className="font-display text-3xl md:text-5xl tracking-widest text-red-400 animate-pulse">
              FAILED
            </div>
          </div>

          {/* Results */}
          <div className="border border-cyan-500/30 rounded-lg bg-black/40 backdrop-blur-sm p-4 md:p-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-mono text-sm md:text-base text-cyan-500/70">FINAL SCORE</span>
              <span className="font-display text-2xl md:text-4xl text-fuchsia-400">{gameResult.score.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-mono text-sm md:text-base text-cyan-500/70">WAVE REACHED</span>
              <span className="font-display text-xl md:text-2xl text-yellow-400">{gameResult.wave}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-mono text-sm md:text-base text-cyan-500/70">ALIENS DESTROYED</span>
              <span className="font-display text-xl md:text-2xl text-green-400">{gameResult.aliensDestroyed}</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleStartGame}
              className="w-full py-3 md:py-4 font-display text-lg md:text-xl tracking-widest bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white rounded-lg hover:from-cyan-400 hover:to-fuchsia-400 transition-all shadow-glow-mixed transform hover:scale-105"
            >
              TRY AGAIN
            </button>
            <button
              onClick={() => setGameState("menu")}
              className="w-full py-2.5 md:py-3 font-mono text-sm tracking-wider border border-cyan-500/50 text-cyan-400 rounded-lg hover:bg-cyan-500/10 transition-all"
            >
              RETURN TO BASE
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 relative">
      <SpaceGame onGameOver={handleGameOver} playerName={playerName} />
    </div>
  );
}
