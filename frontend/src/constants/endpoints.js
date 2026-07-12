export const ENDPOINTS = [
  {
    id: "ask",
    path: "/ask",
    stream: false,
    hint: "Single response",
  },
  {
    id: "ask-stream",
    path: "/ask/stream",
    stream: true,
    hint: "Tokens as they arrive",
  },
];

export const PHASES = {
  IDLE: "idle",
  RETRIEVE: "retrieve",
  GENERATE: "generate",
  DONE: "done",
  STOPPED: "stopped",
  ERROR: "error",
};
