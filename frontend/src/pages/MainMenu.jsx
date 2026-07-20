import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useClerk } from "@clerk/clerk-react";

export default function MainMenu() {
  const navigate = useNavigate();
  const { signOut } = useClerk();
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const menuItems = [
    { label: "START RAG SYSTEM", action: () => navigate("/homepage") },
    { label: "ACCESS RESUME", action: () => navigate("/resume") },
    { label: "LINKEDIN LINK", action: () => window.open("https://www.linkedin.com/in/john-philip-dela-vega-29b51820a/", "_blank") },
    { label: "GITHUB LINK", action: () => window.open("https://github.com/JP-DelaVega", "_blank") },
    { label: "LOGOUT", action: () => signOut(), isDanger: true },
  ];

  return (
    <div className="flex h-screen w-full items-center justify-center p-6 [font-family:'Courier_New',monospace]">

      {/* Container simulating a classic Windows "Window" or Menu Bar */}
      <div className="w-full max-w-sm border-2 border-black/30 shadow-[3px_0_10px_rgba(0,0,0,0.2) bg-[#d9d5c7] p-3 ">

        <div className="flex flex-col gap-1">
          {menuItems.map((item, idx) => {
            const isHovered = hoveredIndex === idx;

            return (
              <button
                key={idx}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={item.action}
                className={`
                  relative px-4 py-3 text-left text-sm font-bold uppercase tracking-widest cursor-pointer
                  border-2
                  /* Bevel Effect (Classic Windows Look) */
                 border-black/25 bg-[#e8e4d8] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1)] 
                  
                  /* Dynamic States */
                  ${isHovered
                    ? item.isDanger
                      ? "bg-red-600 text-white"
                      : "bg-blue-900 text-white"
                    : "bg-[#d9d5c7] text-black"
                  }
                `}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}