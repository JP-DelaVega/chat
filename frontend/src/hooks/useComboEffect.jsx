import { useState, useRef, useCallback, useLayoutEffect } from "react";
import { createPortal } from "react-dom";

const WORDS = ["HIT!", "COMBO!", "CRITICAL!", "RAPID!", "FIERCE!", "SMASH!", "MEGA!", "ULTRA!"];
const SPECIALS = ["HADOUKEN!", "SHORYUKEN!", "TATSUMAKI!", "PERFECT!"];

// vivid standalone colors — these are floating text now (no background box
// behind them), so each needs to be visible on its own against any page bg
const TIERS = [
  { min: 0, color: "#1D7FD1", baseSize: 18, scale: 1.0 },
  { min: 4, color: "#0F9E6E", baseSize: 22, scale: 1.15 },
  { min: 8, color: "#D19A1D", baseSize: 26, scale: 1.3 },
  { min: 14, color: "#E0602E", baseSize: 30, scale: 1.5 },
  { min: 20, color: "#D63A3A", baseSize: 34, scale: 1.75 },
  { min: 28, color: "#C23B9C", baseSize: 40, scale: 2.0 },
];

function tierFor(count) {
  let t = TIERS[0];
  for (const tier of TIERS) if (count >= tier.min) t = tier;
  return t;
}

let popupId = 0;

const SPAWN_THROTTLE_MS = 320; // min gap between visible popups
const POPUP_LIFETIME_MS = 1300; // how long a popup stays visible

const HIGH_SCORE_KEY = "comboHighScore";

function loadHighScore() {
  if (typeof window === "undefined") return 0;
  const raw = window.localStorage.getItem(HIGH_SCORE_KEY);
  const parsed = raw ? parseInt(raw, 10) : 0;
  return Number.isFinite(parsed) ? parsed : 0;
}

/**
 * Hook that drives the combo effect. Call registerKeystroke() from your
 * existing onChange handler — it doesn't touch your state/value at all,
 * it just tracks typing speed and produces popups/shake/counter to render.
 */
