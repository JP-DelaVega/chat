import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useClerk } from "@clerk/clerk-react";

export default function MainMenu() {
  const navigate = useNavigate();
  const { signOut } = useClerk();
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const menuItems = [
    { label: "START RAG SYSTEM", action: () => navigate("/homepage"), icon: "/icon.png" },
    { label: "ACCESS RESUME", action: () => navigate("/resume"), icon: "/file.png" },
    { label: "LINKEDIN LINK", action: () => window.open("https://www.linkedin.com/in/john-philip-dela-vega-29b51820a/", "_blank"), icon: "/linkedin.png" },
    { label: "GITHUB LINK", action: () => window.open("https://github.com/JP-DelaVega", "_blank"), icon: "/github.png" },
    { label: "LOGOUT", action: () => signOut(), isDanger: true, icon: null, customIcon: "⏻" },
  ];

  return (
    <div className="flex h-screen w-full items-center justify-center p-6 font-['Courier_New',monospace]">
      <div className="w-full max-w-sm border-2 border-black/30 bg-[#d9d5c7] p-4 shadow-[3px_3px_10px_rgba(0,0,0,0.2),inset_1px_1px_2px_rgba(255,255,255,0.3)]">
        <div className="flex flex-col gap-2">
          {menuItems.map((item, idx) => {
            const isHovered = hoveredIndex === idx;

            return (
              <button
                key={idx}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={item.action}
                className={`
                  group flex items-center gap-3 border-2 px-4 py-3 text-left text-sm font-bold uppercase tracking-widest cursor-pointer transition-all duration-150
                  ${isHovered
                    ? item.isDanger
                      ? "border-black/40 bg-[#c44] text-white shadow-[inset_1px_1px_3px_rgba(0,0,0,0.3)]"
                      : "border-black/40 bg-[#2a3a5a] text-white shadow-[inset_1px_1px_3px_rgba(0,0,0,0.3)]"
                    : "border-black/20 bg-[#e8e4d8] text-black/70 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.5),inset_-1px_-1px_2px_rgba(0,0,0,0.05)] hover:border-black/30"
                  }
                `}
              >
                {item.icon && (
                  <img 
                    src={item.icon} 
                    alt={item.label} 
                    className={`w-5 h-5 object-contain transition-all duration-150 ${isHovered ? "brightness-0 invert" : ""}`} 
                  />
                )}
                
                {item.customIcon && (
                  <span className={`w-5 flex items-center justify-center text-sm transition-colors duration-150 ${isHovered ? "text-white" : "text-black/40"}`}>
                    {item.customIcon}
                  </span>
                )}

                <span className="flex-1">{item.label}</span>

                <span className={`text-xs transition-all duration-150 ${isHovered ? "opacity-100" : "opacity-0"}`}>
                  &gt;
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}