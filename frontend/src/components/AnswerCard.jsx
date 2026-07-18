import { useUser } from "@clerk/clerk-react";

export default function AnswerCard({ role = "assistant", content = "", isLoading = false, errorMsg = "" }) {
  const { user } = useUser();

  const isUser = role === "user";
  const isError = Boolean(errorMsg);

  const displayText = isUser
    ? content
    : isError
      ? errorMsg
      : content || (isLoading ? "PROCESSING_INPUT..." : "SYSTEM_READY");


  // Retro Windows Bevel Classes
  const raisedStyle = "bg-[#c0c0c0] border-2 border-t-white border-l-white border-b-black border-r-black";
  const sunkenStyle = "bg-[#d9d5c7] border-2 border-t-black border-l-black border-b-white border-r-white";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div className={`w-full max-w-[400px] p-1 ${isUser ? sunkenStyle : raisedStyle}`}>

        {/* Window Title Bar */}
        <div className={`flex items-center justify-between px-2 py-0.5 mb-1 ${isUser ? "bg-[#808080]" : "bg-[#000080]"}`}>
          <span className={`text-[10px] font-bold uppercase tracking-widest ${isUser ? "text-black" : "text-white"}`}>
            {isUser ? user.firstName : "SYSTEM_OUT"}
          </span>
        </div>

        {/* Content Area */}
        <div className="p-2 font-mono text-sm text-black">
          <div className="flex items-start gap-2">
            <span className="font-bold">{isUser ? ">" : "#"}</span>
            <div className="break-words leading-snug">
              {displayText}
              {isLoading && !isUser && (
                <span className="ml-1 inline-block h-3 w-[5px] bg-black animate-pulse" />
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}