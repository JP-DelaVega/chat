import React, { useState } from "react";
import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="relative flex min-h-screen flex-col bg-zinc-950 font-mono text-white overflow-x-hidden md:flex-row">
      {/* Scanline CRT overlay effect */}
      <div className="pointer-events-none fixed inset-0 z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.15)_50%)] bg-[length:100%_4px]" />

      {/* Mobile Top Header Bar - Hidden on Desktop */}
      <header className="flex h-16 items-center justify-between border-b-4 border-double border-cyan-500 bg-black px-6 md:hidden relative z-40">
        <span className="animate-pulse text-lg font-black tracking-wider text-pink-500 drop-shadow-[0_0_8px_rgba(236,72,153,0.6)]">
          ARCADE OS
        </span>
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="rounded border border-cyan-500 bg-cyan-950/30 px-3 py-1 text-xs font-bold uppercase tracking-wider text-cyan-400 hover:bg-cyan-950/60 active:translate-y-0.5"
        >
          [ MENU ]
        </button>
      </header>

      {/* Sidebar Component (Handles its own mobile drawers/backdrops) */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-6 md:p-8 relative z-10">
        {children}
      </main>
    </div>
  );
}