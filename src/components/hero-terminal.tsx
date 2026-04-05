"use client";

import { useEffect, useState } from "react";

const CODE_LINES = [
  { text: 'import { Server } from "@mcp/sdk";', delay: 0 },
  { text: "", delay: 400 },
  { text: "// Generated 3 tools from Stripe API", delay: 600, comment: true },
  { text: "const server = new Server({", delay: 900 },
  { text: '  name: "stripe-mcp",', delay: 1100 },
  { text: "  tools: [", delay: 1300 },
  { text: '    "create_payment",', delay: 1500 },
  { text: '    "list_customers",', delay: 1700 },
  { text: '    "get_balance"', delay: 1900 },
  { text: "  ]", delay: 2100 },
  { text: "});", delay: 2200 },
  { text: "", delay: 2400 },
  { text: "\u2713 Ready \u2014 3 tools, API key auth", delay: 2600, success: true },
];

export function HeroTerminal() {
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    CODE_LINES.forEach((_, i) => {
      timers.push(
        setTimeout(() => setVisibleLines(i + 1), CODE_LINES[i].delay + 500)
      );
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="relative" style={{ perspective: "800px" }}>
      {/* Glow backdrop */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(0,255,136,0.12), transparent 70%)",
          filter: "blur(60px)",
          transform: "scale(1.5)",
        }}
      />

      {/* Terminal window */}
      <div
        className="w-[360px] overflow-hidden rounded-xl"
        style={{
          background: "linear-gradient(145deg, #0c0c14, #111118)",
          border: "1px solid rgba(0,255,136,0.15)",
          transform: "rotateY(-6deg) rotateX(3deg)",
          boxShadow: "0 25px 60px rgba(0,0,0,0.5), 0 0 80px rgba(0,255,136,0.08)",
        }}
      >
        {/* Title bar */}
        <div
          className="flex items-center justify-between px-3.5 py-2.5"
          style={{
            borderBottom: "1px solid rgba(255,255,255,0.04)",
            background: "rgba(255,255,255,0.015)",
          }}
        >
          <div className="flex gap-1.5">
            <div className="h-[9px] w-[9px] rounded-full" style={{ background: "#ff5f57" }} />
            <div className="h-[9px] w-[9px] rounded-full" style={{ background: "#ffbd2e" }} />
            <div className="h-[9px] w-[9px] rounded-full" style={{ background: "#28c840" }} />
          </div>
          <span className="font-mono text-[9px] text-[--text-tertiary]">
            stripe-mcp / index.ts
          </span>
        </div>

        {/* Code content */}
        <div className="p-4 font-mono text-[11px] leading-[1.7]">
          {CODE_LINES.slice(0, visibleLines).map((line, i) => (
            <div key={i} className="min-h-[1.7em]">
              {line.success ? (
                <span className="font-semibold text-[--accent]">{line.text}</span>
              ) : line.comment ? (
                <span className="text-[--code-comment]">{line.text}</span>
              ) : (
                <CodeLine text={line.text} />
              )}
              {i === visibleLines - 1 && visibleLines < CODE_LINES.length && (
                <span
                  className="ml-0.5 inline-block h-[14px] w-[7px] translate-y-[2px] bg-[--accent]"
                  style={{ animation: "blink 1s step-end infinite" }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CodeLine({ text }: { text: string }) {
  if (!text) return null;

  // Tokenize then render as React elements (no dangerouslySetInnerHTML)
  const tokens = tokenize(text);
  return (
    <span style={{ color: "#a6accd" }}>
      {tokens.map((t, i) => (
        <span key={i} style={t.color ? { color: t.color } : undefined}>
          {t.text}
        </span>
      ))}
    </span>
  );
}

interface Token {
  text: string;
  color?: string;
}

function tokenize(text: string): Token[] {
  const tokens: Token[] = [];
  // Match keywords, class names, and strings in order
  const regex = /\b(import|from|const|new)\b|\b(Server)\b|"([^"]*)"/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    // Push any text before this match
    if (match.index > lastIndex) {
      tokens.push({ text: text.slice(lastIndex, match.index) });
    }

    if (match[1]) {
      // Keyword
      tokens.push({ text: match[0], color: "#c792ea" });
    } else if (match[2]) {
      // Class name
      tokens.push({ text: match[0], color: "#ffcb6b" });
    } else {
      // String (including quotes)
      tokens.push({ text: match[0], color: "#c3e88d" });
    }

    lastIndex = match.index + match[0].length;
  }

  // Push remaining text
  if (lastIndex < text.length) {
    tokens.push({ text: text.slice(lastIndex) });
  }

  return tokens;
}
