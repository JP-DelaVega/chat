import React, { useState } from "react";
import { useSignIn } from "@clerk/clerk-react";

export default function RetroPowerSupplySignIn() {
  const { isLoaded, signIn } = useSignIn();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/",
      });
    } catch (err) {
      console.error("Auth Error:", err);
      setIsLoading(false);
    }
  };

  function Screw({ className = "" }) {
    return (
      <div className={`absolute h-2.5 w-2.5 rounded-full bg-black/15 shadow-[inset_1px_1px_1px_rgba(0,0,0,0.4)] ${className}`}>
        <div className="absolute left-1/2 top-1/2 h-px w-1.5 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-black/40" />
      </div>
    );
  }

  if (!isLoaded) return null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#212121] p-6 font-['Courier_New',monospace]">

      {/* PSU Chassis */}
      <div className="relative w-full max-w-sm border-4 border-zinc-400 bg-[#d9d5c7] p-6">

        {/* Hardware Screws */}
        <Screw className="left-3 top-3" />
        <Screw className="right-3 top-3" />
        <Screw className="bottom-3 left-3" />
        <Screw className="bottom-3 right-3" />

        <div className="mb-5 border-b-2 border-black/15 pb-1.5">
          <h1 className="text-xs font-black uppercase tracking-[0.25em] text-black/60">
            LOGIN TO RAG SYSTEM
          </h1>
        </div>

        <div className="mb-5 border-2 border-black/15 bg-[#c8c4b6] p-2 shadow-[inset_1px_1px_4px_rgba(0,0,0,0.15)]">
          <div className="grid grid-cols-8 gap-0.75">
            {Array.from({ length: 48 }).map((_, i) => (
              <div
                key={i}
                className={`h-2 w-full rounded-[1px] transition-all duration-300 ${isLoading && i % 3 === 0 ? "bg-[#5ebf72]/60 shadow-[0_0_4px_rgba(94,191,114,0.4)]" : "bg-black/10"}`}
              />
            ))}
          </div>
        </div>

        <div className="mb-8 border border-black/20 p-3 text-[10px] font-bold uppercase tracking-widest text-black/60">
          <div className="flex justify-between py-0.5"><span>STATUS</span> <span>{isLoading ? "ENGAGING..." : "STANDBY"}</span></div>
          <div className="flex justify-between py-0.5"><span>INPUT</span> <span>115-230V</span></div>
        </div>

        {/* Retro Red Button (Enhanced) */}
        <div className="flex flex-col items-center">
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className={`
              group relative w-full py-5 text-white font-black uppercase tracking-[0.2em] text-base
              bg-[#c44]
              border-t-[3px] border-l-[3px] border-[#e07070]
              border-b-[3px] border-r-[3px]
              shadow-[0_4px_0_#5c1616,0_6px_12px_rgba(0,0,0,0.3)]
              hover:bg-[#d95555]
              hover:shadow-[0_4px_0_#5c1616,0_6px_16px_rgba(196,68,68,0.3)]
              active:translate-y-1
              active:shadow-[0_0_0_#5c1616,0_2px_4px_rgba(0,0,0,0.3)]
              active:border-t-[3px] active:border-l-[3px] active:border-[#8b2222]
              active:border-b-[3px] active:border-r-[3px]
              transition-all duration-100 ease-out
              disabled:opacity-50 disabled:cursor-not-allowed disabled:active:translate-y-0 disabled:active:shadow-[0_4px_0_#5c1616,0_6px_12px_rgba(0,0,0,0.3)]
            `}
          >
            {isLoading ? "INITIAL..." : "SIGN IN WITH GOOGLE"}
          </button>

          <div className="mt-4 text-[10px] font-bold uppercase text-black/50 tracking-widest">
            {isLoading ? "SYSTEM CONNECTING..." : "PRESS RED BUTTON"}
          </div>
        </div>

        <div className="mt-8 text-center text-[8px] font-bold uppercase tracking-widest text-black/30">
          Manufacturing Date: 2026
        </div>
      </div>
    </div>
  );
}