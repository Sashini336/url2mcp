"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "url2mcp_history";
const MAX_ENTRIES = 20;

export interface HistoryEntry {
  id: string;
  url: string;
  apiName: string;
  toolsCount: number;
  authType: string;
  timestamp: number;
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

  const addEntry = useCallback((entry: Omit<HistoryEntry, "id" | "timestamp">) => {
    setEntries((prev) => {
      const newEntry: HistoryEntry = {
        ...entry,
        id: crypto.randomUUID(),
        timestamp: Date.now(),
      };
      const updated = [newEntry, ...prev].slice(0, MAX_ENTRIES);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // storage full — keep going without persistence
      }
      return updated;
    });
  }, []);

  const clearHistory = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setEntries([]);
  }, []);

  return { entries, loaded, addEntry, clearHistory };
}
