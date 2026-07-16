import { API_BASE_URL } from "../config";

export class AuthApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "AuthApiError";
    this.status = status;
  }
}

async function requestJson(path, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new AuthApiError(data.detail || "Authentication request failed", res.status);
  }

  return data;
}

export async function loginUser(email, password) {
  return requestJson("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function registerUser(email, password) {
  return requestJson("/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function getCurrentUser(token) {
  return requestJson("/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
}
