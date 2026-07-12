import { Search, Sparkles } from "lucide-react";
import { PHASES } from "../constants/endpoints";

export default function SignalLoader({ phase }) {
  return (
    <>
      <div className="relative mt-3 h-px w-full overflow-hidden rounded-full bg-ink-surface-3">
        {phase === PHASES.RETRIEVE && (
          <span
            className="absolute inset-y-0 left-0 w-1/3 rounded-full animate-scanSweep"
            style={{ background: "linear-gradient(90deg, transparent, #E8A25C, transparent)" }}
          />
        )}
        {phase === PHASES.GENERATE && (
          <span className="absolute inset-0 rounded-full bg-generate animate-pulseGlow" />
        )}
      </div>

      <div className="mt-3 flex h-5 items-center justify-center gap-2 font-mono text-[11px] tracking-wide">
        {phase === PHASES.RETRIEVE && (
          <span className="flex items-center gap-2 text-retrieve animate-fadeUp">
            <Search size={12} />
            Retrieving context…
          </span>
        )}
        {phase === PHASES.GENERATE && (
          <span className="flex items-center gap-2 text-generate animate-fadeUp">
            <Sparkles size={12} />
            Composing answer…
          </span>
        )}
        {phase === PHASES.STOPPED && (
          <span className="text-paper-dim animate-fadeUp">Stopped before finishing.</span>
        )}
      </div>
    </>
  );
}
