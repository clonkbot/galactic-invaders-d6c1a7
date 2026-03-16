import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";

export function AuthScreen() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    try {
      await signIn("password", formData);
    } catch {
      setError(flow === "signIn" ? "Invalid credentials" : "Could not create account");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center relative overflow-hidden px-4">
      {/* Background effects */}
      <div className="fixed inset-0 bg-scanlines opacity-10 pointer-events-none" />
      <div className="fixed inset-0 bg-grid-pattern opacity-20 animate-grid-scroll" />

      <div className="absolute w-[500px] h-[500px] md:w-[800px] md:h-[800px] -top-40 -left-40 bg-purple-900/30 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute w-[400px] h-[400px] md:w-[600px] md:h-[600px] -bottom-40 -right-40 bg-cyan-900/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />

      {/* Title */}
      <div className="relative z-10 mb-6 md:mb-8 text-center">
        <h1 className="font-display text-4xl md:text-6xl tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-yellow-400 animate-text-shimmer mb-2">
          GALACTIC
        </h1>
        <h1 className="font-display text-4xl md:text-6xl tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-fuchsia-400 to-cyan-400 animate-text-shimmer">
          INVADERS
        </h1>
        <div className="mt-3 md:mt-4 flex items-center justify-center gap-3 md:gap-4">
          <div className="h-px w-12 md:w-20 bg-gradient-to-r from-transparent to-cyan-400" />
          <span className="font-mono text-xs md:text-sm text-fuchsia-400 tracking-widest">3D ARCADE</span>
          <div className="h-px w-12 md:w-20 bg-gradient-to-l from-transparent to-cyan-400" />
        </div>
      </div>

      {/* Auth form */}
      <div className="relative z-10 w-full max-w-sm">
        <div className="border border-cyan-500/30 rounded-lg bg-black/60 backdrop-blur-md p-6 md:p-8 shadow-glow-cyan-soft">
          <div className="flex items-center justify-center gap-2 mb-5 md:mb-6">
            <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-cyan-400 rounded-full animate-pulse" />
            <h2 className="font-mono text-base md:text-lg tracking-wider text-cyan-400">
              {flow === "signIn" ? "PILOT LOGIN" : "REGISTER PILOT"}
            </h2>
            <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-cyan-400 rounded-full animate-pulse" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
            <div>
              <label className="block font-mono text-xs text-fuchsia-400/70 mb-1.5 md:mb-2 tracking-wider">
                CALLSIGN (EMAIL)
              </label>
              <input
                name="email"
                type="email"
                required
                className="w-full px-3 md:px-4 py-2.5 md:py-3 bg-black/50 border border-cyan-500/30 rounded text-cyan-100 font-mono text-sm focus:outline-none focus:border-cyan-400 focus:shadow-glow-cyan transition-all placeholder:text-cyan-800"
                placeholder="pilot@galaxy.net"
              />
            </div>

            <div>
              <label className="block font-mono text-xs text-fuchsia-400/70 mb-1.5 md:mb-2 tracking-wider">
                ACCESS CODE
              </label>
              <input
                name="password"
                type="password"
                required
                className="w-full px-3 md:px-4 py-2.5 md:py-3 bg-black/50 border border-cyan-500/30 rounded text-cyan-100 font-mono text-sm focus:outline-none focus:border-cyan-400 focus:shadow-glow-cyan transition-all placeholder:text-cyan-800"
                placeholder="••••••••"
              />
            </div>

            <input name="flow" type="hidden" value={flow} />

            {error && (
              <div className="text-red-400 text-xs md:text-sm font-mono text-center py-2 border border-red-500/30 rounded bg-red-500/10">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 md:py-3 font-mono text-sm tracking-wider bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white rounded hover:from-cyan-400 hover:to-fuchsia-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-glow-mixed"
            >
              {isLoading ? "CONNECTING..." : flow === "signIn" ? "LAUNCH" : "ENLIST"}
            </button>
          </form>

          <div className="mt-4 md:mt-6 flex items-center justify-center">
            <button
              onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
              className="font-mono text-xs text-cyan-400/70 hover:text-cyan-400 transition-colors"
            >
              {flow === "signIn" ? "NEW PILOT? REGISTER HERE" : "EXISTING PILOT? LOGIN"}
            </button>
          </div>

          <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-cyan-500/20">
            <button
              onClick={() => signIn("anonymous")}
              className="w-full py-2.5 md:py-3 font-mono text-xs md:text-sm tracking-wider border border-yellow-500/50 text-yellow-400 rounded hover:bg-yellow-500/10 transition-all"
            >
              GUEST MODE (ANONYMOUS)
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 px-4 py-2 md:py-3">
        <p className="text-center text-[10px] md:text-xs text-cyan-500/40 font-mono tracking-wide">
          Requested by @web-user · Built by @clonkbot
        </p>
      </footer>
    </div>
  );
}
