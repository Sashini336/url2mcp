"use client";

import { useState, useCallback } from "react";
import type { GenerationState, SSEEvent } from "@/types";

const INITIAL_STATE: GenerationState = {
  status: "idle",
  step: 0,
  stepLabel: "",
  result: null,
  error: null,
};

export function useGeneration() {
  const [state, setState] = useState<GenerationState>(INITIAL_STATE);

  const generate = useCallback(async (rawUrl: string, apiKey?: string) => {
    const url = rawUrl.trim();
    setState({ status: "generating", step: 0, stepLabel: "Starting...", result: null, error: null });

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, ...(apiKey?.trim() ? { apiKey: apiKey.trim() } : {}) }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: "Generation failed" }));
        setState((prev) => ({ ...prev, status: "error", error: errorData.error || `HTTP ${res.status}` }));
        return;
      }

      if (!res.body) {
        setState((prev) => ({ ...prev, status: "error", error: "No response body" }));
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";

        for (const chunk of lines) {
          const dataLine = chunk.trim();
          if (!dataLine.startsWith("data: ")) continue;

          try {
            const event: SSEEvent = JSON.parse(dataLine.slice(6));
            switch (event.type) {
              case "step":
                setState((prev) => ({ ...prev, step: event.step, stepLabel: event.label }));
                break;
              case "complete":
                setState({ status: "complete", step: 4, stepLabel: "Ready", result: event.data, error: null });
                break;
              case "error":
                setState((prev) => ({ ...prev, status: "error", error: event.message }));
                break;
            }
          } catch {
            // Skip malformed SSE events
          }
        }
      }
    } catch (err) {
      setState((prev) => ({ ...prev, status: "error", error: err instanceof Error ? err.message : "Network error" }));
    }
  }, []);

  const reset = useCallback(() => setState(INITIAL_STATE), []);

  return { ...state, generate, reset };
}
