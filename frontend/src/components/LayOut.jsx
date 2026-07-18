import React, { useState } from "react";
import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="relative flex min-h-screen flex-col [font-family:'Courier_New',monospace] text-black overflow-x-hidden md:flex-row">

      {/* Mobile Top Header Bar - Repurposed to match Sidebar theme */}
      <header className="flex h-16 items-center justify-between border-b-4 border-black bg-[#f5efe0] px-6 md:hidden relative z-40">


        <button
          onClick={() => setIsSidebarOpen(true)}
          className="border-4 border-2 border-t-white border-l-white border-b-black border-r-black bg-[#c0c0c0] px-3 py-1.5 text-xs font-black uppercase tracking-widest text-xs font-bold uppercase tracking-widest text-black active:border-t-black active:border-l-black active:border-b-white active:border-r-white"
        >
          [ MENU ]
        </button>
      </header>

      {/* Sidebar Component */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-6 md:p-8 relative z-10 ">
        {children}
      </main>
    </div>
  );
}