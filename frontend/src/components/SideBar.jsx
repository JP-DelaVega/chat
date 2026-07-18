import React from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { useDispatch, useSelector } from "react-redux";
import { setDbNameByLabel } from "../slices/dbSlice";

const DB_MAPPING = {
  "ABOUT ME": "AboutMe_chunks",
  "LEAGUE LORE": "LeagueLore_chunks",
  "STRAVA": "MyStravaActivities_chunks",
};

function Screw({ className = "" }) {
  return (
    <div className={`absolute h-2.5 w-2.5 rounded-full bg-black/15 shadow-[inset_1px_1px_1px_rgba(0,0,0,0.4)] ${className}`}>
      <div className="absolute left-1/2 top-1/2 h-[1px] w-1.5 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-black/40" />
    </div>
  );
}

export default function Sidebar({ isOpen, onClose }) {
  const { user } = useUser();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const currentDb = useSelector((state) => state.database.currentDb);

  const menuItems = [
    { label: "ABOUT ME", track: "01" },
    { label: "LEAGUE LORE", track: "02" },
    { label: "STRAVA", track: "03" },
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
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-[#d9d5c7] p-6 [font-family:'Courier_New',monospace] text-black select-none transition-transform duration-300 ease-in-out md:static md:translate-x-0
          border-2 border-black/30 shadow-[3px_0_10px_rgba(0,0,0,0.2)]
          ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* case screws */}
        <Screw className="left-3 top-3" />
        <Screw className="right-3 top-3" />
        <Screw className="bottom-3 left-3" />
        <Screw className="bottom-3 right-3" />

        {/* vents */}
        <div className="absolute right-6 top-8 flex flex-col gap-1">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-[2px] w-6 rounded-full bg-black/15" />
          ))}
        </div>

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
                key={item.track}
                onClick={() => handleItemClick(item.label)}
                className={`flex w-full items-center gap-3 border-2 px-3 py-2.5 text-left transition-all duration-150
                  ${isActive
                    ? "border-black/50 bg-[#e0b34d]/25 shadow-[inset_1px_1px_3px_rgba(0,0,0,0.25)]"
                    : "border-black/25 bg-[#e8e4d8] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1)] hover:bg-[#ded9c9]"
                  }`}
              >
                {/* drive slot */}
                <div className="relative h-8 w-10 shrink-0 overflow-visible border border-black/40 bg-[#1a1a1a] shadow-[inset_1px_1px_4px_rgba(0,0,0,0.9)]">
                  <div className="absolute left-1/2 top-1/2 h-[2px] w-7 -translate-x-1/2 -translate-y-1/2 bg-black/70" />
                  {isActive && (
                    <div className="absolute -right-1.5 top-1/2 h-6 w-6 -translate-y-1/2 animate-spin rounded-full border border-black/40 bg-white/95 [animation-duration:3s]">
                      <div className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/50" />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="text-[9px] uppercase tracking-widest text-black/40">
                    Bay {item.track}
                  </div>
                  <div className="truncate text-sm font-bold uppercase tracking-wide text-black/80">
                    {item.label}
                  </div>
                </div>

                {/* status LED */}
                <span
                  className={`h-2 w-2 shrink-0 rounded-full ${isActive ? "bg-[#5ebf72] shadow-[0_0_5px_#5ebf72]" : "bg-black/15"
                    }`}
                />
              </button>
            );
          })}
        </nav>

        {/* external link buttons (round, LED on top) */}

        <div className="mt-4 mb-3 flex items-center justify-center gap-8 border border-black/15 bg-[#d1cbb9] p-3 shadow-inner">
          <a
            href="https://github.com/JP-DelaVega"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GITHUB"
            className="group flex flex-col items-center gap-1.5"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-black/15 shadow-[inset_0_0_1px_rgba(0,0,0,0.4)] transition-all duration-150 group-hover:bg-[#5ebf72] group-hover:shadow-[0_0_5px_#5ebf72]" />
            <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-black/40 bg-[#e8e4d8] shadow-[inset_2px_2px_4px_rgba(255,255,255,0.6),inset_-2px_-2px_4px_rgba(0,0,0,0.15)] transition-all group-active:shadow-[inset_2px_2px_6px_rgba(0,0,0,0.4)] group-active:scale-95">
              <span className="text-xs text-black/60 transition-colors group-hover:text-[#5ebf72]">
                ◈
              </span>
            </div>
            <span className="text-[8px] font-bold uppercase tracking-widest text-black/60 group-hover:text-black transition-colors">
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
            <span className="h-1.5 w-1.5 rounded-full bg-black/15 shadow-[inset_0_0_1px_rgba(0,0,0,0.4)] transition-all duration-150 group-hover:bg-[#5ebf72] group-hover:shadow-[0_0_5px_#5ebf72]" />
            <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-black/40 bg-[#e8e4d8] shadow-[inset_2px_2px_4px_rgba(255,255,255,0.6),inset_-2px_-2px_4px_rgba(0,0,0,0.15)] transition-all group-active:shadow-[inset_2px_2px_6px_rgba(0,0,0,0.4)] group-active:scale-95">
              <span className="text-xs text-black/60 transition-colors group-hover:text-[#5ebf72]">
                ◆
              </span>
            </div>
            <span className="text-[8px] font-bold uppercase tracking-widest text-black/60 group-hover:text-black transition-colors">
              LINKEDIN
            </span>
          </a>
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

        <div className="mt-1.5 flex flex-col items-center gap-2 border-t  border-black/15 pt-6">
          <button
            onClick={() => {
              navigate("/");
              onClose();
            }}
            aria-label="Shutdown"
            className="group flex h-16 w-16 items-center justify-center rounded-full border-2 border-black/40 bg-[#e8e4d8] shadow-[inset_2px_2px_4px_rgba(255,255,255,0.6),inset_-2px_-2px_4px_rgba(0,0,0,0.15)] transition-all active:shadow-[inset_2px_2px_6px_rgba(0,0,0,0.4)] active:scale-95"
          >
            <span className="text-2xl text-black/60 transition-colors group-hover:text-[#d9704f]">⏻</span>
          </button>
          <span className="text-[9px] uppercase tracking-widest text-black/40">Shutdown</span>
        </div>
      </aside>
    </>
  );
}