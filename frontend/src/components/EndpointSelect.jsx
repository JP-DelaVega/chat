import { useEffect, useRef, useState } from "react";
import { ChevronDown, Search, Sparkles } from "lucide-react";

export default function EndpointSelect({ endpoints, value, onChange, disabled }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function onClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        disabled={disabled}
        className="flex items-center gap-2 rounded-lg border border-ink-border bg-ink-surface-2 px-3 py-2 font-mono text-xs text-paper-muted hover:border-ink-border-strong transition-colors disabled:opacity-50"
      >
        {value.stream ? (
          <Sparkles size={13} className="text-generate" />
        ) : (
          <Search size={13} className="text-retrieve" />
        )}
        {value.path}
        <ChevronDown size={13} className="text-paper-dim" />
      </button>

      {open && (
        <div className="absolute left-0 bottom-full mb-2 w-52 overflow-hidden rounded-lg border border-ink-border bg-ink-surface shadow-xl animate-fadeUp z-10">
          {endpoints.map((ep) => (
            <button
              key={ep.id}
              type="button"
              onClick={() => {
                onChange(ep);
                setOpen(false);
              }}
              className={`flex w-full flex-col items-start gap-0.5 px-3 py-2.5 text-left transition-colors hover:bg-ink-surface-2 ${
                ep.id === value.id ? "bg-ink-surface-2" : ""
              }`}
            >
              <span className="font-mono text-xs text-paper">{ep.path}</span>
              <span className="text-[11px] text-paper-dim">{ep.hint}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
