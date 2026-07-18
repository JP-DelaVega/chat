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

  if (!isLoaded) return null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#212121] p-6 [font-family:'Courier_New',monospace]">
      
      {/* PSU Chassis */}
      <div className="relative w-full max-w-sm border-4 border-zinc-400 bg-[#d9d5c7] p-6">
        
        {/* Hardware Screws */}
        <div className="absolute left-2 top-2 h-2 w-2 border border-black/40" />
        <div className="absolute right-2 top-2 h-2 w-2 border border-black/40" />
        <div className="absolute bottom-2 left-2 h-2 w-2 border border-black/40" />
        <div className="absolute bottom-2 right-2 h-2 w-2 border border-black/40" />

        <div className="mb-6 border-b-2 border-black/20 pb-2">
          <h1 className="text-sm font-black uppercase tracking-widest text-black">
            LOGIN USING GOOGLE ACCOUNT
          </h1>
        </div>

        <div className="mb-6 grid grid-cols-8 gap-1 border-2 border-black/10 p-2">
          {Array.from({ length: 48 }).map((_, i) => (
            <div key={i} className="h-2 w-full bg-black/10" />
          ))}
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
              w-full py-6 text-white font-black uppercase tracking-widest text-lg
              bg-red-600
              /* Create a raised bevel look with opposing border colors */
              border-t-4 border-l-4 border-red-400
              border-b-4 border-r-4 border-red-900
              
              /* Hover state: Lighter red and slightly brighter highlights */
              hover:bg-red-500 hover:border-red-300
              
              /* Active state: Invert borders to make it look 'pressed' into the case */
              active:border-t-4 active:border-l-4 active:border-red-900
              active:border-b-4 active:border-r-4 active:border-red-500
              active:translate-y-[2px]
              
              transition-all duration-100 ease-in-out
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            {isLoading ? "INITIAL..." : "SIGN IN"}
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