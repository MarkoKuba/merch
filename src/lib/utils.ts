import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "";
  const key = "sessionId";
  let sessionId = localStorage.getItem(key);
  if (!sessionId) {
    sessionId = Math.random().toString(36).substring(2, 15);
    localStorage.setItem(key, sessionId);
  }
  return sessionId;
}
