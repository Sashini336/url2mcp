"use client";

import { useState, useCallback } from "react";
import type { GenerationState, SSEEvent, DetectedEndpoint, OutputLanguage, AnalyzeResult } from "@/types";

const INITIAL_STATE: GenerationState = {
  status: "idle",
  step: 0,
  stepLabel: "",
  result: null,
  error: null,
  analyzedEndpoints: null,
};

export function useGeneration() {
  const [state, setState] = useState<GenerationState>(INITIAL_STATE);
  const [cachedUrl, setCachedUrl] = useState("");

  const analyze = useCallback(async (rawUrl: string, apiKey?: string) => {
    const url = rawUrl.trim();
    setCachedUrl(url);
    setState({ status: "generating", step: 1, stepLabel: "Fetching & analyzing docs...", result: null, error: null, analyzedEndpoints: null });

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, ...(apiKey?.trim() ? { apiKey: apiKey.trim() } : {}) }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: "Analysis failed" }));
        setState((prev) => ({ ...prev, status: "error", error: errorData.error || `HTTP ${res.status}` }));
        return;
      }

      const data: AnalyzeResult = await res.json();
      setState({
        status: "selecting",
        step: 2,
        stepLabel: `Found ${data.endpoints.length} endpoints`,
        result: null,
        error: null,
        analyzedEndpoints: data.endpoints,
      });
    } catch (err) {
      setState((prev) => ({ ...prev, status: "error", error: err instanceof Error ? err.message : "Network error" }));
    }
  }, []);

  const generate = useCallback(async (
    rawUrl: string,
    apiKey?: string,
    language: OutputLanguage = "typescript",
    selectedEndpoints?: string[]
  ) => {
    const url = rawUrl.trim() || cachedUrl;
    setState((prev) => ({
      ...prev,
      status: "generating",
      step: 2,
      stepLabel: "Generating server...",
      result: null,
      error: null,
    }));

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url,
          ...(apiKey?.trim() ? { apiKey: apiKey.trim() } : {}),
          language,
          ...(selectedEndpoints?.length ? { selectedEndpoints } : {}),
        }),
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
                setState((prev) => ({ ...prev, status: "complete", step: 4, stepLabel: "Ready", result: event.data }));
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
  }, [cachedUrl]);

  const reset = useCallback(() => setState(INITIAL_STATE), []);

  return { ...state, analyze, generate, reset };
}
