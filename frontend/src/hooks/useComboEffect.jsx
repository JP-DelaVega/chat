import { useState, useRef, useCallback } from "react";

const WORDS = ["HIT!", "COMBO!", "CRITICAL!", "RAPID!", "FIERCE!", "SMASH!", "MEGA!", "ULTRA!"];
const SPECIALS = ["HADOUKEN!", "SHORYUKEN!", "TATSUMAKI!", "PERFECT!"];

const TIERS = [
  { min: 0,  color: "#4DF0FF", glow: "#00C2FF", baseSize: 18, scale: 1.0 },
  { min: 4,  color: "#4DFFB8", glow: "#00FF88", baseSize: 22, scale: 1.15 },
  { min: 8,  color: "#FFE94D", glow: "#FFC400", baseSize: 26, scale: 1.3 },
  { min: 14, color: "#FF9E4D", glow: "#FF6A00", baseSize: 30, scale: 1.5 },
  { min: 20, color: "#FF4D6A", glow: "#FF0044", baseSize: 34, scale: 1.75 },
  { min: 28, color: "#FF4DE8", glow: "#E600FF", baseSize: 40, scale: 2.0 },
];

function tierFor(count) {
  let t = TIERS[0];
  for (const tier of TIERS) if (count >= tier.min) t = tier;
  return t;
}

let popupId = 0;

const SPAWN_THROTTLE_MS = 320;
const POPUP_LIFETIME_MS = 1300;

const HIGH_SCORE_KEY = "comboHighScore";

function loadHighScore() {
  if (typeof window === "undefined") return 0;
  const raw = window.localStorage.getItem(HIGH_SCORE_KEY);
  const parsed = raw ? parseInt(raw, 10) : 0;
  return Number.isFinite(parsed) ? parsed : 0;
}

