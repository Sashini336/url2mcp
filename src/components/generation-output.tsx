"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Copy, Check, Loader2, RotateCcw } from "lucide-react";
import { CodeBlock } from "./code-block";
import { EndpointPicker } from "./endpoint-picker";
import type { GenerationResult, DetectedEndpoint, OutputLanguage } from "@/types";

interface GenerationOutputProps {
  step: number;
  status: "idle" | "generating" | "complete" | "error" | "selecting";
  stepLabel: string;
  result: GenerationResult | null;
  error: string | null;
  onReset?: () => void;
  analyzedEndpoints?: DetectedEndpoint[] | null;
  onGenerateWithSelection?: (selected: string[], language: OutputLanguage) => void;
}

const STEPS = [
  { n: 1, label: "Fetching docs" },
  { n: 2, label: "Analyzing endpoints" },
  { n: 3, label: "Generating server" },
  { n: 4, label: "Ready" },
];

function getFileLanguage(filename: string): string {
  if (filename.endsWith(".ts") || filename.endsWith(".tsx")) return "typescript";
  if (filename.endsWith(".py")) return "python";
  if (filename.endsWith(".json")) return "json";
  if (filename.endsWith(".toml")) return "toml";
  if (filename.endsWith(".md")) return "markdown";
  return "typescript";
}

