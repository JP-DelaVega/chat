import { API_BASE_URL } from "../config";

/**
 * Thrown for non-2xx responses so callers can distinguish HTTP failures
 * from network/parsing errors.
 */
export class RagApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "RagApiError";
    this.status = status;
  }
}

/**
 * Calls the streaming /ask/stream endpoint, invoking onChunk as text
 * arrives. Resolves once the stream completes.
 *
 * Assumes the backend yields raw text chunks (media_type="text/plain"),
 * not SSE framing. If the backend switches to SSE ("data: ...\n\n"),
 * this parsing would need to change accordingly.
 */
export async function askStream(
  question,
  dbName,
  { signal, onChunk, onFirstChunk } = {},
) {
  const res = await fetch(`${API_BASE_URL}/ask/stream`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, db_name: dbName }),

    signal,
  });

  if (!res.ok || !res.body) {
    throw new RagApiError(`Request failed (${res.status})`, res.status);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let receivedFirst = false;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    if (!chunk) continue;

    if (!receivedFirst) {
      receivedFirst = true;
      console.log("FIRST CHUNK RECEIVED");
      onFirstChunk?.();
    }
    console.log("CHUNK:", chunk);
    onChunk?.(chunk);
  }
}