export function useComboEffect({ fastThresholdMs = 600 } = {}) {
  const [popups, setPopups] = useState([]);
  const [hitCount, setHitCount] = useState(0);
  const [tier, setTier] = useState(TIERS[0]);
  const [counterVisible, setCounterVisible] = useState(false);
  const [shake, setShake] = useState({ x: 0, y: 0 });
  const [ultimate, setUltimate] = useState(null);
  const [highScore, setHighScore] = useState(loadHighScore);

  const lastTimeRef = useRef(0);
  const lastSpawnRef = useRef(0);
  const resetTimerRef = useRef(null);
  const shakeTimerRef = useRef(null);
  const ultimateTimerRef = useRef(null);

  const triggerShake = useCallback((intensity) => {
    const x = Math.random() * intensity - intensity / 2;
    const y = Math.random() * intensity - intensity / 2;
    setShake({ x, y });
    clearTimeout(shakeTimerRef.current);
    shakeTimerRef.current = setTimeout(() => setShake({ x: 0, y: 0 }), 70);
  }, []);

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

  const triggerGameOver = useCallback((text = "GAME OVER") => {
    triggerUltimate(text, "muted");
  }, [triggerUltimate]);

  const spawnPopup = useCallback((text, currentTier, isSpecial) => {
    const id = popupId++;
    const rotate = Math.random() * 20 - 10;
    const xOffset = Math.random() * 30 - 15; // % offset now, not px
    const yOffset = Math.random() * 8 - 4;   // % offset now, not px
    const fontSize = isSpecial ? currentTier.baseSize * 1.3 : currentTier.baseSize;

    setPopups((prev) => [
      ...prev,
      { id, text, color: currentTier.color, glow: currentTier.glow, rotate, xOffset, yOffset, fontSize, scale: currentTier.scale, isSpecial, phase: "in" },
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
 * Renders everything INSIDE the wrapped element's own box — no portal, no
 * fixed positioning. The wrapper is `position: relative; overflow: hidden`
 * so popups/counter/ultimate are clipped to exactly this container (e.g.
 * the TV screen), not the whole viewport.
 */
export function ComboOverlay({ popups, hitCount, tier, counterVisible, shake, ultimate, children, className = "" }) {
  const resetStyle = {
    all: "initial",
    boxSizing: "border-box",
    fontWeight: 900,
    textAlign: "center",
    lineHeight: 1.2,
    pointerEvents: "none",
    zIndex: 500,
  };

  const isMutedUltimate = ultimate?.tone === "muted";

  return (
    <div
      className={className}
      style={{
        position: "relative",
        overflow: "hidden",
        transform: `translate(${shake.x}px, ${shake.y}px)`,
        transition: "transform 0.06s",
      }}
    >
      <style>{`
        @keyframes comboNeonFlicker {
          0%, 100% { opacity: 1; }
          92% { opacity: 1; }
          93% { opacity: 0.4; }
          94% { opacity: 1; }
          96% { opacity: 0.6; }
          97% { opacity: 1; }
        }
      `}</style>

      {children}

      {ultimate && (
        <>
          <div
            style={{
              ...resetStyle,
              position: "absolute",
              inset: 0,
              background: isMutedUltimate
                ? "#1a1a2e"
                : "radial-gradient(ellipse at center, rgba(255,0,153,0.25), rgba(0,0,0,0.9))",
              opacity: ultimate.phase === "in" ? (isMutedUltimate ? 0.75 : 0.9) : 0,
              transition: ultimate.phase === "in" ? "opacity 0.08s ease-out" : "opacity 0.5s ease-out",
              zIndex: 600,
            }}
          />
          <div
            style={{
              ...resetStyle,
              position: "absolute",
              left: "50%",
              top: "50%",
              fontFamily: "'Arial Black', Impact, sans-serif",
              fontStyle: "italic",
              textTransform: "uppercase",
              letterSpacing: "4px",
              fontSize: "clamp(24px, 7vw, 64px)",
              color: isMutedUltimate ? "#8a8fa3" : "#fff",
              textShadow: isMutedUltimate
                ? ["0 0 6px #fff", "0 0 16px #6b7280", "0 0 32px #4b5563", "3px 3px 0 rgba(0,0,0,0.7)"].join(", ")
                : ["0 0 6px #fff", "0 0 16px #ff2fd6", "0 0 32px #ff2fd6", "0 0 64px #00e5ff", "0 0 90px #00e5ff", "3px 3px 0 rgba(0,0,0,0.8)"].join(", "),
              whiteSpace: "nowrap",
              opacity: ultimate.phase === "in" ? 1 : 0,
              transform: `translate(-50%, -50%) scale(${ultimate.phase === "in" ? 1 : 1.4}) rotate(-2deg)`,
              transition:
                ultimate.phase === "in"
                  ? "transform 0.35s cubic-bezier(.17,2.2,.3,1), opacity 0.1s ease-out"
                  : "transform 0.4s ease-in, opacity 0.4s ease-in",
              zIndex: 600,
            }}
          >
            {ultimate.text}
          </div>
        </>
      )}

      {/* HIT COUNTER — top of the TV screen */}
      <div
        style={{
          ...resetStyle,
          position: "absolute",
          left: "50%",
          top: "10px",
          transform: `translateX(-50%) scale(${counterVisible ? 1 : 0.5})`,
          opacity: counterVisible ? 1 : 0,
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "4px 14px",
          background: "rgba(4, 14, 20, 0.72)",
          border: `2px solid ${tier.glow}`,
          borderRadius: "4px",
          boxShadow: `0 0 10px ${tier.glow}, 0 0 24px ${tier.glow}66, inset 0 0 12px rgba(0,0,0,0.6)`,
          transition: "transform 0.18s cubic-bezier(.34,1.9,.4,1), opacity 0.15s ease-out",
          zIndex: 550,
        }}
      >
        <span style={{ fontFamily: "'Courier New', monospace", fontWeight: 700, fontSize: 11, letterSpacing: "2px", color: tier.color, opacity: 0.85, textShadow: `0 0 6px ${tier.glow}` }}>
          COMBO
        </span>
        <span
          style={{
            fontFamily: "'Courier New', monospace",
            fontWeight: 700,
            fontSize: 20 + tier.scale * 6,
            color: tier.color,
            textShadow: `0 0 4px #fff, 0 0 12px ${tier.glow}, 0 0 26px ${tier.glow}`,
            fontVariantNumeric: "tabular-nums",
            animation: counterVisible ? "comboNeonFlicker 2.2s linear infinite" : "none",
          }}
        >
          {String(hitCount).padStart(2, "0")}
        </span>
        <span style={{ fontFamily: "'Courier New', monospace", fontWeight: 700, fontSize: 11, letterSpacing: "1px", color: tier.color, opacity: 0.7 }}>
          X
        </span>
      </div>

      {/* POPUP WORDS — confined to this screen, positioned as % of its box */}
      {popups.map((p) => (
        <div
          key={p.id}
          style={{
            ...resetStyle,
            position: "absolute",
            left: `calc(50% + ${p.xOffset}%)`,
            bottom: `calc(30% + ${p.yOffset}%)`,
            fontFamily: "'Arial Black', Impact, sans-serif",
            fontStyle: "italic",
            textTransform: "uppercase",
            letterSpacing: p.isSpecial ? "3px" : "1px",
            fontSize: p.fontSize,
            color: p.color,
            textShadow: [
              `0 0 8px ${p.glow}`,
              `0 0 20px ${p.glow}`,
              `0 0 ${p.isSpecial ? 50 : 34}px ${p.glow}`,
              "3px 3px 0 rgba(0,0,0,0.65)",
            ].join(", "),
            whiteSpace: "nowrap",
            opacity: p.phase === "out" ? 0 : 1,
            transform: `translate(-50%, 50%) rotate(${p.rotate}deg) scale(${p.phase === "out" ? p.scale * 0.85 : p.scale})`,
            transition: "transform 0.16s cubic-bezier(.2,1.6,.4,1), opacity 0.35s ease-out",
            zIndex: 550,
          }}
        >
          {p.text}
        </div>
      ))}
    </div>
  );
}