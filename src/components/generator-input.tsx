"use client";

import { useState } from "react";
import { Globe, ArrowRight, Loader2, Key, Infinity, Shield } from "lucide-react";

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
  const [useOwnKey, setUseOwnKey] = useState(false);
  const canGenerate = url.trim().length > 0 && !generating;
  const hasKey = apiKey.trim().length > 0;

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
      </div>

      {/* BYOK toggle — always visible */}
      <div
        className="mt-3 rounded-[10px] p-3 transition-all duration-200"
        style={{
          background: useOwnKey ? "rgba(0,255,136,0.03)" : "rgba(255,255,255,0.015)",
          border: useOwnKey ? "1px solid rgba(0,255,136,0.12)" : "1px solid var(--border-subtle)",
        }}
      >
        <button
          onClick={() => setUseOwnKey(!useOwnKey)}
          className="flex w-full items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <Key size={13} className={useOwnKey ? "text-[--accent]" : "text-[--text-tertiary]"} />
            <span className="text-[11.5px] font-semibold" style={{ color: useOwnKey ? "var(--text-primary)" : "var(--text-secondary)" }}>
              Bring Your Own Key
            </span>
            {hasKey && useOwnKey && (
              <span className="rounded-[3px] px-1.5 py-px font-mono text-[8px] font-semibold" style={{ background: "var(--accent-bg)", border: "1px solid var(--accent-border)", color: "var(--accent)" }}>
                ACTIVE
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {!useOwnKey && (
              <span className="flex items-center gap-1 text-[9px] text-[--text-tertiary]">
                <Infinity size={9} />
                Unlimited generations
              </span>
            )}
            {/* Toggle switch */}
            <div
              className="relative h-[18px] w-[32px] rounded-full transition-all duration-200"
              style={{
                background: useOwnKey ? "rgba(0,255,136,0.25)" : "rgba(255,255,255,0.08)",
                border: `1px solid ${useOwnKey ? "rgba(0,255,136,0.3)" : "rgba(255,255,255,0.1)"}`,
              }}
            >
              <div
                className="absolute top-[2px] h-[12px] w-[12px] rounded-full transition-all duration-200"
                style={{
                  left: useOwnKey ? "16px" : "2px",
                  background: useOwnKey ? "var(--accent)" : "rgba(255,255,255,0.3)",
                }}
              />
            </div>
          </div>
        </button>

        {useOwnKey && (
          <div className="mt-3">
            <div
              className="flex items-center gap-2 rounded-[8px] px-2.5 py-2"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--border-subtle)" }}
            >
              <Key size={11} className="shrink-0 text-[--text-tertiary]" />
              <input
                type="password"
                placeholder="sk-ant-... (your Anthropic API key)"
                value={apiKey}
                onChange={(e) => onApiKeyChange(e.target.value)}
                className="flex-1 bg-transparent font-mono text-[11px] text-[--text-primary] placeholder:text-[--text-tertiary] outline-none"
              />
            </div>
            <div className="mt-2 flex items-center gap-3">
              <span className="flex items-center gap-1 text-[9px] text-[--text-tertiary]">
                <Shield size={9} />
                Never stored on our servers — sent directly to Anthropic
              </span>
              <span className="flex items-center gap-1 text-[9px] text-[--accent]">
                <Infinity size={9} />
                Unlimited
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
