import { useEffect, useRef } from "react";
import SignalLoader from "./SignalLoader";
import styles from "./QuestionForm.module.css";
import { useComboEffect, ComboOverlay } from "../hooks/useComboEffect";
import ClearChatModal from "./ClearChatModal";

export default function QuestionForm({
  question,
  onQuestionChange,
  isBusy,
  phase,
  onSubmit,
  onStop,
  handleReset,
  toggleModal,
  showModal,
  animationsEnabled,
  toggleAnimations,
  restarting
}) {
  const combo = useComboEffect({ enabled: animationsEnabled });

  const handleKeyDown = (e) => {
    if ((e.key === " " || e.key === "a" || e.key === "e" || e.key === "i" || e.key === "o" || e.key === "u") && animationsEnabled) {
      combo.registerKeystroke();
    }
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!question) return;
      if (animationsEnabled) {
        combo.triggerUltimate("ULTRA COMBO!");
      }
      onSubmit();
    }
  };

  const handleSubmit = () => {
    if (!question) return;
    if (animationsEnabled) {
      combo.triggerUltimate("ULTRA COMBO!");
    }
    onSubmit();
  };

  const onReset = () => {
    if (animationsEnabled) {
      combo.triggerGameOver("GAME OVER 🥲");
    }
    handleReset();
  };

  return (
    <ComboOverlay {...combo} enabled={animationsEnabled}>
      {showModal && (
        <ClearChatModal handleReset={onReset} toggleModal={toggleModal} />
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="relative"
      >
        <div className="bg-gradient-to-b from-[#3a3a3a] to-[#1f1f1f] border-4 border-t-zinc-500 border-l-zinc-500 border-r-black border-b-black p-10 shadow-[0_8px_20px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.1)] rounded-2xl relative overflow-hidden">

          {/* Brushed metal texture lines */}
          <div className="pointer-events-none absolute inset-0 opacity-10 bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.15)_0px,transparent_1px,transparent_3px)]" />

          {/* Screw/rivet accents in corners */}
          <div className="pointer-events-none absolute top-3 left-3 h-2 w-2 rounded-full bg-zinc-600 shadow-[inset_0_1px_1px_rgba(0,0,0,0.6),0_1px_0_rgba(255,255,255,0.1)]" />
          <div className="pointer-events-none absolute top-3 right-3 h-2 w-2 rounded-full bg-zinc-600 shadow-[inset_0_1px_1px_rgba(0,0,0,0.6),0_1px_0_rgba(255,255,255,0.1)]" />
          <div className="pointer-events-none absolute bottom-3 left-3 h-2 w-2 rounded-full bg-zinc-600 shadow-[inset_0_1px_1px_rgba(0,0,0,0.6),0_1px_0_rgba(255,255,255,0.1)]" />
          <div className="pointer-events-none absolute bottom-3 right-3 h-2 w-2 rounded-full bg-zinc-600 shadow-[inset_0_1px_1px_rgba(0,0,0,0.6),0_1px_0_rgba(255,255,255,0.1)]" />

          <div className="flex gap-1 mb-3 opacity-40 relative z-10">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="h-2 w-4 bg-zinc-500 rounded-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.2),inset_0_-1px_0_rgba(0,0,0,0.4)]"
              ></div>
            ))}
          </div>

          <div className="flex justify-between gap-3 relative z-10">
            {/* Input Area (Untouched) */}
            <textarea
              value={question}
              onChange={(e) => onQuestionChange(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isBusy || restarting}
              placeholder="ASK_SOMETHING_ABOUT_YOUR_DOCUMENTS..."
              className="w-full resize-none bg-white p-3 font-mono text-sm text-black 
     border-2 border-t-black border-l-black border-b-white border-r-white 
     outline-none focus:outline-none 
     disabled:bg-gray-300 disabled:opacity-75"
            />

            {/* Send / Stop Buttons (Untouched) */}
            <div>
              {isBusy ? (
                <button
                  className={styles.keycap}
                  type="button"
                  onClick={onStop}
                >
                  <aside className={styles.letter}>Stop</aside>
                </button>
              ) : (
                <button
                  className={styles.keycap}
                  type="submit"
                  disabled={!question.trim() || restarting}
                >
                  <aside className={styles.letter}>Send</aside>
                </button>
              )}
            </div>
          </div>
        </div>

        <SignalLoader phase={phase} />
      </form>
    </ComboOverlay>
  );
}