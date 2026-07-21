import { use, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import QuestionForm from "../components/QuestionForm";
import AnswerCard from "../components/AnswerCard";
import { PHASES } from "../constants/endpoints";
import { useRagQuery } from "../hooks/useRagQuery";
import WindowsXpLoading from "../components/WindowsXpLoading"
import { useComboEffect, ComboOverlay } from "../hooks/useComboEffect";
import ClearChatModal from "../components/ClearChatModal";
import style from "./Homepage.module.css"

const createMessageId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export default function HomePage() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const assistantMessageIdRef = useRef(null);

  const currentDb = useSelector((state) => state.database.currentDb);

  const { phase, answer, errorMsg, isBusy, submit, stop, reset } = useRagQuery();
  const [showModal, setShowModal] = useState(false);
  const [animationsEnabled, setAnimationsEnabled] = useState(false);
  const combo = useComboEffect({ enabled: animationsEnabled });

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [restarting, setRestarting] = useState(false)

  const toggleModal = () => {
    setShowModal((prev) => !prev);
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    const trimmedQuestion = question.trim();
    if (!trimmedQuestion) return;

    const userMessage = {
      id: createMessageId(),
      role: "user",
      content: trimmedQuestion,
      isLoading: false,
      errorMsg: "",
    };
    const assistantMessage = {
      id: createMessageId(),
      role: "assistant",
      content: "Thinking...",
      isLoading: true,
      errorMsg: "",
    };

    const cleanHistory = messages.filter((m) => !m.isLoading && m.content);
    assistantMessageIdRef.current = assistantMessage.id;
    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    setQuestion("");
    submit(trimmedQuestion, currentDb, cleanHistory);
  };

  useEffect(() => {
    if (!assistantMessageIdRef.current) return;
    console.log("PHASE:", phase, "ANSWER TAIL:", answer.slice(-50));
    if (phase === PHASES.GENERATE && answer) {
      setMessages((prev) =>
        prev.map((message) =>
          message.id === assistantMessageIdRef.current
            ? { ...message, content: answer, isLoading: false, errorMsg: "" }
            : message
        )
      );
      return;
    }

    if (phase === PHASES.DONE && answer) {
      const targetId = assistantMessageIdRef.current;
      setMessages((prev) =>
        prev.map((message) =>
          message.id === targetId
            ? { ...message, content: answer, isLoading: false, errorMsg: "" }
            : message
        )
      );
      assistantMessageIdRef.current = null;
      return;
    }

    if (phase === PHASES.ERROR) {
      const targetId = assistantMessageIdRef.current;
      setMessages((prev) =>
        prev.map((message) =>
          message.id === targetId
            ? {
              ...message,
              content: errorMsg || "Something went wrong.",
              isLoading: false,
              errorMsg: errorMsg || "Something went wrong.",
            }
            : message
        )
      );
      assistantMessageIdRef.current = null;
      return;
    }

    if (phase === PHASES.STOPPED) {
      const targetId = assistantMessageIdRef.current;
      setMessages((prev) =>
        prev.map((message) =>
          message.id === targetId
            ? { ...message, content: "Stopped.", isLoading: false, errorMsg: "Stopped." }
            : message
        )
      );
      assistantMessageIdRef.current = null;
    }
  }, [phase, answer, errorMsg]);

  useEffect(() => {
    if (messages.length === 0) {
      messagesContainerRef.current?.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [messages.length]);

  useEffect(() => {
    if (messages.length === 0) return;
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, answer]);

  const handleReset = () => {
    reset();
    setMessages([]);
    assistantMessageIdRef.current = null;
    setQuestion("");

    requestAnimationFrame(() => {
      messagesContainerRef.current?.scrollTo({ top: 0, behavior: "auto" });
    });

    // to show windows xp loading screen
    setRestarting(true);
    setTimeout(() => {
      setRestarting(false);
    }, 2000);
  };

  return (
    <>
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
      <div className="relative h-full w-full font-Courier_New',monospace text-black select-none">

        <div className="relative mx-auto flex h-full w-full max-w-4xl flex-col px-4 py-4 sm:px-6 lg:px-8 ">

          <div className="relative max-h-137.5 z-0 flex flex-1 min-h-0 flex-col border-4 border-[#C7C7C7] bg-[#d9d5c7] p-6 rounded-[10px]">

            <div
              className={`relative flex flex-1 min-h-0 flex-col border-10 rounded-[5px] overflow-hidden shadow-[inset_3px_3px_10px_rgba(0,0,0,0.15)] transition-colors duration-500 ease-in-out ${animationsEnabled ? "border-[#1700ff]" : "border-black"
                } ${isDarkMode ? "bg-[#212121]" : "bg-[#e7e7e7] "}`}
            >
              {/* OLD TV EFFECTs*/}
              <div className="pointer-events-none absolute inset-0 z-10 opacity-20 bg-[repeating-linear-gradient(to_bottom,rgba(0,0,0,0.12)_0px,rgba(0,0,0,0.12)_1px,transparent_2px,transparent_4px)]" />
              <div className="pointer-events-none absolute inset-0 z-10 opacity-15 bg-[linear-gradient(90deg,rgba(255,0,0,0.08)_0%,transparent_30%,transparent_70%,rgba(0,150,255,0.08)_100%)]" />
              <div className="pointer-events-none absolute -top-10 left-1/2 z-20 h-40 w-[150%] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.45),rgba(255,255,255,0)_70%)] blur-xl opacity-40" />
              <div className="pointer-events-none absolute inset-0 z-20 shadow-[inset_0_0_80px_rgba(255,255,255,0.08)]" />
              <div className="pointer-events-none absolute inset-0 z-20 shadow-[inset_0_0_120px_rgba(0,0,0,0.45),inset_0_0_20px_rgba(0,0,0,0.25)]" />
              <div className="pointer-events-none absolute inset-0 z-20 rounded-[5px] border border-white/10 shadow-[inset_0_0_50px_rgba(255,255,255,0.05)]" />
              <div className="pointer-events-none absolute inset-x-0 top-0 z-30 h-20 animate-[pulse_3s_linear_infinite] bg-linear-to-b from-white/10 via-white/5 to-transparent blur-md" />
              <div className="absolute inset-0 pointer-events-none opacity-30 z-10 bg" />

              {showModal && (
                <ClearChatModal handleReset={handleReset} toggleModal={toggleModal} />
              )}

              <ComboOverlay {...combo} enabled={animationsEnabled} className="flex flex-1 min-h-0 flex-col">
                <div className="relative z-20 flex flex-1 min-h-0 flex-col p-0.5">

                  <div ref={messagesContainerRef} className="flex-1 min-h-0 space-y-4 overflow-y-auto no-scrollbar px-1 pb-2">
                    {restarting ? (
                      <div className="flex h-full w-full items-center justify-center">
                        <WindowsXpLoading />
                      </div>
                    ) : messages.length === 0 ? (
                      // 2. Empty State
                      <div className={`flex h-full flex-col justify-center p-8 text-left `}>
                        <div className="w-full max-w-sm space-y-2">
                          <p className={`text-sm font-black flex items-center gap-1.5 transition-colors duration-500 ease-in-out ${!isDarkMode ? "text-black/50" : "text-white/50"}`}>
                            <span className="shrink-0 inline-flex items-center justify-center h-5 w-5">&gt;</span>
                            <span>SYSTEM: RAG-CHASSIS ONLINE</span>
                          </p>
                          <p className={`text-sm font-black flex items-center gap-1.5 transition-colors duration-500 ease-in-out ${!isDarkMode ? "text-black/70" : "text-white/70"}`}>
                            <span className="shrink-0 inline-flex items-center justify-center h-5 w-5">&gt;</span>
                            <span>SOURCE LOADED: {currentDb || "NONE SELECTED"}</span>
                          </p>

                          <p className={`text-sm font-black flex items-center gap-1.5 transition-colors duration-500 ease-in-out ${!isDarkMode ? "text-black" : "text-white"}`}>
                            <span className="shrink-0 relative inline-flex items-center justify-center h-5 w-5">
                              <span
                                className="absolute inset-0 flex items-center justify-center transition-all duration-300 ease-in-out"
                                style={{
                                  opacity: animationsEnabled ? 0 : 1,
                                  transform: animationsEnabled ? "scale(0.5)" : "scale(1)",
                                }}
                              >
                                &gt;
                              </span>
                              <img
                                src="/pacman.gif"
                                alt="pacman"
                                className="absolute inset-0 w-5 h-5 object-contain transition-all duration-300 ease-in-out transform hover:scale-150"
                                style={{
                                  opacity: animationsEnabled ? 1 : 0,
                                  transform: animationsEnabled ? "scale(1)" : "scale(0.5)",
                                }}
                              />
                            </span>
                            <span>
                              {question ? question : `AWAITING INPUT`}
                              <span className="animate-pulse">▍</span>
                            </span>
                          </p>
                        </div>
                      </div>
                    ) : (
                      // 3. Message List
                      messages.map((message) => (
                        <AnswerCard
                          key={message.id}
                          role={message.role}
                          content={message.content}
                          isLoading={message.isLoading}
                          errorMsg={message.errorMsg}
                          animationsEnabled={animationsEnabled}
                        />
                      ))
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </div>
              </ComboOverlay>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between border-t-2 border-black/10 pt-3 select-none gap-4">
              <div className="text-[10px] font-black tracking-wider text-black/40">
                ⚡ RAG-CHASSIS // MODEL CRT-89
              </div>

              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-3">
                  <div className={`${style.checkboxwrapper25} flex items-center h-4.5`}>
                    <input type="checkbox" onChange={() => setIsDarkMode(prev => !prev)} />
                  </div>
                  <div className="text-[10px]  font-black tracking-wider text-black/40">
                    Light/Dark
                  </div>

                  <div className="h-5 w-px bg-black/30" />

                  <button
                    type="button"
                    onClick={() => setAnimationsEnabled((prev) => !prev)}
                    className="group relative flex h-5.5 items-center justify-center gap-2 border-2 border-t-white border-l-white border-b-black/40 border-r-black/40 bg-[#c8c4b6] px-3 text-[9px] font-black uppercase tracking-widest text-black/70 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.6),inset_-1px_-1px_2px_rgba(0,0,0,0.1),1px_1px_2px_rgba(0,0,0,0.15)] transition-all duration-150 hover:bg-[#d4d0c2] active:translate-y-px active:border-t-black/40 active:border-l-black/40 active:border-b-white active:border-r-white active:shadow-[inset_1px_1px_3px_rgba(0,0,0,0.2)]"
                  >
                    <span>GAME MODE</span>
                    <span className={`h-2 w-2 rounded-full border border-black/30 transition-all duration-200 ${animationsEnabled ? "bg-[#5ebf72] shadow-[0_0_4px_#5ebf72]" : "bg-black/15"}`} />
                  </button>

                  <button
                    type="button"
                    onClick={toggleModal}
                    className="group relative flex h-5.5 items-center justify-center gap-2 border-2 border-t-red-300 border-l-red-300 border-b-black/50 border-r-black/50 bg-[#c44] px-3 text-[9px] font-black uppercase tracking-widest text-white shadow-[inset_1px_1px_2px_rgba(255,255,255,0.3),inset_-1px_-1px_2px_rgba(0,0,0,0.2),1px_1px_2px_rgba(0,0,0,0.2)] transition-all duration-150 hover:bg-[#d95555] active:translate-y-px active:border-t-black/50 active:border-l-black/50 active:border-b-red-300 active:border-r-red-300 active:shadow-[inset_1px_1px_3px_rgba(0,0,0,0.3)]"
                  >
                    <span>RESTART</span>
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex gap-1.5">
                    {/* Busy Knob */}
                    <div
                      className={`relative h-5 w-5 rounded-full border-2 border-black bg-[#f5efe0] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.2)] ${isBusy ? "animate-spin" : ""
                        }`}
                      style={{
                        animationDuration: "1s",
                        animationTimingFunction: "linear",
                      }}
                    >
                      <div className="absolute top-0.5 left-1/2 -translate-x-1/2 w-0.5 h-1.5 bg-black" />
                    </div>

                    {/* Restart Knob */}
                    <div
                      className={`relative h-5 w-5 rounded-full border-2 border-black bg-[#f5efe0] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.2)] ${restarting ? "animate-spin" : ""
                        }`}
                      style={{
                        animationDuration: "1s",
                        animationTimingFunction: "linear",
                      }}
                    >
                      <div className="absolute top-0.5 left-1/2 -translate-x-1/2 w-0.5 h-1.5 bg-black" />
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[8px] font-black text-black/40 uppercase">PWR</span>
                    <span className={`h-4 w-4 rounded-full border-2 border-black transition-all duration-300 ${isBusy || restarting ? "bg-[#fc440c] animate-pulse shadow-[0_0_8px_#d9704f]" : "bg-[#5ebf72] shadow-[0_0_8px_#5ebf72]"
                      }`} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-110 mt-6 ">

            <QuestionForm
              question={question}
              onQuestionChange={setQuestion}
              isBusy={isBusy}
              phase={phase}
              onSubmit={handleSubmit}
              onStop={stop}
              handleReset={handleReset}
              toggleModal={toggleModal}
              showModal={showModal}
              animationsEnabled={animationsEnabled}
              toggleAnimations={() => setAnimationsEnabled((prev) => !prev)}
              restarting={restarting}
              combo={combo}
            />
          </div>

        </div>
      </div>
    </ >
  );
}