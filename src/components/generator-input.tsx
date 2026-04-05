"use client";

import { useState } from "react";
import { Globe, ArrowRight, Loader2, Key, ChevronDown } from "lucide-react";

interface GeneratorInputProps {
  url: string;
  onUrlChange: (url: string) => void;
  onGenerate: () => void;
  generating: boolean;
  apiKey: string;
  onApiKeyChange: (key: string) => void;
}

const TRY_APIS = [
  { label: "Stripe", url: "https://docs.stripe.com/api" },
  { label: "GitHub", url: "https://docs.github.com/en/rest" },
  { label: "Notion", url: "https://developers.notion.com/reference" },
];

export function GeneratorInput({ url, onUrlChange, onGenerate, generating, apiKey, onApiKeyChange }: GeneratorInputProps) {
  const [showByok, setShowByok] = useState(false);
  const canGenerate = url.trim().length > 0 && !generating;

  return (
    <div className="w-full max-w-[440px]">
      <div
        className="flex items-center rounded-[11px] p-[3px] transition-all duration-300"
        style={{
          background: "rgba(255,255,255,0.025)",
          border: generating ? "1px solid rgba(0,255,136,0.22)" : "1px solid rgba(255,255,255,0.07)",
          boxShadow: generating ? "0 0 24px rgba(0,255,136,0.06)" : "none",
        }}
      >
        <div className="flex items-center px-2.5 pl-3 text-[--text-tertiary]">
          <Globe size={15} aria-hidden="true" />
        </div>
        <input
          type="url"
          name="api-docs-url"
          aria-label="API documentation URL"
          autoComplete="off"
          placeholder="https://docs.stripe.com/api"
          value={url}
          onChange={(e) => onUrlChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && canGenerate && onGenerate()}
          disabled={generating}
          className="flex-1 bg-transparent py-2.5 font-mono text-xs text-[--text-primary] placeholder:text-[--text-tertiary] outline-none disabled:opacity-50"
        />
        <button
          onClick={onGenerate}
          disabled={!canGenerate}
          className="flex items-center gap-1.5 whitespace-nowrap rounded-[8px] px-4 py-2 text-xs font-semibold transition-all duration-200 disabled:cursor-not-allowed"
          style={{
            background: canGenerate ? "linear-gradient(135deg, var(--accent), var(--accent-dark))" : "rgba(255,255,255,0.03)",
            color: canGenerate ? "var(--bg-primary)" : "var(--text-tertiary)",
          }}
        >
          {generating ? (
            <><Loader2 size={13} className="animate-spin" /><span>Generating...</span></>
          ) : (
            <><span>Generate</span><ArrowRight size={13} /></>
          )}
        </button>
      </div>

      <div className="mt-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2 font-mono text-[10px] text-[--text-tertiary]">
          <span>Try:</span>
          {TRY_APIS.map((api) => (
            <button
              key={api.label}
              onClick={() => onUrlChange(api.url)}
              className="rounded-[4px] border border-[--border-subtle] bg-[rgba(255,255,255,0.03)] px-2 py-0.5 text-[--text-secondary] transition-colors hover:border-[--border-default] hover:text-[--text-primary]"
            >
              {api.label}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowByok(!showByok)}
          className="flex items-center gap-1 text-[10px] text-[--text-tertiary] transition-colors hover:text-[--text-secondary]"
        >
          <Key size={10} />
          <span>BYOK</span>
          <ChevronDown size={10} className={`transition-transform ${showByok ? "rotate-180" : ""}`} />
        </button>
      </div>

      {showByok && (
        <div
          className="mt-2 rounded-[8px] p-2.5"
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid var(--border-subtle)",
          }}
        >
          <div className="flex items-center gap-2">
            <Key size={12} className="shrink-0 text-[--text-tertiary]" />
            <input
              type="password"
              placeholder="sk-ant-... (your Anthropic API key)"
              value={apiKey}
              onChange={(e) => onApiKeyChange(e.target.value)}
              className="flex-1 bg-transparent font-mono text-[11px] text-[--text-primary] placeholder:text-[--text-tertiary] outline-none"
            />
          </div>
          <p className="mt-1.5 text-[9px] text-[--text-tertiary]">
            Optional. Use your own key for unlimited generations. Never stored.
          </p>
        </div>
      )}
    </div>
  );
}
