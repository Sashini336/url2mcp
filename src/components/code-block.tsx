"use client";

import { useState, useEffect } from "react";
import { Copy, Check, Maximize2, Minimize2 } from "lucide-react";

interface CodeBlockProps {
  code: string;
  lang: string;
  filename: string;
}

let highlighterPromise: Promise<any> | null = null;

function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = import("shiki").then(({ createHighlighter }) =>
      createHighlighter({
        themes: ["material-theme-darker"],
        langs: ["typescript", "json", "python", "toml", "markdown"],
      })
    );
  }
  return highlighterPromise;
}

export function CodeBlock({ code, lang, filename }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [html, setHtml] = useState<string>("");

  useEffect(() => {
    getHighlighter().then((highlighter) => {
      const result = highlighter.codeToHtml(code, {
        lang: ["json", "python", "toml", "markdown"].includes(lang) ? lang : "typescript",
        theme: "material-theme-darker",
      });
      setHtml(result);
    });
  }, [code, lang]);

  const doCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="overflow-hidden rounded-xl" style={{ border: "1px solid var(--border-subtle)" }}>
      <div
        className="flex items-center justify-between px-4 py-2.5"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", background: "rgba(255,255,255,0.015)" }}
      >
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full" style={{ background: "#ff5f57" }} />
            <div className="h-2.5 w-2.5 rounded-full" style={{ background: "#ffbd2e" }} />
            <div className="h-2.5 w-2.5 rounded-full" style={{ background: "#28c840" }} />
          </div>
          <span className="ml-1.5 font-mono text-[11px] text-[--text-tertiary]">{filename}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1.5 rounded-[6px] px-2.5 py-1 font-mono text-[11px] transition-colors"
            style={{
              border: "1px solid var(--border-default)",
              background: "rgba(255,255,255,0.05)",
              color: "var(--text-secondary)",
            }}
          >
            {expanded ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
            {expanded ? "Collapse" : "Expand"}
          </button>
          <button
            onClick={doCopy}
            className="flex items-center gap-1.5 rounded-[6px] px-2.5 py-1 font-mono text-[11px] transition-colors"
            style={{
              border: "1px solid var(--border-default)",
              background: "rgba(255,255,255,0.05)",
              color: copied ? "var(--accent)" : "var(--text-secondary)",
            }}
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>
      <div className={`${expanded ? "max-h-[80vh]" : "max-h-[360px]"} overflow-auto p-4 transition-all`} style={{ background: "var(--bg-secondary)" }}>
        {html ? (
          <div
            className="font-mono text-[11px] leading-[1.7] [&_pre]:!bg-transparent [&_pre]:!p-0"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        ) : (
          <pre className="font-mono text-[11px] leading-[1.7] text-[--code-default] whitespace-pre-wrap">{code}</pre>
        )}
      </div>
    </div>
  );
}
