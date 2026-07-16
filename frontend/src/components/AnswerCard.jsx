import { useUser } from "@clerk/clerk-react";
export default function AnswerCard({ role = "assistant", content = "", isLoading = false, errorMsg = "" }) {
  const isUser = role === "user";
  const isError = Boolean(errorMsg);
  const displayText = isUser
    ? content
    : isError
      ? errorMsg
      : content || (isLoading ? "Thinking..." : "No response yet.");

  const { user } = useUser();

  const neon = isUser ? "#ff2fa0" : isError ? "#ff4d3d" : "#00c2e0";
  const label = isUser ? user.firstName || user.username || "PLAYER" : isError ? "SYSTEM ERROR" : "CPU";


  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-2`}>
      <div
        className="message-enter relative min-w-0 max-w-[94%] overflow-hidden rounded-[6px] border-[3px] bg-[#f4f6f2] px-4 py-3 sm:max-w-[82%]"
        style={{
          borderColor: neon,
          boxShadow: `0 0 0 1px rgba(0,0,0,0.04), 0 0 14px ${neon}55, inset 0 0 20px ${neon}18`,
        }}
      >
        {/* scanline overlay, like a CRT screen */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: "repeating-linear-gradient(0deg, #000 0px, #000 1px, transparent 1px, transparent 3px)",
          }}
          aria-hidden="true"
        />

        <div
          className="relative mb-1.5 flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.25em]"
          style={{ color: neon }}
        >
          <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ backgroundColor: neon, boxShadow: `0 0 6px ${neon}` }} />
          {label}
        </div>

        <p className="relative break-words overflow-wrap-anywhere font-mono text-[14px] leading-relaxed text-[#1a2420]">
          {displayText}
          {isLoading && !isUser && (
            <span className="ml-1 inline-block animate-pulse" style={{ color: neon }}>
              ▍
            </span>
          )}
        </p>
      </div>
    </div>
  );
}