"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Check, ChevronDown, Search } from "lucide-react";
import type { DetectedEndpoint, OutputLanguage } from "@/types";

interface EndpointPickerProps {
  endpoints: DetectedEndpoint[];
  onGenerate: (selected: string[], language: OutputLanguage) => void;
  generating: boolean;
}

const METHOD_COLORS: Record<string, string> = {
  GET: "#61affe",
  POST: "#49cc90",
  PUT: "#fca130",
  PATCH: "#50e3c2",
  DELETE: "#f93e3e",
};

export function EndpointPicker({ endpoints, onGenerate, generating }: EndpointPickerProps) {
  const [selected, setSelected] = useState<Set<string>>(() => new Set(endpoints.map((e) => e.name)));
  const [search, setSearch] = useState("");
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(() => new Set(groups()));
  const [language, setLanguage] = useState<OutputLanguage>("typescript");

  function groups() {
    return [...new Set(endpoints.map((e) => e.group))];
  }

  const allGroups = useMemo(() => groups(), [endpoints]);

  const filtered = useMemo(() => {
    if (!search.trim()) return endpoints;
    const q = search.toLowerCase();
    return endpoints.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.path.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.group.toLowerCase().includes(q)
    );
  }, [endpoints, search]);

  const grouped = useMemo(() => {
    const map = new Map<string, DetectedEndpoint[]>();
    for (const e of filtered) {
      const arr = map.get(e.group) || [];
      arr.push(e);
      map.set(e.group, arr);
    }
    return map;
  }, [filtered]);

  const toggleEndpoint = (name: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const toggleGroup = (group: string) => {
    const groupEndpoints = endpoints.filter((e) => e.group === group);
    const allSelected = groupEndpoints.every((e) => selected.has(e.name));
    setSelected((prev) => {
      const next = new Set(prev);
      for (const e of groupEndpoints) {
        if (allSelected) next.delete(e.name);
        else next.add(e.name);
      }
      return next;
    });
  };

  const toggleGroupExpand = (group: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(group)) next.delete(group);
      else next.add(group);
      return next;
    });
  };

  const selectAll = () => setSelected(new Set(endpoints.map((e) => e.name)));
  const selectNone = () => setSelected(new Set());

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      {/* Header */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-[14px] font-semibold">
            {endpoints.length} endpoints detected
          </h3>
          <p className="text-[11px] text-[--text-tertiary]">
            Select which endpoints to include in your MCP server
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-[--text-tertiary]">{selected.size} selected</span>
          <button onClick={selectAll} className="rounded-[5px] px-2 py-0.5 text-[10px] font-medium text-[--text-secondary] transition-colors hover:text-[--text-primary]" style={{ border: "1px solid var(--border-subtle)" }}>
            All
          </button>
          <button onClick={selectNone} className="rounded-[5px] px-2 py-0.5 text-[10px] font-medium text-[--text-secondary] transition-colors hover:text-[--text-primary]" style={{ border: "1px solid var(--border-subtle)" }}>
            None
          </button>
        </div>
      </div>

      {/* Search */}
      <div
        className="mb-3 flex items-center gap-2 rounded-[8px] px-2.5 py-2"
        style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--border-subtle)" }}
      >
        <Search size={12} className="text-[--text-tertiary]" />
        <input
          type="text"
          placeholder="Filter endpoints..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-transparent text-[11px] text-[--text-primary] placeholder:text-[--text-tertiary] outline-none"
        />
      </div>

      {/* Endpoint groups */}
      <div className="mb-4 max-h-[340px] space-y-1.5 overflow-y-auto pr-1" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.1) transparent" }}>
        {allGroups.map((group) => {
          const groupEndpoints = grouped.get(group);
          if (!groupEndpoints) return null;
          const isExpanded = expandedGroups.has(group);
          const groupSelected = groupEndpoints.filter((e) => selected.has(e.name)).length;
          const allGroupSelected = groupSelected === groupEndpoints.length;

          return (
            <div key={group} className="rounded-[8px]" style={{ border: "1px solid var(--border-subtle)" }}>
              {/* Group header */}
              <div className="flex items-center gap-2 px-3 py-2">
                <button
                  onClick={() => toggleGroup(group)}
                  className="flex h-[16px] w-[16px] shrink-0 items-center justify-center rounded-[3px] transition-colors"
                  style={{
                    background: allGroupSelected ? "rgba(0,255,136,0.15)" : groupSelected > 0 ? "rgba(0,255,136,0.08)" : "rgba(255,255,255,0.03)",
                    border: `1px solid ${allGroupSelected ? "var(--accent)" : "rgba(255,255,255,0.1)"}`,
                  }}
                >
                  {allGroupSelected && <Check size={9} className="text-[--accent]" />}
                  {!allGroupSelected && groupSelected > 0 && <div className="h-1.5 w-1.5 rounded-sm bg-[--accent]" />}
                </button>
                <button onClick={() => toggleGroupExpand(group)} className="flex flex-1 items-center justify-between">
                  <span className="text-[11px] font-semibold text-[--text-primary]">{group}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] text-[--text-tertiary]">{groupSelected}/{groupEndpoints.length}</span>
                    <ChevronDown size={11} className={`text-[--text-tertiary] transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                  </div>
                </button>
              </div>

              {/* Endpoints */}
              {isExpanded && (
                <div className="border-t border-[rgba(255,255,255,0.03)] px-1 pb-1">
                  {groupEndpoints.map((ep) => (
                    <button
                      key={ep.name}
                      onClick={() => toggleEndpoint(ep.name)}
                      className="flex w-full items-center gap-2 rounded-[5px] px-2 py-1.5 text-left transition-colors hover:bg-[rgba(255,255,255,0.02)]"
                    >
                      <div
                        className="flex h-[14px] w-[14px] shrink-0 items-center justify-center rounded-[3px] transition-colors"
                        style={{
                          background: selected.has(ep.name) ? "rgba(0,255,136,0.15)" : "rgba(255,255,255,0.03)",
                          border: `1px solid ${selected.has(ep.name) ? "var(--accent)" : "rgba(255,255,255,0.08)"}`,
                        }}
                      >
                        {selected.has(ep.name) && <Check size={8} className="text-[--accent]" />}
                      </div>
                      <span
                        className="shrink-0 rounded-[3px] px-1.5 py-px font-mono text-[8px] font-bold"
                        style={{ color: METHOD_COLORS[ep.method] || "var(--text-tertiary)" }}
                      >
                        {ep.method}
                      </span>
                      <span className="min-w-0 flex-1 truncate font-mono text-[10px] text-[--text-secondary]">{ep.path}</span>
                      <span className="hidden shrink-0 text-[9px] text-[--text-tertiary] sm:block">{ep.description}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Language toggle + Generate button */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1 rounded-[8px] p-0.5" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--border-subtle)" }}>
          {(["typescript", "python"] as OutputLanguage[]).map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className="rounded-[6px] px-3 py-1.5 text-[10px] font-semibold transition-colors"
              style={{
                background: language === lang ? "rgba(255,255,255,0.05)" : "transparent",
                color: language === lang ? "var(--text-primary)" : "var(--text-tertiary)",
              }}
            >
              {lang === "typescript" ? "TypeScript" : "Python"}
            </button>
          ))}
        </div>

        <button
          onClick={() => onGenerate([...selected], language)}
          disabled={selected.size === 0 || generating}
          className="flex items-center gap-1.5 rounded-[8px] px-5 py-2.5 text-xs font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-40"
          style={{
            background: selected.size > 0 && !generating
              ? "linear-gradient(135deg, var(--accent), var(--accent-dark))"
              : "rgba(255,255,255,0.03)",
            color: selected.size > 0 && !generating ? "var(--bg-primary)" : "var(--text-tertiary)",
          }}
        >
          Generate with {selected.size} endpoint{selected.size !== 1 ? "s" : ""}
        </button>
      </div>
    </motion.div>
  );
}
