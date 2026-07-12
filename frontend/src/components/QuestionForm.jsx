import { useEffect, useRef } from "react";
import { ArrowUp, Square } from "lucide-react";
import EndpointSelect from "./EndpointSelect";
import SignalLoader from "./SignalLoader";
import { ENDPOINTS } from "../constants/endpoints";

export default function QuestionForm({
  question,
  onQuestionChange,
  endpoint,
  onEndpointChange,
  isBusy,
  phase,
  onSubmit,
  onStop,
}) {
  const textareaRef = useRef(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 320) + "px";
  }, [question]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <form onSubmit={onSubmit} className="relative">
      <div
        className={`rounded-[24px] border-[2px] bg-[#fffaf0] transition-colors duration-300 ${isBusy ? "border-[#ff7b3d]" : "border-[#7cc6ff]"
          } shadow-[4px_4px_0_0_rgba(0,0,0,0.12)]`}
      >
        <textarea
          ref={textareaRef}
          value={question}
          onChange={(e) => onQuestionChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isBusy}
          rows={3}
          placeholder="Ask something about your documents…"
          className="scribble-text w-full resize-none bg-transparent px-6 pt-6 pb-4 text-[17px] leading-relaxed text-[#2d2218] placeholder-[#9a8468] outline-none disabled:opacity-60"
        />

        <div className="flex items-center justify-between px-4 pb-4">
          <EndpointSelect
            endpoints={ENDPOINTS}
            value={endpoint}
            onChange={onEndpointChange}
            disabled={isBusy}
          />

          {isBusy ? (
            <button
              type="button"
              onClick={onStop}
              className="flex items-center gap-2 rounded-full border-[2px] border-[#ff7b3d] bg-[#fff0db] px-3.5 py-2 font-mono text-xs text-[#5b3d25] transition-colors hover:bg-[#ffe3b2]"
            >
              <Square size={11} fill="currentColor" />
              Stop
            </button>
          ) : (
            <button
              type="submit"
              disabled={!question.trim()}
              className="flex h-9 w-9 items-center justify-center rounded-full border-[2px] border-[#7cc6ff] bg-[#7cc6ff] text-[#1f2d3a] transition-colors disabled:border-[#d8d1c5] disabled:bg-[#eee7d9] disabled:text-[#9a8468]"
              aria-label="Send"
            >
              <ArrowUp size={16} />
            </button>
          )}
        </div>
      </div>

      <SignalLoader phase={phase} />
    </form>
  );
}
