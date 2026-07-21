import React from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { useDispatch, useSelector } from "react-redux";
import { setDbNameByLabel } from "../slices/dbSlice";

const DB_MAPPING = {
  "ABOUT ME": "AboutMe_chunks",
  "STRAVA": "MyStravaActivities_chunks",
  "LEAGUE LORE": "LeagueLore_chunks",
  "MATCH HISTORY": "lol_stats"
};

function Screw({ className = "" }) {
  return (
    <div className={`absolute h-2.5 w-2.5 rounded-full bg-black/15 shadow-[inset_1px_1px_1px_rgba(0,0,0,0.4)] ${className}`}>
      <div className="absolute left-1/2 top-1/2 h-px w-1.5 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-black/40" />
    </div>
  );
}

export default function Sidebar({ isOpen, onClose }) {
  const { user } = useUser();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const currentDb = useSelector((state) => state.database.currentDb);

  const menuItems = [
    { label: "ABOUT ME", track: "RAG" },
    { label: "STRAVA", track: "RAG" },
    { label: "LEAGUE LORE", track: "RAG" },
    { label: "MATCH HISTORY", track: "lol_stats" },
  ];

  const handleItemClick = (label) => {
    dispatch(setDbNameByLabel(label));
    onClose();
  };

  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/20 transition-opacity duration-300 md:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-75 flex-col bg-[#d9d5c7] p-6 font-['Courier_New',monospace] text-black select-none transition-transform duration-300 ease-in-out md:static md:translate-x-0
          border-2 border-black/30 shadow-[3px_0_10px_rgba(0,0,0,0.2)]
          ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* case screws */}
        <Screw className="left-3 top-3" />
        <Screw className="right-3 top-3" />
        <Screw className="bottom-3 left-3" />
        <Screw className="bottom-3 right-3" />




        <div className="flex flex-col gap-4 w-full">
          <div className="flex items-center gap-3 border-2 mb-3 border-black/40 bg-[#0d1a12] p-4 pt-6 pb-6 shadow-[inset_2px_2px_6px_rgba(0,0,0,0.7)]">
            <div className="overflow-hidden">

              <p className="truncate text-xs font-black tracking-wider text-[#7eda28] [text-shadow:0_0_4px_rgba(126,218,40,0.6)]">
                John Philip Dela Vega{/*user.firstName + " " + user?.lastName || "PLAYER"*/}
              </p>
              <p className="truncate text-[8px] font-black tracking-wider text-[#7eda28] [text-shadow:0_0_4px_rgba(126,218,40,0.6)]">
                jayplought@gmai.com{/**user?.emailAddress || "jayplought@gmail.com" */}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-2 flex items-center justify-between border-b border-black/20 pb-1 text-[10px] font-bold uppercase tracking-widest text-black/40">
          <span>Drive Bays</span>
          <span>{menuItems.length} Installed</span>
        </div>

        <nav className="flex-1 space-y-2.5">
          {menuItems.map((item) => {
            const isActive = DB_MAPPING[item.label] === currentDb;

            return (
              <button
                key={item.label}
                onClick={() => handleItemClick(item.label)}
                className={`group flex w-full items-center gap-3 border-2 px-3 py-2.5 text-left transition-all duration-200
          ${isActive
                    ? "border-black/40 bg-[#e0b34d]/20 shadow-[inset_1px_1px_3px_rgba(0,0,0,0.2)]"
                    : "border-black/20 bg-[#e8e4d8] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.08)] hover:border-black/35 hover:bg-[#e4e0d4] hover:shadow-[inset_1px_1px_3px_rgba(0,0,0,0.12),0_1px_0_rgba(255,255,255,0.5)]"
                  }`}
              >
                {/* CD-ROM faceplate */}
                <div className={`relative h-8 w-12 shrink-0 border transition-all duration-200
          ${isActive
                    ? "border-black/50 bg-[#2a2a2a] shadow-[inset_1px_1px_4px_rgba(0,0,0,0.9)]"
                    : "border-black/30 bg-[#333] shadow-[inset_1px_1px_3px_rgba(0,0,0,0.7)] group-hover:border-black/45"
                  }`}
                >
                  {/* Tray slot */}
                  <div className={`absolute left-1 top-1/2 h-0.5 w-8 -translate-y-1/2 transition-colors duration-200
            ${isActive ? "bg-black/60" : "bg-black/40 group-hover:bg-black/55"}`}
                  />

                  {/* Eject hole */}
                  <div className="absolute bottom-1 right-1 h-1 w-1 rounded-full bg-black/50" />

                  {/* Activity LED */}
                  <div className={`absolute top-1 right-1 h-1 w-2.5 rounded-[1px] transition-all duration-200
            ${isActive
                      ? "bg-[#5ebf72] shadow-[0_0_4px_#5ebf72]"
                      : "bg-black/30 group-hover:bg-[#5ebf72]/30"
                    }`}
                  />

                  {/* Spinning disc — only when active */}
                  {isActive && (
                    <div className="absolute -right-2 top-1/2 h-5 w-5 -translate-y-1/2 animate-spin rounded-full border border-black/30 bg-[#e8e4d8]/90 [animation-duration:2.5s]">
                      <div className="absolute left-1/2 top-1/2 h-0.5 w-0.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/40" />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="text-[9px] uppercase tracking-widest text-black/40">
                    {item.track}
                  </div>
                  <div className={`truncate text-sm font-bold uppercase tracking-wide transition-colors duration-200
            ${isActive ? "text-black/80" : "text-black/60 group-hover:text-black/75"}`}
                  >
                    {item.label}
                  </div>
                </div>

                {/* Status dot */}
                <span
                  className={`h-1.5 w-1.5 shrink-0 rounded-full transition-all duration-200
            ${isActive
                      ? "bg-[#5ebf72] shadow-[0_0_4px_#5ebf72]"
                      : "bg-black/15 group-hover:bg-black/30"
                    }`}
                />
              </button>
            );
          })}
        </nav>

        {/* external link buttons (round, LED on top) */}

        <div className="mt-4 mb-3 border-2 border-[#b8b4a6] bg-[#c8c4b6] p-3 shadow-[inset_1px_1px_3px_rgba(0,0,0,0.1)]">
     
          <div className="flex items-center justify-center gap-6">
            <a
              href="https://github.com/JP-DelaVega"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GITHUB"
              className="group flex flex-col items-center gap-1.5"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#a09c8e] shadow-[inset_0_0_1px_rgba(0,0,0,0.4)] transition-all duration-200 group-hover:bg-[#5ebf72] group-hover:shadow-[0_0_6px_#5ebf72]" />
              <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#a09c8e] bg-[#d4d0c2] shadow-[inset_2px_2px_4px_rgba(255,255,255,0.6),inset_-2px_-2px_4px_rgba(0,0,0,0.15),2px_2px_4px_rgba(0,0,0,0.1)] transition-all group-active:shadow-[inset_2px_2px_6px_rgba(0,0,0,0.3)] group-active:scale-95">
                <span className="text-xs font-bold text-[#8a8678] transition-colors group-hover:text-[#5ebf72]">
                  GH
                </span>
              </div>
              <span className="text-[7px] font-bold uppercase tracking-widest text-[#8a8678] group-hover:text-[#5a5a5a] transition-colors">
                GITHUB
              </span>
            </a>

            <a
              href="https://www.linkedin.com/in/john-philip-dela-vega-29b51820a/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LINKEDIN"
              className="group flex flex-col items-center gap-1.5"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#a09c8e] shadow-[inset_0_0_1px_rgba(0,0,0,0.4)] transition-all duration-200 group-hover:bg-[#5ebf72] group-hover:shadow-[0_0_6px_#5ebf72]" />
              <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#a09c8e] bg-[#d4d0c2] shadow-[inset_2px_2px_4px_rgba(255,255,255,0.6),inset_-2px_-2px_4px_rgba(0,0,0,0.15),2px_2px_4px_rgba(0,0,0,0.1)] transition-all group-active:shadow-[inset_2px_2px_6px_rgba(0,0,0,0.3)] group-active:scale-95">
                <span className="text-xs font-bold text-[#8a8678] transition-colors group-hover:text-[#5ebf72]">
                  LI
                </span>
              </div>
              <span className="text-[7px] font-bold uppercase tracking-widest text-[#8a8678] group-hover:text-[#5a5a5a] transition-colors">
                LINKEDIN
              </span>
            </a>
          </div>
        </div>

        {/**<button
          onClick={() => {
            navigate("/");
            onClose();
          }}
          className="mt-4 flex w-full items-center gap-3 border-2 border-black/25 bg-[#e8e4d8] px-3 py-2 text-left text-sm uppercase tracking-wider text-black/70 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1)] transition-all duration-150 hover:bg-[#ded9c9]"
        >
          ← Main Menu
        </button> */}


        {/* power button */}

        <div className="mt-auto flex flex-col items-center gap-3 border-t-2 border-[#b8b4a6] pt-5">
        
          <button
            onClick={() => {
              navigate("/");
              onClose();
            }}
            aria-label="Shutdown"
            className="group relative flex h-16 w-16 items-center justify-center rounded-full border-3 border-[#a09c8e] bg-[#d4d0c2] shadow-[inset_2px_2px_4px_rgba(255,255,255,0.6),inset_-2px_-2px_4px_rgba(0,0,0,0.15),3px_3px_8px_rgba(0,0,0,0.15)] transition-all active:shadow-[inset_2px_2px_6px_rgba(0,0,0,0.3)] active:scale-95"
          >
            {/* Power LED Ring */}
            <div className="absolute inset-0 rounded-full border-2 border-[#d9704f]/0 transition-all duration-300 group-hover:border-[#d9704f]/30 group-hover:shadow-[0_0_12px_rgba(217,112,79,0.2)]" />
            <span className="text-2xl text-[#8a8678] transition-colors duration-200 group-hover:text-[#d9704f]">
              ⏻
            </span>
          </button>
          <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#a09c8e]">
            SHUTDOWN
          </span>
        </div>
      </aside>
    </>
  );
}