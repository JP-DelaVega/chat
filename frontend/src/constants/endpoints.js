export const ENDPOINTS = [
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