export function useComboEffect({ fastThresholdMs = 600 } = {}) {
  const [popups, setPopups] = useState([]);
  const [hitCount, setHitCount] = useState(0);
  const [tier, setTier] = useState(TIERS[0]);
  const [counterVisible, setCounterVisible] = useState(false);
  const [shake, setShake] = useState({ x: 0, y: 0 });
  const [ultimate, setUltimate] = useState(null); // { text, phase, tone } | null
  const [highScore, setHighScore] = useState(loadHighScore);

  const lastTimeRef = useRef(0);
  const lastSpawnRef = useRef(0);
  const resetTimerRef = useRef(null);
  const shakeTimerRef = useRef(null);

  const triggerShake = useCallback((intensity) => {
    const x = Math.random() * intensity - intensity / 2;
    const y = Math.random() * intensity - intensity / 2;
    setShake({ x, y });
    clearTimeout(shakeTimerRef.current);
    shakeTimerRef.current = setTimeout(() => setShake({ x: 0, y: 0 }), 70);
  }, []);

  const ultimateTimerRef = useRef(null);

  /**
   * Call this from your submit/action button to fire a full-screen
   * "ultimate move" activation: flash, giant title text, and a hard shake.
   * tone controls the color: "hype" (red, default) or "muted" (gray, for
   * game-over/stop states where you don't want it to feel celebratory).
   */
  const triggerUltimate = useCallback((text = "ULTRA COMBO!", tone = "hype") => {
    clearTimeout(ultimateTimerRef.current);
    setUltimate({ text, phase: "in", tone });
    triggerShake(28);

    ultimateTimerRef.current = setTimeout(() => {
      setUltimate((prev) => (prev ? { ...prev, phase: "out" } : prev));
    }, 700);

    setTimeout(() => {
      setUltimate(null);
    }, 1100);
  }, [triggerShake]);

  /**
   * Convenience wrapper for a "game over" style reset — same big banner
   * treatment as triggerUltimate but muted/gray instead of red, so it
   * doesn't read as a celebratory hit.
   */
  const triggerGameOver = useCallback((text = "GAME OVER") => {
    triggerUltimate(text, "muted");
  }, [triggerUltimate]);

  const spawnPopup = useCallback((text, currentTier, isSpecial) => {
    const id = popupId++;
    const rotate = Math.random() * 20 - 10;
    const xOffset = Math.random() * 160 - 80;
    const yOffset = Math.random() * 50 - 25;
    const fontSize = isSpecial ? currentTier.baseSize * 1.3 : currentTier.baseSize;

    setPopups((prev) => [
      ...prev,
      { id, text, color: currentTier.color, bg: currentTier.bg, rotate, xOffset, yOffset, fontSize, scale: currentTier.scale, phase: "in" },
    ]);

    setTimeout(() => {
      setPopups((prev) => prev.map((p) => (p.id === id ? { ...p, phase: "out" } : p)));
    }, POPUP_LIFETIME_MS - 400);

    setTimeout(() => {
      setPopups((prev) => prev.filter((p) => p.id !== id));
    }, POPUP_LIFETIME_MS);
  }, []);

  const registerKeystroke = useCallback(() => {
    const now = Date.now();
    const fast = now - lastTimeRef.current < fastThresholdMs;
    lastTimeRef.current = now;

    setHitCount((prevCount) => {
      const newCount = fast ? prevCount + 1 : 1;
      const currentTier = tierFor(newCount);
      const isSpecial = newCount > 0 && newCount % 8 === 0;

      setTier(currentTier);
      setCounterVisible(true);

      setHighScore((prevHigh) => {
        if (newCount <= prevHigh) return prevHigh;
        if (typeof window !== "undefined") {
          window.localStorage.setItem(HIGH_SCORE_KEY, String(newCount));
        }
        return newCount;
      });

      const sinceLastSpawn = now - lastSpawnRef.current;
      const canSpawn = isSpecial || sinceLastSpawn >= SPAWN_THROTTLE_MS;

      if (canSpawn) {
        lastSpawnRef.current = now;
        if (isSpecial) {
          spawnPopup(SPECIALS[Math.floor(Math.random() * SPECIALS.length)], currentTier, true);
          triggerShake(10 + currentTier.scale * 4);
        } else {
          spawnPopup(WORDS[Math.floor(Math.random() * WORDS.length)], currentTier, false);
          if (newCount >= TIERS[2].min) triggerShake(3 + currentTier.scale * 2);
        }
      }

      clearTimeout(resetTimerRef.current);
      resetTimerRef.current = setTimeout(() => {
        setHitCount(0);
        setCounterVisible(false);
      }, 1200);

      return newCount;
    });
  }, [spawnPopup, triggerShake, fastThresholdMs]);

  return {
    popups,
    hitCount,
    tier,
    counterVisible,
    shake,
    registerKeystroke,
    ultimate,
    triggerUltimate,
    triggerGameOver,
    highScore,
  };
}

/**
 * Wrap your existing input/textarea with this. It measures the wrapped
 * element's position and renders the popups/counter through a portal into
 * document.body — completely outside your form's DOM tree, so none of your
 * form/textarea CSS (fonts, borders, overflow clipping, etc.) can reach it.
 */
