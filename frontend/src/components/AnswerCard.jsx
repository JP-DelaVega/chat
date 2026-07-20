import { useUser } from "@clerk/clerk-react";

export default function AnswerCard({ role = "assistant", content = "", isLoading = false, errorMsg = "", animationsEnabled = false }) {
  const { user } = useUser();

  const isUser = role === "user";
  const isError = Boolean(errorMsg);

  const displayText = isUser
    ? content
    : isError
      ? errorMsg
      : content || (isLoading ? "PROCESSING_INPUT..." : "SYSTEM_READY");


  // Retro Windows Bevel Classes
  const raisedStyle =
    "bg-[#c9c5b8] rounded-sm shadow-[0_2px_6px_rgba(0,0,0,0.18)]";

  const sunkenStyle =
    "bg-[#ddd8c8] rounded-sm shadow-[0_2px_6px_rgba(0,0,0,0.12)]";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div className={`w-full max-w-100 p-1 ${isUser ? sunkenStyle : raisedStyle}`}>

        {/* Window Title Bar */}
        <div className={`flex items-center justify-between px-2 py-0.5 mb-1 ${isUser ? "bg-[#808080]" : isError ? "bg-[#800000]" : "bg-[#000080]"
          }`}>
          <span className={`text-[10px] font-bold uppercase tracking-widest ${isUser ? "text-black" : "text-white"}`}>
            {isUser ? user.firstName : "SYSTEM_OUT"}
          </span>
        </div>

        {/* Content Area */}
        <div className="p-2 font-mono text-sm text-black">
          <div className="flex items-start gap-2">
            <span className="font-bold relative inline-flex w-5 h-5 items-center justify-center">
              {isUser ? (
                <>
                  <span
                    className="absolute inset-0 flex items-center justify-center transition-all duration-300 ease-in-out"
                    style={{
                      opacity: animationsEnabled ? 0 : 1,
                      transform: animationsEnabled ? "scale(0.5)" : "scale(1)",
                    }}
                  >
                    <span className="hover:opacity-70 transition-opacity duration-300">{">"}</span>
                  </span>
                  <img
                    src="/pacman.gif"
                    alt="cat"
                    className="absolute inset-0 w-5 h-5 object-contain transition-all duration-300 ease-in-out transform hover:scale-150"
                    style={{
                      opacity: animationsEnabled ? 1 : 0,
                      transform: animationsEnabled ? "scale(1)" : "scale(0.5)",
                    }}
                  />
                </>
              ) : (
                <>
                  <span
                    className="absolute inset-0 flex items-center justify-center transition-all duration-300 ease-in-out"
                    style={{
                      opacity: animationsEnabled ? 0 : 1,
                      transform: animationsEnabled ? "scale(0.5)" : "scale(1)",
                    }}
                  >
                    <span className="hover:opacity-70 transition-opacity duration-300">{"#"}</span>
                  </span>
                  <span className="absolute inset-0">
                    <img
                      src="/ghost.png"
                      alt="reaper"
                      className="absolute inset-0 w-5 h-5 object-contain transition-all duration-300 ease-in-out transform hover:scale-150"
                      style={{
                        opacity: animationsEnabled && !isError ? 1 : 0,
                        transform: animationsEnabled && !isError ? "scale(1)" : "scale(0.5)",
                      }}
                    />
                    <img
                      src="/dead_ghost.png"
                      alt="reaper defeated"
                      className="absolute inset-0 w-5 h-5 object-contain transition-all duration-300 ease-in-out transform hover:scale-150"
                      style={{
                        opacity: animationsEnabled && isError ? 1 : 0,
                        transform: animationsEnabled && isError ? "scale(1)" : "scale(0.5)",
                      }}
                    />
                  </span>
                </>
              )}
            </span>

            <div className="wrap-break-word leading-snug">
              {displayText}
              {isLoading && !isUser && (
                <span className="ml-1 inline-block h-3 w-1.25 bg-black animate-pulse" />
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}