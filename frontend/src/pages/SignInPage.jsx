import React, { useState } from "react";
import { useSignIn } from "@clerk/clerk-react";

export default function ArcadeSignIn() {
  const { isLoaded, signIn } = useSignIn();
  const [isLoading, setIsLoading] = useState(false);

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black font-mono text-cyan-400">
        <span className="animate-pulse">LOADING SYSTEM...</span>
      </div>
    );
  }

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback", 
        redirectUrlComplete: "/",      
      });
    } catch (err) {
      console.error("Arcade Error:", err);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 p-4 font-mono text-white select-none selection:bg-pink-500 selection:text-black">
      {/* Scanline overlay for that retro CRT monitor feel */}
      <div className="pointer-events-none fixed inset-0 z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px]" />

      <div className="relative w-full max-w-md rounded-2xl border-4 border-double border-cyan-400 bg-black p-8 text-center shadow-[0_0_30px_rgba(34,211,238,0.3)] md:p-12">
        {/* Neon Cabinet Header */}
        <header className="mb-8">
          <h1 className="animate-pulse text-4xl font-extrabold tracking-widest text-pink-500 drop-shadow-[0_0_10px_rgba(236,72,153,0.8)]">
            CLERK ARCADE
          </h1>
          <p className="mt-2 text-xs uppercase tracking-widest text-cyan-400">
            Insert authentication to continue
          </p>
        </header>

        {/* Screen Bezel Decorative Accents */}
        <div className="my-6 flex items-center justify-between px-4 text-zinc-600">
          <span>[ HIGH SCORE: 999990 ]</span>
          <span className="animate-bounce">▼</span>
        </div>

        {/* Arcade Button / Google Login */}
        <div className="space-y-6">
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="group relative w-full transform rounded-lg border-b-8 border-pink-800 bg-pink-600 px-6 py-5 text-lg font-bold uppercase tracking-widest text-white transition-all active:translate-y-1 active:border-b-2 hover:bg-pink-500 active:shadow-none shadow-[0_0_20px_rgba(236,72,153,0.5)] disabled:opacity-50"
          >
            {isLoading ? (
              <span className="animate-ping">CONNECTING...</span>
            ) : (
              <div className="flex items-center justify-center gap-3">
                {/* Custom Retro Google "G" Icon */}
                <svg
                  className="h-6 w-6 fill-current transition-transform group-hover:scale-110"
                  viewBox="0 0 24 24"
                >
                  <path d="M12.24 10.285V13.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l2.427-2.334C18.155 1.485 15.42 0 12.24 0 5.58 0 0 5.37 0 12s5.58 12 12.24 12c6.96 0 11.57-4.89 11.57-11.79 0-.795-.085-1.4-.195-1.925H12.24z" />
                </svg>
                <span>PRESS START</span>
              </div>
            )}
          </button>

          <p className="animate-pulse text-xs uppercase tracking-widest text-yellow-400">
            ★ 1 CREDIT = 1 GOOGLE ACCOUNT ★
          </p>
        </div>

        {/* Footer Cabinet Details */}
        <footer className="mt-10 border-t border-zinc-800 pt-6 text-2xs text-zinc-500 uppercase tracking-wider">
          <div className="flex justify-between">
            <span>PLAYER 1 READY</span>
            <span>© 198X CLERK CO.</span>
          </div>
        </footer>
      </div>
    </div>
  );
}