export function ComboOverlay({ popups, hitCount, tier, counterVisible, shake, ultimate, children }) {
  const anchorRef = useRef(null);
  const [rect, setRect] = useState(null);

  useLayoutEffect(() => {
    function updateRect() {
      if (anchorRef.current) {
        setRect(anchorRef.current.getBoundingClientRect());
      }
    }
    updateRect();
    window.addEventListener("resize", updateRect);
    window.addEventListener("scroll", updateRect, true);
    return () => {
      window.removeEventListener("resize", updateRect);
      window.removeEventListener("scroll", updateRect, true);
    };
    // re-measure whenever popups/counter change too, in case layout shifted
  }, [popups, counterVisible]);

  // base style every popup/counter element starts from, so nothing can be
  // inherited from surrounding page CSS (fonts, spacing, alignment, etc.)
  const resetStyle = {
    all: "initial",
    boxSizing: "border-box",
    fontFamily: "'Courier New', monospace",
    fontWeight: 700,
    textAlign: "center",
    lineHeight: 1.2,
    letterSpacing: "normal",
    pointerEvents: "none",
    zIndex: 2147483000,
  };

  const centerX = rect ? rect.left + rect.width / 2 : 0;
  const isMutedUltimate = ultimate?.tone === "muted";

  return (
    <>
      <div
        ref={anchorRef}
        style={{
          transform: `translate(${shake.x}px, ${shake.y}px)`,
          transition: "transform 0.06s",
        }}
      >
        {children}
      </div>

      {rect &&
        createPortal(
          <>
            {ultimate && (
              <>
                <div
                  style={{
                    ...resetStyle,
                    position: "fixed",
                    inset: 0,
                    background: isMutedUltimate ? "#4b5563" : "#fff",
                    opacity: ultimate.phase === "in" ? (isMutedUltimate ? 0.72 : 0.85) : 0,
                    transition: ultimate.phase === "in" ? "opacity 0.08s ease-out" : "opacity 0.5s ease-out",
                  }}
                />
                <div
                  style={{
                    ...resetStyle,
                    position: "fixed",
                    left: "50%",
                    top: "50%",
                    fontFamily: "'Arial Black', Impact, sans-serif",
                    fontStyle: "italic",
                    textTransform: "uppercase",
                    letterSpacing: "2px",
                    fontSize: "clamp(32px, 8vw, 96px)",
                    color: isMutedUltimate ? "#e5e7eb" : "#D63A3A",
                    textShadow: isMutedUltimate
                      ? [
                        "4px 4px 0 #111827",
                        "-3px -3px 0 #111827",
                        "3px -3px 0 #111827",
                        "-3px 3px 0 #111827",
                        "0 0 28px rgba(17,24,39,0.6)",
                      ].join(", ")
                      : [
                        "4px 4px 0 #000",
                        "-3px -3px 0 #000",
                        "3px -3px 0 #000",
                        "-3px 3px 0 #000",
                        "0 0 40px rgba(0,0,0,0.6)",
                      ].join(", "),
                    whiteSpace: "nowrap",
                    opacity: ultimate.phase === "in" ? 1 : 0,
                    transform: `translate(-50%, -50%) scale(${ultimate.phase === "in" ? 1 : 1.4}) rotate(${ultimate.phase === "in" ? "-2deg" : "-2deg"
                      })`,
                    transition:
                      ultimate.phase === "in"
                        ? "transform 0.35s cubic-bezier(.17,2.2,.3,1), opacity 0.1s ease-out"
                        : "transform 0.4s ease-in, opacity 0.4s ease-in",
                  }}
                >
                  {ultimate.text}
                </div>
              </>
            )}

            <div
              style={{
                ...resetStyle,
                position: "fixed",
                left: "50%",
                top: 24,
                fontFamily: "'Arial Black', Impact, sans-serif",
                transform: `translateX(-50%) scale(${counterVisible ? 1 : 0.4})`,
                fontSize: 34 + tier.scale * 14,
                fontStyle: "italic",
                textTransform: "uppercase",
                letterSpacing: "1px",
                color: tier.color,
                textShadow: [
                  "3px 3px 0 #000",
                  "-2px -2px 0 #000",
                  "2px -2px 0 #000",
                  "-2px 2px 0 #000",
                  "0 0 18px rgba(0,0,0,0.5)",
                  "8px 8px 0 rgba(0,0,0,0.25)",
                ].join(", "),
                opacity: counterVisible ? 1 : 0,
                whiteSpace: "nowrap",
                transition: "transform 0.18s cubic-bezier(.34,1.9,.4,1), opacity 0.15s ease-out, font-size 0.18s cubic-bezier(.34,1.9,.4,1)",
              }}
            >
              {hitCount} HIT!
            </div>

            {popups.map((p) => (
              <div
                key={p.id}
                style={{
                  ...resetStyle,
                  position: "fixed",
                  left: centerX + p.xOffset,
                  top: p.phase === "out" ? rect.top - 140 : rect.top - 50 + p.yOffset,
                  fontSize: p.fontSize,
                  color: p.color,
                  whiteSpace: "nowrap",
                  opacity: p.phase === "out" ? 0 : 1,
                  transform: `translate(-50%, -50%) rotate(${p.rotate}deg) scale(${p.phase === "out" ? p.scale * 0.85 : p.scale
                    })`,
                  transition: "transform 0.16s cubic-bezier(.2,1.6,.4,1), opacity 0.35s ease-out, top 0.9s ease-in",
                }}
              >
                {p.text}
              </div>
            ))}
          </>,
          document.body
        )}
    </>
  );
}