export function GenerationOutput({ step, status, stepLabel, result, error, onReset, analyzedEndpoints, onGenerateWithSelection }: GenerationOutputProps) {
  const [activeFile, setActiveFile] = useState<string>("");
  const [configCopied, setConfigCopied] = useState(false);

  // Build file list from result
  const fileEntries = useMemo(() => {
    if (!result) return [];
    const entries = Object.entries(result.files);
    // Add config as a virtual file
    entries.push(["claude_desktop_config.json", JSON.stringify(result.config, null, 2)]);
    return entries;
  }, [result]);

  // Set default active file when result arrives
  const currentFile = activeFile || (fileEntries.length > 0 ? fileEntries.find(([name]) => name.includes("index"))?.[0] || fileEntries[0][0] : "");

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

  const currentFileContent = fileEntries.find(([name]) => name === currentFile)?.[1] || "";
  const currentFileLang = getFileLanguage(currentFile);

  const progressPercent = status === "complete" ? 100 : status === "generating" ? Math.min((step / 4) * 100, 90) : 0;

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
                : status === "selecting"
                  ? "Select endpoints"
                  : "Generating your MCP server..."}
          </h2>
          {status === "complete" && result && (
            <p className="text-[13px] text-[--text-secondary]">
              {result.metadata.description} &mdash; {result.metadata.tools_count} tools, {result.metadata.auth_type.replace("_", " ")} auth
            </p>
          )}
          {status === "generating" && stepLabel && (
            <p className="flex items-center gap-2 text-[13px] text-[--accent]">
              <Loader2 size={13} className="animate-spin" />
              {stepLabel}
            </p>
          )}
        </div>

        {/* Progress bar (during generation) */}
        {status === "generating" && (
          <div className="mb-5 h-[3px] w-full overflow-hidden rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: "linear-gradient(90deg, var(--accent), var(--accent-dark))" }}
              initial={{ width: "0%" }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </div>
        )}

        {/* Step indicators */}
        <div className="mb-5 flex flex-wrap gap-4">
          {STEPS.map((s) => {
            const isActive = step === s.n && status === "generating";
            const isDone = step > s.n || (step === s.n && status === "complete");
            const isSelecting = status === "selecting" && step >= s.n;
            const isReached = step >= s.n || isSelecting;

            return (
              <div key={s.n} className="flex items-center gap-2">
                <div
                  className={`flex h-[22px] w-[22px] items-center justify-center rounded-full font-mono text-[9.5px] font-semibold transition-all duration-300 ${isActive ? "animate-pulse" : ""}`}
                  style={{
                    background: isReached ? "rgba(0,255,136,0.12)" : "rgba(255,255,255,0.03)",
                    border: `1.5px solid ${isReached ? "var(--accent)" : "rgba(255,255,255,0.07)"}`,
                    color: isReached ? "var(--accent)" : "var(--text-tertiary)",
                    boxShadow: isActive ? "0 0 12px rgba(0,255,136,0.25)" : "none",
                  }}
                >
                  {isDone ? (
                    <Check size={10} />
                  ) : isActive ? (
                    <Loader2 size={10} className="animate-spin" />
                  ) : (
                    s.n
                  )}
                </div>
                <span
                  className="text-[11.5px] transition-all duration-300"
                  style={{
                    color: isReached ? "var(--text-primary)" : "var(--text-tertiary)",
                    fontWeight: isActive ? 600 : 400,
                  }}
                >
                  {s.label}
                  {isActive && <span className="text-[--accent]"> ...</span>}
                </span>
              </div>
            );
          })}
        </div>

        {/* Endpoint selection state */}
        {status === "selecting" && analyzedEndpoints && onGenerateWithSelection && (
          <EndpointPicker
            endpoints={analyzedEndpoints}
            onGenerate={onGenerateWithSelection}
            generating={false}
          />
        )}

        {/* Loading skeleton (during generation) */}
        {status === "generating" && (
          <div className="space-y-3">
            {/* Fake stats bar skeleton */}
            <div className="flex flex-wrap gap-2.5">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="min-w-[90px] flex-1 rounded-[9px] px-3 py-2"
                  style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)" }}
                >
                  <div className="mb-1.5 h-2 w-10 animate-pulse rounded" style={{ background: "rgba(255,255,255,0.05)" }} />
                  <div className="h-3.5 w-14 animate-pulse rounded" style={{ background: "rgba(255,255,255,0.07)" }} />
                </div>
              ))}
            </div>
            {/* Fake code block skeleton */}
            <div className="overflow-hidden rounded-xl" style={{ border: "1px solid var(--border-subtle)" }}>
              <div className="flex items-center gap-2 px-4 py-2.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", background: "rgba(255,255,255,0.015)" }}>
                <div className="flex gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full" style={{ background: "rgba(255,95,87,0.3)" }} />
                  <div className="h-2.5 w-2.5 rounded-full" style={{ background: "rgba(255,189,46,0.3)" }} />
                  <div className="h-2.5 w-2.5 rounded-full" style={{ background: "rgba(40,200,64,0.3)" }} />
                </div>
                <div className="h-2.5 w-20 animate-pulse rounded" style={{ background: "rgba(255,255,255,0.05)" }} />
              </div>
              <div className="space-y-2 p-4" style={{ background: "var(--bg-secondary)" }}>
                {[100, 75, 90, 60, 85, 70, 50, 95, 65, 80].map((w, i) => (
                  <div
                    key={i}
                    className="h-3 animate-pulse rounded"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      width: `${w}%`,
                      animationDelay: `${i * 80}ms`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Error state */}
        {status === "error" && error && (
          <div className="rounded-[14px] p-4" style={{ border: "1px solid rgba(239,68,68,0.2)", background: "rgba(239,68,68,0.05)" }}>
            <p className="text-sm text-red-400">{error}</p>
            {onReset && (
              <button
                onClick={onReset}
                className="mt-3 flex items-center gap-1.5 rounded-[8px] px-3 py-1.5 text-xs font-medium transition-colors"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-default)", color: "var(--text-primary)" }}
              >
                <RotateCcw size={12} /> Try Again
              </button>
            )}
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
                { label: "LANG", value: result.metadata.language === "python" ? "Python" : "TypeScript" },
              ].map((stat) => (
                <div key={stat.label} className="min-w-[90px] flex-1 rounded-[9px] px-3 py-2" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)" }}>
                  <div className="font-mono text-[8.5px] uppercase tracking-[0.06em] text-[--text-tertiary]">{stat.label}</div>
                  <div className="text-[13px] font-semibold">{stat.value}</div>
                </div>
              ))}
            </div>

            {/* File browser tabs */}
            <div className="mb-3 flex w-full gap-0.5 overflow-x-auto rounded-[10px] p-0.5" style={{ background: "rgba(255,255,255,0.02)" }}>
              {fileEntries.map(([filename]) => (
                <button
                  key={filename}
                  onClick={() => setActiveFile(filename)}
                  className="flex shrink-0 items-center gap-1.5 rounded-[6px] px-3 py-1.5 text-[11px] font-medium transition-colors"
                  style={{
                    background: currentFile === filename ? "rgba(255,255,255,0.05)" : "transparent",
                    color: currentFile === filename ? "var(--text-primary)" : "var(--text-tertiary)",
                    borderBottom: currentFile === filename ? "1px solid var(--accent)" : "1px solid transparent",
                  }}
                >
                  {filename}
                </button>
              ))}
            </div>

            <CodeBlock
              code={currentFileContent}
              lang={currentFileLang}
              filename={currentFile}
            />

            {/* Action buttons */}
            <div className="mt-3 flex flex-wrap gap-2.5">
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
              {onReset && (
                <button
                  onClick={onReset}
                  className="flex items-center gap-1.5 rounded-[10px] px-4 py-2 text-xs font-semibold transition-colors"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-default)", color: "var(--text-secondary)" }}
                >
                  <RotateCcw size={13} /> Generate Another
                </button>
              )}
            </div>
          </motion.div>
        )}
      </motion.section>
    </AnimatePresence>
  );
}
