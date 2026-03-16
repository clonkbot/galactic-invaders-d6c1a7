import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

interface ScoreData {
  _id: string;
  playerName: string;
  score: number;
  wave: number;
  createdAt: number;
}

export function Leaderboard() {
  const topScores = useQuery(api.scores.getTopScores);
  const userScores = useQuery(api.scores.getUserScores);
  const profile = useQuery(api.scores.getProfile);
  const activePlayers = useQuery(api.scores.getActivePlayers);

  return (
    <div className="flex-1 p-3 md:p-6 overflow-auto">
      <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
        {/* Stats bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
          <StatCard
            label="ONLINE"
            value={activePlayers ?? 0}
            color="cyan"
          />
          <StatCard
            label="GAMES"
            value={profile?.totalGamesPlayed ?? 0}
            color="fuchsia"
          />
          <StatCard
            label="BEST SCORE"
            value={profile?.highestScore ?? 0}
            color="yellow"
          />
          <StatCard
            label="ALIENS"
            value={profile?.totalAliensDestroyed ?? 0}
            color="green"
          />
        </div>

        {/* Global leaderboard */}
        <div className="border border-cyan-500/30 rounded-lg bg-black/40 backdrop-blur-sm overflow-hidden">
          <div className="px-4 md:px-6 py-3 md:py-4 border-b border-cyan-500/30 flex items-center gap-2 md:gap-3">
            <div className="w-2 h-2 md:w-3 md:h-3 bg-cyan-400 rounded-full animate-pulse" />
            <h2 className="font-display text-lg md:text-xl tracking-wider text-cyan-400">GALACTIC HALL OF FAME</h2>
          </div>

          <div className="p-3 md:p-4">
            {topScores === undefined ? (
              <div className="text-center py-6 md:py-8">
                <div className="w-6 h-6 md:w-8 md:h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto" />
              </div>
            ) : topScores.length === 0 ? (
              <div className="text-center py-6 md:py-8 text-cyan-500/50 font-mono text-sm">
                NO SCORES YET - BE THE FIRST!
              </div>
            ) : (
              <div className="space-y-2">
                {topScores.map((score: ScoreData, index: number) => (
                  <div
                    key={score._id}
                    className={`flex items-center gap-3 md:gap-4 p-2 md:p-3 rounded ${
                      index === 0
                        ? "bg-gradient-to-r from-yellow-500/20 to-transparent border border-yellow-500/30"
                        : index === 1
                        ? "bg-gradient-to-r from-gray-400/20 to-transparent border border-gray-400/30"
                        : index === 2
                        ? "bg-gradient-to-r from-amber-600/20 to-transparent border border-amber-600/30"
                        : "bg-white/5 border border-white/10"
                    }`}
                  >
                    <div
                      className={`w-7 h-7 md:w-10 md:h-10 rounded-full flex items-center justify-center font-display text-base md:text-xl ${
                        index === 0
                          ? "bg-yellow-500/30 text-yellow-400"
                          : index === 1
                          ? "bg-gray-400/30 text-gray-300"
                          : index === 2
                          ? "bg-amber-600/30 text-amber-400"
                          : "bg-cyan-500/20 text-cyan-400"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-mono text-sm md:text-base text-white truncate">{score.playerName}</div>
                      <div className="font-mono text-[10px] md:text-xs text-cyan-500/50">WAVE {score.wave}</div>
                    </div>
                    <div className="font-display text-lg md:text-2xl text-fuchsia-400">{score.score.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Personal scores */}
        <div className="border border-fuchsia-500/30 rounded-lg bg-black/40 backdrop-blur-sm overflow-hidden">
          <div className="px-4 md:px-6 py-3 md:py-4 border-b border-fuchsia-500/30 flex items-center gap-2 md:gap-3">
            <div className="w-2 h-2 md:w-3 md:h-3 bg-fuchsia-400 rounded-full animate-pulse" />
            <h2 className="font-display text-lg md:text-xl tracking-wider text-fuchsia-400">YOUR MISSIONS</h2>
          </div>

          <div className="p-3 md:p-4">
            {userScores === undefined ? (
              <div className="text-center py-6 md:py-8">
                <div className="w-6 h-6 md:w-8 md:h-8 border-2 border-fuchsia-500 border-t-transparent rounded-full animate-spin mx-auto" />
              </div>
            ) : userScores.length === 0 ? (
              <div className="text-center py-6 md:py-8 text-fuchsia-500/50 font-mono text-sm">
                NO MISSIONS COMPLETED - START PLAYING!
              </div>
            ) : (
              <div className="space-y-2">
                {userScores.map((score: ScoreData) => (
                  <div
                    key={score._id}
                    className="flex items-center gap-3 md:gap-4 p-2 md:p-3 rounded bg-white/5 border border-white/10"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-mono text-sm md:text-base text-white truncate">{score.playerName}</div>
                      <div className="font-mono text-[10px] md:text-xs text-fuchsia-500/50">
                        {new Date(score.createdAt).toLocaleDateString()} - WAVE {score.wave}
                      </div>
                    </div>
                    <div className="font-display text-lg md:text-xl text-cyan-400">{score.score.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  const colorClasses = {
    cyan: "border-cyan-500/30 text-cyan-400",
    fuchsia: "border-fuchsia-500/30 text-fuchsia-400",
    yellow: "border-yellow-500/30 text-yellow-400",
    green: "border-green-500/30 text-green-400",
  };

  return (
    <div className={`border ${colorClasses[color as keyof typeof colorClasses]} rounded-lg bg-black/40 backdrop-blur-sm p-3 md:p-4 text-center`}>
      <div className="font-mono text-[10px] md:text-xs text-white/50 mb-1">{label}</div>
      <div className={`font-display text-xl md:text-3xl ${colorClasses[color as keyof typeof colorClasses]}`}>
        {value.toLocaleString()}
      </div>
    </div>
  );
}
