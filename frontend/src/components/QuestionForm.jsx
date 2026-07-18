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
        <div className="bg-[#2b2b2b] border-4 border-t-zinc-600 border-l-zinc-600 border-r-zinc-950 border-b-zinc-950 p-10 shadow-2xl rounded-2xl ">

          <div className="flex gap-1 mb-3 opacity-30">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="h-2 w-4 bg-zinc-500 rounded-sm"></div>
            ))}
          </div>

          <div className="flex justify-between gap-3">
            {/* Input Area (Untouched) */}
            <textarea
              value={question}
              onChange={(e) => onQuestionChange(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isBusy}
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
                  disabled={!question.trim()}
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