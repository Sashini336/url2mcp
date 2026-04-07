"use client";

import { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { useSettings, isValidApiKey } from "@/hooks/use-settings";
import { useHistory } from "@/hooks/use-history";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { CodeBlock } from "@/components/code-block";
import { Key, Trash2, Eye, EyeOff, Clock, ExternalLink, Shield, ArrowLeft, Download, X, FileCode } from "lucide-react";
import Link from "next/link";
import type { GenerationResult } from "@/types";

export default function Dashboard() {
  const { data: session, status: authStatus } = useSession();
  const { apiKey, maskedKey, hasKey, loaded, saveApiKey, clearApiKey } = useSettings();
  const { entries, getOutput, clearHistory } = useHistory();
  const [viewingOutput, setViewingOutput] = useState<{ entry: typeof entries[0]; output: GenerationResult } | null>(null);

  const [keyInput, setKeyInput] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  if (authStatus === "loading" || !loaded) {
    return (
      <div className="relative min-h-screen">
        <Nav />
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-[--accent] border-t-transparent" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="relative min-h-screen">
        <Nav />
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6">
          <p className="text-sm text-[--text-secondary]">Sign in to access your dashboard</p>
          <button
            onClick={() => signIn("github")}
            className="flex items-center gap-2 rounded-[8px] px-5 py-2.5 text-sm font-semibold"
            style={{
              background: "linear-gradient(135deg, var(--accent), var(--accent-dark))",
              color: "var(--bg-primary)",
            }}
          >
            Sign in with GitHub
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const handleSave = () => {
    setError("");
    setSaved(false);
    const result = saveApiKey(keyInput);
    if (result.success) {
      setKeyInput("");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } else {
      setError(result.error || "Failed to save");
    }
  };

  const handleClear = () => {
    clearApiKey();
    setKeyInput("");
    setError("");
    setSaved(false);
  };

  const formatDate = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const handleViewOutput = (entry: typeof entries[0]) => {
    const output = getOutput(entry.id);
    if (output) {
      setViewingOutput({ entry, output });
    }
  };

  const handleRedownload = async (entry: typeof entries[0]) => {
    const output = getOutput(entry.id);
    if (!output) return;
    const JSZip = (await import("jszip")).default;
    const zip = new JSZip();
    for (const [path, content] of Object.entries(output.files)) {
      zip.file(path, content);
    }
    zip.file("claude_desktop_config.json", JSON.stringify(output.config, null, 2));
    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${output.metadata.name}.zip`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative min-h-screen">
      <Nav />
      <div className="mx-auto max-w-[700px] px-6 pb-16 pt-10">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1.5 text-xs text-[--text-tertiary] transition-colors hover:text-[--text-secondary]"
        >
          <ArrowLeft size={12} />
          Back to generator
        </Link>

        <h1 className="mb-1 text-xl font-bold tracking-[-0.02em]">Dashboard</h1>
        <p className="mb-8 text-[13px] text-[--text-secondary]">
          Manage your API key and view generation history
        </p>

        {/* API Key Section */}
        <section
          className="mb-6 rounded-[14px] p-6"
          style={{
            background: "var(--bg-elevated)",
            border: "1px solid var(--border-subtle)",
          }}
        >
          <div className="mb-4 flex items-center gap-2">
            <Key size={16} className="text-[--accent]" />
            <h2 className="text-sm font-semibold">API Key</h2>
          </div>

          {hasKey ? (
            <div>
              <div
                className="mb-3 flex items-center justify-between rounded-[8px] px-3 py-2.5"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid var(--border-subtle)",
                }}
              >
                <span className="font-mono text-xs text-[--text-secondary]">
                  {showKey ? apiKey : maskedKey}
                </span>
                <button
                  onClick={() => setShowKey(!showKey)}
                  className="text-[--text-tertiary] transition-colors hover:text-[--text-secondary]"
                >
                  {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleClear}
                  className="flex items-center gap-1.5 rounded-[6px] px-3 py-1.5 text-[11px] font-medium text-red-400 transition-colors hover:bg-red-400/10"
                  style={{ border: "1px solid rgba(248,113,113,0.15)" }}
                >
                  <Trash2 size={11} />
                  Remove key
                </button>
                <span className="flex items-center gap-1 text-[10px] text-[--accent]">
                  <Shield size={10} />
                  Stored locally in your browser only
                </span>
              </div>
            </div>
          ) : (
            <div>
              <p className="mb-3 text-xs text-[--text-secondary]">
                Add your Anthropic API key for unlimited generations. Your key is stored
                in your browser only — it is never saved on our servers.
              </p>
              <div className="mb-2 flex gap-2">
                <input
                  type="password"
                  placeholder="sk-ant-..."
                  value={keyInput}
                  onChange={(e) => {
                    setKeyInput(e.target.value);
                    setError("");
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && keyInput.trim()) handleSave();
                  }}
                  className="flex-1 rounded-[8px] bg-transparent px-3 py-2 font-mono text-xs text-[--text-primary] placeholder:text-[--text-tertiary] outline-none"
                  style={{ border: "1px solid var(--border-default)" }}
                />
                <button
                  onClick={handleSave}
                  disabled={!keyInput.trim()}
                  className="rounded-[8px] px-4 py-2 text-xs font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-40"
                  style={{
                    background: keyInput.trim()
                      ? "linear-gradient(135deg, var(--accent), var(--accent-dark))"
                      : "rgba(255,255,255,0.03)",
                    color: keyInput.trim() ? "var(--bg-primary)" : "var(--text-tertiary)",
                  }}
                >
                  Save
                </button>
              </div>
              {error && (
                <p className="text-[11px] text-red-400">{error}</p>
              )}
              {saved && (
                <p className="text-[11px] text-[--accent]">Key saved successfully</p>
              )}
              <div className="mt-2 flex items-center gap-1 text-[10px] text-[--text-tertiary]">
                <Shield size={10} />
                Your key never leaves your browser. It&apos;s sent directly to Anthropic&apos;s API during generation and is never logged or stored on our servers.
              </div>
            </div>
          )}
        </section>

        {/* Generation History */}
        <section
          className="rounded-[14px] p-6"
          style={{
            background: "var(--bg-elevated)",
            border: "1px solid var(--border-subtle)",
          }}
        >
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-[--accent]" />
              <h2 className="text-sm font-semibold">Generation History</h2>
            </div>
            {entries.length > 0 && (
              <button
                onClick={clearHistory}
                className="text-[10px] text-[--text-tertiary] transition-colors hover:text-red-400"
              >
                Clear all
              </button>
            )}
          </div>

          {entries.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-xs text-[--text-tertiary]">No generations yet</p>
              <Link
                href="/"
                className="mt-2 inline-block text-xs text-[--accent] transition-opacity hover:opacity-80"
              >
                Generate your first MCP server
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between rounded-[8px] px-3.5 py-3 transition-colors"
                  style={{
                    background: "rgba(255,255,255,0.015)",
                    border: "1px solid var(--border-subtle)",
                  }}
                >
                  <div className="min-w-0 flex-1">
                    <div className="mb-0.5 flex items-center gap-2">
                      <span className="text-xs font-semibold text-[--text-primary]">
                        {entry.apiName}
                      </span>
                      <span
                        className="rounded-[3px] px-1.5 py-px font-mono text-[9px] font-semibold"
                        style={{
                          background: "var(--accent-bg)",
                          border: "1px solid var(--accent-border)",
                          color: "var(--accent)",
                        }}
                      >
                        {entry.toolsCount} tools
                      </span>
                      <span className="rounded-[3px] px-1.5 py-px font-mono text-[9px]" style={{ color: "var(--text-tertiary)" }}>
                        {entry.authType}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="truncate font-mono text-[10px] text-[--text-tertiary]">
                        {entry.url}
                      </span>
                    </div>
                  </div>
                  <div className="ml-3 flex shrink-0 items-center gap-2">
                    {entry.hasOutput && (
                      <>
                        <button
                          onClick={() => handleViewOutput(entry)}
                          className="flex items-center gap-1 rounded-[5px] px-2 py-1 text-[9px] font-medium transition-colors"
                          style={{ border: "1px solid var(--border-subtle)", color: "var(--text-secondary)" }}
                          title="View generated code"
                        >
                          <FileCode size={10} />
                          View
                        </button>
                        <button
                          onClick={() => handleRedownload(entry)}
                          className="flex items-center gap-1 rounded-[5px] px-2 py-1 text-[9px] font-medium transition-colors"
                          style={{ border: "1px solid var(--accent-border)", color: "var(--accent)" }}
                          title="Re-download ZIP"
                        >
                          <Download size={10} />
                        </button>
                      </>
                    )}
                    <span className="text-[10px] text-[--text-tertiary]">
                      {formatDate(entry.timestamp)}
                    </span>
                    <a
                      href={entry.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[--text-tertiary] transition-colors hover:text-[--text-secondary]"
                    >
                      <ExternalLink size={11} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Output Viewer Modal */}
      {viewingOutput && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
          onClick={() => setViewingOutput(null)}
        >
          <div
            className="relative w-full max-w-[800px] max-h-[85vh] overflow-hidden rounded-[14px] flex flex-col"
            style={{ background: "var(--bg-primary)", border: "1px solid var(--border-default)" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between px-5 py-3.5" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
              <div>
                <h3 className="text-sm font-semibold">{viewingOutput.entry.apiName}</h3>
                <p className="text-[11px] text-[--text-tertiary]">
                  {viewingOutput.output.metadata.tools_count} tools, {viewingOutput.output.metadata.auth_type.replace("_", " ")} auth
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleRedownload(viewingOutput.entry)}
                  className="flex items-center gap-1.5 rounded-[8px] px-3 py-1.5 text-[11px] font-semibold"
                  style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-dark))", color: "var(--bg-primary)" }}
                >
                  <Download size={12} /> Download ZIP
                </button>
                <button
                  onClick={() => setViewingOutput(null)}
                  className="rounded-[6px] p-1.5 text-[--text-tertiary] transition-colors hover:text-[--text-primary]"
                  style={{ border: "1px solid var(--border-subtle)" }}
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* File tabs */}
            <div className="flex gap-0.5 overflow-x-auto px-5 pt-3" style={{ background: "rgba(255,255,255,0.01)" }}>
              {[...Object.keys(viewingOutput.output.files), "claude_desktop_config.json"].map((filename) => (
                <button
                  key={filename}
                  onClick={() => {
                    // Use a data attribute to track active file in the modal
                    const modal = document.getElementById("output-viewer-code");
                    if (modal) modal.setAttribute("data-file", filename);
                    // Force re-render by updating state
                    setViewingOutput({ ...viewingOutput });
                  }}
                  className="shrink-0 rounded-t-[6px] px-3 py-1.5 text-[10px] font-medium transition-colors"
                  style={{
                    color: "var(--text-secondary)",
                    borderBottom: "1px solid transparent",
                  }}
                >
                  {filename}
                </button>
              ))}
            </div>

            {/* Code viewer */}
            <div className="flex-1 overflow-auto px-5 pb-5 pt-2">
              <CodeBlock
                code={viewingOutput.output.files["src/index.ts"] || Object.values(viewingOutput.output.files)[0] || ""}
                lang="typescript"
                filename={Object.keys(viewingOutput.output.files).find(f => f.includes("index")) || Object.keys(viewingOutput.output.files)[0] || ""}
              />
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
