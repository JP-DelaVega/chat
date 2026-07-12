import { useEffect, useRef, useState } from "react";
import QuestionForm from "./components/QuestionForm";
import AnswerCard from "./components/AnswerCard";
import { ENDPOINTS, PHASES } from "./constants/endpoints";
import { useRagQuery } from "./hooks/useRagQuery";

const createMessageId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export default function App() {
  const [question, setQuestion] = useState("");
  const [endpoint, setEndpoint] = useState(ENDPOINTS[0]);
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const assistantMessageIdRef = useRef(null);
  const { phase, answer, errorMsg, isBusy, submit, stop, reset } = useRagQuery();

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

    assistantMessageIdRef.current = assistantMessage.id;
    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    setQuestion("");
    submit(trimmedQuestion, endpoint);
  };

  useEffect(() => {
    if (!assistantMessageIdRef.current) return;

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
      setMessages((prev) =>
        prev.map((message) =>
          message.id === assistantMessageIdRef.current
            ? { ...message, content: answer, isLoading: false, errorMsg: "" }
            : message
        )
      );
      assistantMessageIdRef.current = null;
      return;
    }

    if (phase === PHASES.ERROR) {
      setMessages((prev) =>
        prev.map((message) =>
          message.id === assistantMessageIdRef.current
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
      setMessages((prev) =>
        prev.map((message) =>
          message.id === assistantMessageIdRef.current
            ? { ...message, content: "Stopped.", isLoading: false, errorMsg: "Stopped." }
            : message
        )
      );
      assistantMessageIdRef.current = null;
    }
  }, [phase, answer, errorMsg]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, phase]);

  const handleReset = () => {
    reset();
    setMessages([]);
    assistantMessageIdRef.current = null;
    setQuestion("");
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden overflow-y-auto bg-[radial-gradient(circle_at_top_left,_rgba(255,177,102,0.22),transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(124,198,255,0.18),transparent_30%),#f7efe2] text-[#2d2218]">
      <div
        className="pointer-events-none absolute -top-32 -left-20 h-80 w-80 rounded-full opacity-10 blur-3xl bg-retrieve animate-driftA"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-24 -right-10 h-96 w-96 rounded-full opacity-10 blur-3xl bg-generate animate-driftB"
        aria-hidden="true"
      />

      <div className="relative mx-auto flex min-h-screen w-full max-w-4xl flex-col px-4 py-5 sm:px-6 lg:px-8">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3 rounded-[24px] border-[3px] border-[#ff7b3d] bg-[#fff9ef]/95 p-4 shadow-[6px_6px_0_0_rgba(0,0,0,0.16)] rotate-[-0.8deg]">
          <div className="min-w-0">
            <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-[#8b6d46]">
              <span className="h-1 w-1 rounded-full bg-[#ff7b3d]" />
              Retrieval-augmented console
            </div>
            <h1 className="scribble-text mt-2 text-2xl text-[#2d2218] sm:text-3xl">Ask League Lore.</h1>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="rounded-full border-[2px] border-[#7cc6ff] bg-[#fffaf0] px-3 py-1.5 text-xs font-semibold text-[#4b3b2a] transition hover:-translate-y-0.5 hover:bg-[#fef2d8]"
          >
            Clear chat
          </button>
        </div>

        <div className="flex-1 min-h-0 overflow-hidden rounded-[32px] border-[3px] border-[#7cc6ff] bg-[#fffaf0]/90 p-3 shadow-[8px_8px_0_0_rgba(0,0,0,0.12)] rotate-[0.5deg] sm:p-4">
          <div className="flex h-full flex-col">
            <div className="flex-1 min-h-0 space-y-3 overflow-y-auto px-1 pb-2">
              {messages.length === 0 ? (
                <div className="scribble-text flex h-full min-h-[280px] items-center justify-center rounded-[22px] border-[2px] border-dashed border-[#ffb46b] bg-[#fff7e8]/80 p-6 text-center text-sm text-[#7a6248]">
                  Ask a question and your conversation will appear here.
                </div>
              ) : (
                messages.map((message) => (
                  <AnswerCard
                    key={message.id}
                    role={message.role}
                    content={message.content}
                    isLoading={message.isLoading}
                    errorMsg={message.errorMsg}
                  />
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="mt-3 border-t-[2px] border-dashed border-[#ffb46b] pt-3">
              <QuestionForm
                question={question}
                onQuestionChange={setQuestion}
                endpoint={endpoint}
                onEndpointChange={setEndpoint}
                isBusy={isBusy}
                phase={phase}
                onSubmit={handleSubmit}
                onStop={stop}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
