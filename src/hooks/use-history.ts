"use client";

import { useState, useEffect, useCallback } from "react";
import type { GenerationResult } from "@/types";

const STORAGE_KEY = "url2mcp_history";
const OUTPUT_KEY_PREFIX = "url2mcp_output_";
const MAX_ENTRIES = 20;

export interface HistoryEntry {
  id: string;
  url: string;
  apiName: string;
  toolsCount: number;
  authType: string;
  timestamp: number;
  hasOutput?: boolean;
}

export function useHistory() {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setEntries(parsed.slice(0, MAX_ENTRIES));
        }
      }
    } catch {
      // corrupt data — start fresh
      localStorage.removeItem(STORAGE_KEY);
    }
    setLoaded(true);
  }, []);

  const addEntry = useCallback((entry: Omit<HistoryEntry, "id" | "timestamp" | "hasOutput">, output?: GenerationResult) => {
    setEntries((prev) => {
      const id = crypto.randomUUID();
      const newEntry: HistoryEntry = {
        ...entry,
        id,
        timestamp: Date.now(),
        hasOutput: !!output,
      };
      const updated = [newEntry, ...prev].slice(0, MAX_ENTRIES);

      // Store the full output separately to avoid bloating the index
      if (output) {
        try {
          localStorage.setItem(`${OUTPUT_KEY_PREFIX}${id}`, JSON.stringify(output));
        } catch {
          // storage full — still save the entry without output
          newEntry.hasOutput = false;
        }
      }

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // storage full — keep going without persistence
      }

      // Clean up orphaned outputs for entries that got trimmed
      const trimmed = prev.slice(MAX_ENTRIES - 1);
      for (const old of trimmed) {
        try {
          localStorage.removeItem(`${OUTPUT_KEY_PREFIX}${old.id}`);
        } catch {
          // ignore
        }
      }

      return updated;
    });
  }, []);

  const getOutput = useCallback((id: string): GenerationResult | null => {
    try {
      const raw = localStorage.getItem(`${OUTPUT_KEY_PREFIX}${id}`);
      if (raw) return JSON.parse(raw) as GenerationResult;
    } catch {
      // corrupt — ignore
    }
    return null;
  }, []);

  const clearHistory = useCallback(() => {
    // Clean up all stored outputs
    for (const entry of entries) {
      try {
        localStorage.removeItem(`${OUTPUT_KEY_PREFIX}${entry.id}`);
      } catch {
        // ignore
      }
    }
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setEntries([]);
  }, [entries]);

  return { entries, loaded, addEntry, getOutput, clearHistory };
}
