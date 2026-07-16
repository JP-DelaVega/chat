import { useCallback, useEffect, useRef, useState } from "react";
import { askStream } from "../api/ragClient";
import { PHASES } from "../constants/endpoints";

// How long to show the "retrieving" phase before assuming generation has
// started, for the non-streaming endpoint (which gives us no real signal).
const AMBIENT_PHASE_DELAY_MS = 1100;

export function useRagQuery() {
  const [phase, setPhase] = useState(PHASES.IDLE);
  const [answer, setAnswer] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const abortRef = useRef(null);
  const phaseTimerRef = useRef(null);

  useEffect(() => () => clearTimeout(phaseTimerRef.current), []);

  const isBusy = phase === PHASES.RETRIEVE || phase === PHASES.GENERATE;

  const reset = useCallback(() => {
    setAnswer("");
    setErrorMsg("");
    setPhase(PHASES.IDLE);
  }, []);

  const stop = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  const submit = useCallback(async (question, dbName) => {
    const trimmed = question.trim();
    if (!trimmed) return;

    setAnswer("");
    setErrorMsg("");
    setPhase(PHASES.RETRIEVE);

    const controller = new AbortController();
    abortRef.current = controller;

    phaseTimerRef.current = setTimeout(() => {
      setPhase((p) => (p === PHASES.RETRIEVE ? PHASES.GENERATE : p));
    }, AMBIENT_PHASE_DELAY_MS);

    try {
      await askStream(trimmed, dbName, {
        signal: controller.signal,
        onFirstChunk: () => {
          clearTimeout(phaseTimerRef.current);
          setPhase(PHASES.GENERATE);
        },
        onChunk: (chunk) => setAnswer((prev) => prev + chunk),
      });
      setPhase(PHASES.DONE);
    } catch (err) {
      clearTimeout(phaseTimerRef.current);
      if (err.name === "AbortError") {
        setPhase(PHASES.STOPPED);
      } else {
        setErrorMsg(err.message || "Something went wrong.");
        setPhase(PHASES.ERROR);
      }
    } finally {
      abortRef.current = null;
    }
  }, []);

  return { phase, answer, errorMsg, isBusy, submit, stop, reset };
}
