import { useEffect, useRef, useState } from "react";
import QuestionForm from "./components/QuestionForm";
import AnswerCard from "./components/AnswerCard";
import { loginUser, registerUser, getCurrentUser } from "./api/authClient";
import { PHASES } from "./constants/endpoints";
import { useRagQuery } from "./hooks/useRagQuery";

const createMessageId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export default function App() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [isAuthView, setIsAuthView] = useState(true);
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authSuccess, setAuthSuccess] = useState("");
  const [token, setToken] = useState(() => localStorage.getItem("rag_token") || "");
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("rag_user") || "null"));
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const assistantMessageIdRef = useRef(null);
  const { phase, answer, errorMsg, isBusy, submit, stop, reset } = useRagQuery();
  const [showModal, setShowModal] = useState(false);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);

  const toggleModal = () => {
    setShowModal((prev) => !prev);
  };

  useEffect(() => {
    if (!token) {
      setIsAuthView(true);
      return;
    }

    getCurrentUser(token)
      .then((profile) => {
        setUser(profile.user);
        setIsAuthView(false);
      })
      .catch(() => {
        localStorage.removeItem("rag_token");
        localStorage.removeItem("rag_user");
        setToken("");
        setUser(null);
        setIsAuthView(true);
      });
  }, [token]);

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError("");
    setAuthSuccess("");

    try {
      const result = mode === "login"
        ? await loginUser(email, password)
        : await registerUser(email, password);

      localStorage.setItem("rag_token", result.access_token);
      localStorage.setItem("rag_user", JSON.stringify(result.user));
      setToken(result.access_token);
      setUser(result.user);
      setIsAuthView(false);
      setAuthSuccess(mode === "login" ? "Signed in successfully." : "Account created. You can start chatting now.");
    } catch (err) {
      setAuthError(err.message || "Authentication failed");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("rag_token");
    localStorage.removeItem("rag_user");
    setToken("");
    setUser(null);
    setIsAuthView(true);
    setEmail("");
    setPassword("");
    setAuthError("");
    setAuthSuccess("");
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

    assistantMessageIdRef.current = assistantMessage.id;
    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    setQuestion("");
    submit(trimmedQuestion);
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
  };

  if (isAuthView) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,_rgba(255,177,102,0.22),transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(124,198,255,0.18),transparent_30%),#f7efe2] p-4 font-mono text-[#1a2420]">
        <div className="w-full max-w-md rounded-[20px] border-[3px] border-[#00c2e0] bg-[#f4f6f2] p-6 shadow-[0_0_20px_rgba(0,194,224,0.2)]">
          <div className="mb-5 text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#00a3bf]">Secure Access</p>
            <h2 className="mt-2 text-2xl font-bold uppercase tracking-tight">{mode === "login" ? "Login" : "Register"}</h2>
            <p className="mt-2 text-sm text-[#5a5f5c]">Use your MongoDB-backed account to continue.</p>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-3">
            <label className="block text-sm font-semibold uppercase tracking-wide text-[#2f3b37]">
              Email
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-[8px] border border-[#cfd4ce] bg-white px-3 py-2 text-sm outline-none ring-0"
                required
              />
            </label>

            <label className="block text-sm font-semibold uppercase tracking-wide text-[#2f3b37]">
              Password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-[8px] border border-[#cfd4ce] bg-white px-3 py-2 text-sm outline-none ring-0"
                required
              />
            </label>

            {authError ? <p className="text-sm font-semibold text-[#c41212]">{authError}</p> : null}
            {authSuccess ? <p className="text-sm font-semibold text-[#0f9e6e]">{authSuccess}</p> : null}

            <button
              type="submit"
              className="w-full rounded-[8px] border-[3px] border-[#00c2e0] bg-[#eafcff] px-3.5 py-2.5 text-sm font-bold uppercase tracking-wide text-[#00a3bf] shadow-[0_0_10px_rgba(0,194,224,0.25)]"
            >
              {mode === "login" ? "Sign In" : "Create Account"}
            </button>
          </form>

          <div className="mt-4 flex items-center justify-between text-sm">
            <button
              type="button"
              onClick={() => {
                setMode(mode === "login" ? "register" : "login");
                setAuthError("");
                setAuthSuccess("");
              }}
              className="font-semibold text-[#00a3bf] underline"
            >
              {mode === "login" ? "Need an account? Register" : "Already have one? Login"}
            </button>
            <span className="text-[#5a5f5c]">{user?.email || "Guest"}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(255,177,102,0.22),transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(124,198,255,0.18),transparent_30%),#f7efe2] font-mono text-[#1a2420]">
      <div
        className="pointer-events-none absolute -top-32 -left-20 h-80 w-80 rounded-full opacity-10 blur-3xl bg-retrieve animate-driftA"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-24 -right-10 h-96 w-96 rounded-full opacity-10 blur-3xl bg-generate animate-driftB"
        aria-hidden="true"
      />

      <div className="relative mx-auto flex h-full w-full max-w-4xl flex-col px-4 py-4 sm:px-6 lg:px-8">
        <div className="relative mb-4 flex flex-wrap items-center justify-between gap-3 rounded-[10px] border-[3px] border-[#00c2e0] bg-[#f4f6f2] p-4 shadow-[0_0_16px_rgba(0,194,224,0.25)]">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.25em] text-[#00a3bf]">
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: "#00c2e0", boxShadow: "0 0 6px #00c2e0" }}
              />
              Retrieval-Augmented Console
            </div>
            <h1
              className="mt-2 text-3xl font-bold uppercase leading-tight tracking-tight sm:text-4xl"
              style={{ textShadow: "0 0 12px rgba(255,47,160,0.35)" }}
            >
              Ask <span style={{ color: "#ff2fa0" }}>Anything Here</span>
              <span style={{ color: "#00c2e0" }}>.</span>
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setAnimationsEnabled((prev) => !prev)}
              className={`rounded-[6px] border-[3px] px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide transition-all duration-150 active:translate-y-0.5 ${animationsEnabled
                  ? "border-[#ff2d2d] bg-[#fff0f8] text-[#c41212] shadow-[0_0_10px_rgba(255,47,160,0.4)]"
                  : "border-[#8a8f8c] bg-[#e8eae6] text-[#5a5f5c] shadow-none"
                }`}
            >
              Battle Mode: {animationsEnabled ? "On" : "Off"}
            </button>

            <button
              type="button"
              onClick={toggleModal}
              className="rounded-[6px] border-[3px] border-[#00c2e0] bg-[#eafcff] px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide text-[#00a3bf] shadow-[0_0_10px_rgba(0,194,224,0.35)] transition-all duration-150 hover:bg-[#dcf7fb] active:translate-y-0.5 active:shadow-none"
            >
              Clear Chat
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-[6px] border-[3px] border-[#ff2d2d] bg-[#fff0f8] px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide text-[#c41212] shadow-[0_0_10px_rgba(255,47,160,0.25)]"
            >
              Logout
            </button>
          </div>
        </div>

        <div
          className="relative z-0 flex-1 min-h-0 overflow-hidden rounded-[28px] border-[10px] bg-black p-3 sm:p-4"
          style={{
            borderColor: "#2b2b2e",
            boxShadow: "inset 0 0 40px rgba(0,0,0,0.8), inset 0 2px 0 rgba(255,255,255,0.06), 0 8px 20px rgba(0,0,0,0.25)",
          }}
        >
          {/* scanline texture on the actual "screen" */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage: "repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 3px)",
            }}
            aria-hidden="true"
          />
          {/* power LED, bottom-right of the bezel */}
          <span
            className="pointer-events-none absolute bottom-[-7px] right-5 h-2 w-2 rounded-full"
            style={{ backgroundColor: "#00c2e0", boxShadow: "0 0 6px #00c2e0, 0 0 2px #00c2e0" }}
            aria-hidden="true"
          />

          <div className="relative flex h-full flex-col">
            <div ref={messagesContainerRef} className="flex-1 min-h-0 space-y-3 overflow-y-auto px-1 pb-2">
              {messages.length === 0 ? (
                <div className="flex h-full min-h-[280px] flex-col items-center justify-center gap-2 rounded-[8px] border-[2px] border-dashed border-[#3a3a3d] bg-[#111113] p-6 text-center text-sm uppercase tracking-wide text-[#6a6f6c]">
                  <span className="text-2xl" aria-hidden="true">🕹️</span>
                  No Data — Ask A Question To Begin
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

            <div
              className="relative z-[110] mt-3 overflow-visible rounded-[16px] bg-[#e8e6df] p-3 shadow-[inset_0_2px_4px_rgba(0,0,0,0.15)]"
            >
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
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}