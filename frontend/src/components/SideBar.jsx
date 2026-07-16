import React from "react";
import { SignOutButton, useUser } from "@clerk/clerk-react";

export default function Sidebar({ isOpen, onClose }) {
  const { user } = useUser();

  const menuItems = [
    { label: "ABOUT ME", icon: "👨‍💻", active: true },
    { label: "LEAUGE LORE", icon: "👾", active: false },
    { label: "UPGRADES", icon: "⚡", active: false },
    { label: "MY RESUME", icon: "📄", active: false },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay - closes the sidebar if you tap outside */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-xs transition-opacity duration-300 md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r-4 border-double border-cyan-500 bg-black p-6 font-mono text-white select-none transition-transform duration-300 ease-in-out md:static md:translate-x-0 
          ${isOpen ? "translate-x-0 shadow-[0_0_40px_rgba(34,211,238,0.25)]" : "-translate-x-full"}`}
      >


        {/* Logo */}
        <div className="mb-8 border-b-2 border-dashed border-zinc-800 pb-6 text-center">
          <h2 className="animate-pulse text-2xl font-black tracking-wider text-pink-500 drop-shadow-[0_0_8px_rgba(236,72,153,0.6)]">
            ARCADE OS
          </h2>
          <span className="text-[10px] uppercase tracking-widest text-cyan-400">
            SYS_READY_V1.0
          </span>
        </div>

        {/* Clerk User Status Card */}
        {user && (
          <div className="mb-8 flex items-center gap-3 rounded border border-zinc-800 bg-zinc-950 p-3">
            <img
              src={user.imageUrl}
              alt="Player Avatar"
              className="h-10 w-10 rounded border border-cyan-400 object-cover"
            />
            <div className="overflow-hidden">
              <p className="text-2xs uppercase tracking-wider text-zinc-500">PLAYER 1</p>
              <p className="truncate text-xs font-bold text-cyan-400">
                {user.firstName || user.username || "PLAYER"}
              </p>
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <nav className="flex-1 space-y-3">
          {menuItems.map((item, idx) => (
            <button
              key={idx}
              onClick={onClose} // Auto-closes sidebar drawer on mobile navigation
              className={`group flex w-full items-center gap-3 rounded px-3 py-2 text-left text-sm uppercase tracking-wider transition-all duration-150 
                ${item.active
                  ? "bg-cyan-950 text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.2)] border border-cyan-500"
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                }`}
            >
              <span className="opacity-0 transition-opacity group-hover:opacity-100 text-pink-500">
                ▶
              </span>
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Sign Out Button */}
        <div className="mt-auto border-t border-zinc-800 pt-6">
          <SignOutButton>
            <button className="group relative w-full transform rounded border-b-4 border-pink-800 bg-pink-600 py-3 text-xs font-bold uppercase tracking-widest text-white transition-all active:translate-y-1 active:border-b-0 hover:bg-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.3)]">
              [ QUIT GAME ]
            </button>
          </SignOutButton>
        </div>
      </aside>
    </>
  );
}