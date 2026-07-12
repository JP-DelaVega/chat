export default function AnswerCard({ role = "assistant", content = "", isLoading = false, errorMsg = "" }) {
  const isUser = role === "user";
  const isError = Boolean(errorMsg);
  const displayText = isUser
    ? content
    : isError
      ? errorMsg
      : content || (isLoading ? "Thinking..." : "No response yet.");

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-2`}>
      <div
        className={`message-enter min-w-0 max-w-[94%] rounded-[24px] border-[2px] px-4 py-3 shadow-[4px_4px_0_0_rgba(0,0,0,0.12)] backdrop-blur-sm sm:max-w-[82%] ${isUser
            ? "border-[#ff7b3d] bg-[#ffe3b2] text-[#3f2d1d]"
            : isError
              ? "border-[#ff7b3d] bg-[#ffe3df] text-[#7a2f24]"
              : "border-[#7cc6ff] bg-[#fdf7e9] text-[#2d2218]"
          }`}
      >
        {!isUser && (
          <div className="mb-1 text-[10px] font-mono uppercase tracking-[0.2em] text-[#8b6d46]">
            Assistant
          </div>
        )}

        <p className="scribble-text break-words overflow-wrap-anywhere text-[15px] leading-relaxed">
          {displayText}
          {isLoading && !isUser && <span className="typing-cursor ml-1 inline-block">▍</span>}
        </p>
      </div>
    </div>
  );
}
