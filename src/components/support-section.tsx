"use client";

import { Heart, Coffee } from "lucide-react";

const BUYMEACOFFEE_URL = "https://buymeacoffee.com/sa6ko";

export function SupportSection() {
  return (
    <section id="support" className="relative z-10 py-16">
      <div className="mx-auto max-w-[1100px] px-6">
        <div className="mb-8 text-center">
          <h2 className="mb-1.5 text-[22px] font-bold tracking-[-0.02em]">
            Support the project
          </h2>
          <p className="mx-auto max-w-[420px] text-[13px] leading-relaxed text-[--text-secondary]">
            url2mcp is free and open source. If it saves you time, consider supporting development.
          </p>
        </div>

        <div className="mx-auto flex max-w-[320px] justify-center">
          <a
            href={BUYMEACOFFEE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex w-full flex-col items-center gap-3 rounded-[14px] p-6 transition-all duration-200 hover:-translate-y-0.5"
            style={{
              background: "rgba(219, 39, 119, 0.04)",
              border: "1px solid rgba(219, 39, 119, 0.12)",
            }}
          >
            <div
              className="flex h-10 w-10 items-center justify-center rounded-[10px]"
              style={{
                background: "rgba(219, 39, 119, 0.08)",
                border: "1px solid rgba(219, 39, 119, 0.15)",
              }}
            >
              <Coffee size={18} className="text-pink-400" />
            </div>
            <div className="text-center">
              <div className="mb-1 text-sm font-semibold text-[--text-primary]">Buy Me a Coffee</div>
              <p className="text-[11px] text-[--text-tertiary]">One-time or monthly support</p>
            </div>
            <span
              className="flex items-center gap-1.5 rounded-[8px] px-5 py-2 text-xs font-semibold transition-colors group-hover:border-[rgba(219,39,119,0.3)]"
              style={{
                background: "rgba(219, 39, 119, 0.08)",
                border: "1px solid rgba(219, 39, 119, 0.15)",
                color: "#f472b6",
              }}
            >
              <Heart size={13} />
              Support
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
