import { useEffect, useRef } from "react";
import { ArrowUp, Square } from "lucide-react";
import SignalLoader from "./SignalLoader";
import styles from "./QuestionForm.module.css";
import { useComboEffect, ComboOverlay } from "../hooks/useComboEffect"
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

  const handleKeyDown = (e) => {
    if (e.key === " " && animationsEnabled) {
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
      combo.triggerGameOver("GAME OVER 🥲")
    }
    handleReset();
  }

  const combo = useComboEffect({ enabled: animationsEnabled });
  return (
    <ComboOverlay {...combo} enabled={animationsEnabled}>
      {showModal && <ClearChatModal handleReset={() => onReset()} toggleModal={toggleModal} />}

      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="relative">

        <div
          className="flex justify-between"
        >
          <textarea
            value={question}
            onChange={(e) => {
              onQuestionChange(e.target.value);
            }}
            onKeyDown={handleKeyDown}
            disabled={isBusy}
            placeholder="Ask something about your documents…"
            className={styles.input}
          />
          <div >
            {isBusy ? (
              <button className={styles.boxbutton} type="button"
                onClick={onStop}>
                <div className={styles.button}
                  disabled={!question.trim()}
                  aria-label="Send"
                  className={styles.button}><span>Stop</span></div>
              </button>
            ) : (
              <button className={styles.boxbutton} type="submit">
                <div className={styles.button}
                  disabled={!question.trim()}
                  aria-label="Send"
                  className={styles.button}><span>Button</span></div>
              </button>
            )}
          </div>


        </div>

        <SignalLoader phase={phase} />
      </form> </ComboOverlay>
  );
}

