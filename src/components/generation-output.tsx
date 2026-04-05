"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Copy, Check, FileCode, Package } from "lucide-react";
import { CodeBlock } from "./code-block";
import type { GenerationResult } from "@/types";

interface GenerationOutputProps {
  step: number;
  status: "idle" | "generating" | "complete" | "error";
  stepLabel: string;
  result: GenerationResult | null;
  error: string | null;
}

const STEPS = [
  { n: 1, label: "Fetching docs" },
  { n: 2, label: "Analyzing endpoints" },
  { n: 3, label: "Generating server" },
  { n: 4, label: "Ready" },
];

export function GenerationOutput({ step, status, stepLabel, result, error }: GenerationOutputProps) {
  const [tab, setTab] = useState<"server" | "config">("server");
  const [configCopied, setConfigCopied] = useState(false);

  if (status === "idle") return null;

  const handleDownloadZip = async () => {
    if (!result) return;
    const JSZip = (await import("jszip")).default;
    const zip = new JSZip();
    for (const [path, content] of Object.entries(result.files)) {
      zip.file(path, content);
    }
    zip.file("claude_desktop_config.json", JSON.stringify(result.config, null, 2));
    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${result.metadata.name}.zip`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyConfig = () => {
    if (!result) return;
    navigator.clipboard.writeText(JSON.stringify(result.config, null, 2));
    setConfigCopied(true);
    setTimeout(() => setConfigCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="relative z-10 mx-auto max-w-[1100px] px-6 py-10"
      >
        {/* Section header */}
        <div className="mb-6">
          <h2 className="mb-1 text-lg font-bold">
            {status === "complete" && result
              ? `${result.metadata.name}`
              : status === "error"
                ? "Generation failed"
                : "Generating your MCP server..."}
          </h2>
          {status === "complete" && result && (
            <p className="text-[13px] text-[--text-secondary]">
              {result.metadata.description} &mdash; {result.metadata.tools_count} tools, {result.metadata.auth_type.replace("_", " ")} auth
            </p>
          )}
        </div>
        {/* Step indicators */}
        <div className="mb-5 flex flex-wrap gap-4">
          {STEPS.map((s) => (
            <div key={s.n} className="flex items-center gap-2">
              <div
                className="flex h-[22px] w-[22px] items-center justify-center rounded-full font-mono text-[9.5px] font-semibold transition-all duration-300"
                style={{
                  background: step >= s.n ? "rgba(0,255,136,0.12)" : "rgba(255,255,255,0.03)",
                  border: `1.5px solid ${step >= s.n ? "var(--accent)" : "rgba(255,255,255,0.07)"}`,
                  color: step >= s.n ? "var(--accent)" : "var(--text-tertiary)",
                }}
              >
                {step > s.n ? <Check size={10} /> : s.n}
              </div>
              <span
                className="text-[11.5px] transition-all duration-300"
                style={{
                  color: step >= s.n ? "var(--text-primary)" : "var(--text-tertiary)",
                  fontWeight: step === s.n ? 600 : 400,
                }}
              >
                {s.label}
                {step === s.n && s.n < 4 && <span className="text-[--accent]"> ...</span>}
              </span>
            </div>
          ))}
        </div>

        {/* Error state */}
        {status === "error" && error && (
          <div className="rounded-[14px] p-4" style={{ border: "1px solid rgba(239,68,68,0.2)", background: "rgba(239,68,68,0.05)" }}>
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* Complete state */}
        {status === "complete" && result && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: "easeOut" }}>
            {/* Stats bar */}
            <div className="mb-4 flex flex-wrap gap-2.5">
              {[
                { label: "TOOLS", value: String(result.metadata.tools_count) },
                { label: "AUTH", value: result.metadata.auth_type.replace("_", " ") },
                { label: "TRANSPORT", value: result.metadata.transport },
                { label: "LANG", value: "TypeScript" },
              ].map((stat) => (
                <div key={stat.label} className="min-w-[90px] flex-1 rounded-[9px] px-3 py-2" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)" }}>
                  <div className="font-mono text-[8.5px] uppercase tracking-[0.06em] text-[--text-tertiary]">{stat.label}</div>
                  <div className="text-[13px] font-semibold">{stat.value}</div>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div className="mb-3 flex w-fit gap-0.5 rounded-[10px] p-0.5" style={{ background: "rgba(255,255,255,0.02)" }}>
              {[
                { id: "server" as const, icon: FileCode, label: "Server Code" },
                { id: "config" as const, icon: Package, label: "Config" },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className="flex items-center gap-1.5 rounded-[6px] px-3 py-1.5 text-[11.5px] font-medium transition-colors"
                  style={{
                    background: tab === t.id ? "rgba(255,255,255,0.05)" : "transparent",
                    color: tab === t.id ? "var(--text-primary)" : "var(--text-tertiary)",
                  }}
                >
                  <t.icon size={12} /> {t.label}
                </button>
              ))}
            </div>

            <CodeBlock
              code={tab === "server" ? (result.files["src/index.ts"] || "") : JSON.stringify(result.config, null, 2)}
              lang={tab === "server" ? "typescript" : "json"}
              filename={tab === "server" ? "src/index.ts" : "claude_desktop_config.json"}
            />

            {/* Action buttons */}
            <div className="mt-3 flex gap-2.5">
              <button
                onClick={handleDownloadZip}
                className="flex items-center gap-1.5 rounded-[10px] px-4 py-2 text-xs font-semibold"
                style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-dark))", color: "var(--bg-primary)" }}
              >
                <Download size={13} /> Download ZIP
              </button>
              <button
                onClick={handleCopyConfig}
                className="flex items-center gap-1.5 rounded-[10px] px-4 py-2 text-xs font-semibold transition-colors"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-default)", color: "var(--text-primary)" }}
              >
                {configCopied ? <Check size={13} /> : <Copy size={13} />}
                {configCopied ? "Copied!" : "Copy Config"}
              </button>
            </div>
          </motion.div>
        )}
      </motion.section>
    </AnimatePresence>
  );
}
