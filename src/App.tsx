import { useConvexAuth } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import { GameContainer } from "./components/GameContainer";
import { Leaderboard } from "./components/Leaderboard";
import { AuthScreen } from "./components/AuthScreen";

function App() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { signOut } = useAuthActions();
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="relative">
          <div className="w-20 h-20 md:w-24 md:h-24 border-4 border-cyan-500/30 rounded-full animate-spin border-t-cyan-400" />
          <div className="absolute inset-0 w-20 h-20 md:w-24 md:h-24 border-4 border-fuchsia-500/20 rounded-full animate-spin animate-reverse border-b-fuchsia-400" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative flex flex-col">
      {/* Scanline effect */}
      <div className="fixed inset-0 pointer-events-none z-50 bg-scanlines opacity-10" />

      {/* CRT glow effect */}
      <div className="fixed inset-0 pointer-events-none z-40 bg-gradient-radial from-transparent via-transparent to-black/50" />

      {/* Animated background grid */}
      <div className="fixed inset-0 bg-grid-pattern opacity-20 animate-grid-scroll" />

      {/* Nebula effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[600px] h-[600px] md:w-[800px] md:h-[800px] -top-40 -left-40 bg-purple-900/30 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute w-[500px] h-[500px] md:w-[700px] md:h-[700px] -bottom-40 -right-40 bg-cyan-900/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>

      {/* Header */}
      <header className="relative z-30 px-3 py-3 md:px-6 md:py-4 flex items-center justify-between border-b border-cyan-500/30 bg-black/50 backdrop-blur-sm shrink-0">
        <div className="flex items-center gap-2 md:gap-4">
          <div className="flex items-center gap-1 md:gap-2">
            <div className="w-2 h-2 md:w-3 md:h-3 bg-cyan-400 rounded-full animate-pulse shadow-glow-cyan" />
            <div className="w-2 h-2 md:w-3 md:h-3 bg-fuchsia-400 rounded-full animate-pulse shadow-glow-fuchsia" style={{ animationDelay: '0.5s' }} />
            <div className="w-2 h-2 md:w-3 md:h-3 bg-yellow-400 rounded-full animate-pulse shadow-glow-yellow" style={{ animationDelay: '1s' }} />
          </div>
          <h1 className="font-display text-xl md:text-3xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-yellow-400 animate-text-shimmer">
            GALACTIC INVADERS
          </h1>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <button
            onClick={() => setShowLeaderboard(!showLeaderboard)}
            className="px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-mono text-cyan-400 border border-cyan-500/50 rounded hover:bg-cyan-500/20 transition-all hover:shadow-glow-cyan"
          >
            {showLeaderboard ? 'PLAY' : 'SCORES'}
          </button>
          <button
            onClick={() => signOut()}
            className="px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-mono text-fuchsia-400 border border-fuchsia-500/50 rounded hover:bg-fuchsia-500/20 transition-all hover:shadow-glow-fuchsia"
          >
            EXIT
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-20 flex-1 flex flex-col min-h-0">
        {showLeaderboard ? <Leaderboard /> : <GameContainer />}
      </main>

      {/* Footer */}
      <footer className="relative z-30 px-3 py-2 md:px-6 md:py-3 border-t border-cyan-500/20 bg-black/50 backdrop-blur-sm shrink-0">
        <p className="text-center text-[10px] md:text-xs text-cyan-500/40 font-mono tracking-wide">
          Requested by @web-user · Built by @clonkbot
        </p>
      </footer>
    </div>
  );
}

export default App;
