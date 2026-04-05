"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "url2mcp_api_key";

// Only allow valid Anthropic key format
const API_KEY_PATTERN = /^sk-ant-[a-zA-Z0-9_-]{20,}$/;

export function isValidApiKey(key: string): boolean {
  return API_KEY_PATTERN.test(key.trim());
}

export function useSettings() {
  const [apiKey, setApiKeyState] = useState("");
  const [loaded, setLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && isValidApiKey(stored)) {
        setApiKeyState(stored);
      } else if (stored) {
        // Invalid key in storage — clear it
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // localStorage unavailable (incognito, etc.)
    }
    setLoaded(true);
  }, []);

  const saveApiKey = useCallback((key: string) => {
    const trimmed = key.trim();
    if (!trimmed) {
      localStorage.removeItem(STORAGE_KEY);
      setApiKeyState("");
      return { success: true };
    }
    if (!isValidApiKey(trimmed)) {
      return { success: false, error: "Invalid key format. Anthropic keys start with sk-ant-" };
    }
    try {
      localStorage.setItem(STORAGE_KEY, trimmed);
      setApiKeyState(trimmed);
      return { success: true };
    } catch {
      return { success: false, error: "Could not save — localStorage may be full or disabled" };
    }
  }, []);

  const clearApiKey = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setApiKeyState("");
  }, []);

  const hasKey = apiKey.length > 0;

  // Mask all but last 4 chars
  const maskedKey = hasKey
    ? `sk-ant-${"*".repeat(Math.max(0, apiKey.length - 11))}${apiKey.slice(-4)}`
    : "";

  return { apiKey, maskedKey, hasKey, loaded, saveApiKey, clearApiKey };
}
