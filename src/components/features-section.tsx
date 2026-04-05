"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Zap, Shield, Code2, Terminal, Globe, Lock } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Feature {
  icon: LucideIcon;
  title: string;
  desc: string;
  span: string;
  meta: string;
  graphic?: React.ReactNode;
}

const FEATURES: Feature[] = [
  {
    icon: Zap,
    title: "60s Generation",
    desc: "Paste a URL, get a complete MCP server with real endpoint implementations. Not a template — actual working code with real API calls.",
    span: "md:col-span-4 md:row-span-2",
    meta: "CORE",
    graphic: (
      <div className="mt-4 rounded-lg p-3 font-mono text-[10px] leading-relaxed" style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(0,255,136,0.08)" }}>
        <div style={{ color: "#546e7a" }}>$ url2mcp generate stripe</div>
        <div className="mt-1" style={{ color: "#c792ea" }}>Fetching docs...</div>
        <div style={{ color: "#c3e88d" }}>Found 42 endpoints</div>
        <div style={{ color: "#ffcb6b" }}>Grouped into 8 tools</div>
        <div className="mt-1 font-semibold" style={{ color: "#00ff88" }}>&#10003; stripe-mcp ready (1.2s)</div>
      </div>
    ),
  },
  {
    icon: Shield,
    title: "Auth Included",
    desc: "API key, OAuth2, Bearer — detected from your docs and wired in automatically.",
    span: "md:col-span-2 md:row-span-1",
    meta: "AUTO",
  },
  {
    icon: Code2,
    title: "TS & Python",
    desc: "Both outputs follow official MCP SDK best practices with full type safety.",
    span: "md:col-span-2 md:row-span-1",
    meta: "SDK",
  },
  {
    icon: Terminal,
    title: "Paste & Go",
    desc: "Ready-made claude_desktop_config.json. Copy, paste, restart Claude. That's it.",
    span: "md:col-span-3 md:row-span-1",
    meta: "QUICK",
  },
  {
    icon: Globe,
    title: "Any REST API",
    desc: "OpenAPI, raw docs, or a README. Our AI reads and understands any format.",
    span: "md:col-span-3 md:row-span-1",
    meta: "FLEX",
  },
  {
    icon: Lock,
    title: "Fully Yours",
    desc: "Nothing hosted. Full source code. Run it wherever you want. No vendor lock-in, no phone-home.",
    span: "md:col-span-6 md:row-span-1",
    meta: "OWN",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 120, damping: 14 },
  },
};

export function FeaturesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="features" ref={sectionRef} className="relative z-10 py-16">
      <div className="mx-auto max-w-[1100px] px-6">
        <div className="mb-10 text-center">
          <h2 className="mb-2 text-[22px] font-bold tracking-[-0.02em]">
            Not another scaffolder
          </h2>
          <p className="mx-auto max-w-[420px] text-[13px] leading-relaxed text-[--text-secondary]">
            Not boilerplate. Working server code with real implementations,
            auth, and deployment config.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={visible ? "visible" : "hidden"}
          className="grid grid-cols-1 gap-3 md:auto-rows-[minmax(120px,auto)] md:grid-cols-6"
        >
          {FEATURES.map((f) => (
            <motion.div
              key={f.title}
              variants={itemVariants}
              className={`group relative flex flex-col justify-between overflow-hidden rounded-[14px] p-5 transition-all duration-300 hover:-translate-y-0.5 ${f.span}`}
              style={{
                background: "var(--bg-elevated)",
                border: "1px solid var(--border-subtle)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.035)";
                e.currentTarget.style.borderColor = "rgba(0,255,136,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--bg-elevated)";
                e.currentTarget.style.borderColor = "var(--border-subtle)";
              }}
            >
              {/* Subtle gradient glow on hover */}
              <div
                className="pointer-events-none absolute inset-0 rounded-[14px] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  background: "radial-gradient(ellipse 60% 100% at 10% 0%, rgba(0,255,136,0.06), transparent 70%)",
                }}
              />

              <div className="relative z-10">
                <div className="mb-3 flex items-start justify-between">
                  <div
                    className="flex h-[38px] w-[38px] items-center justify-center rounded-lg"
                    style={{
                      background: "rgba(0,255,136,0.07)",
                      border: "1px solid var(--accent-border)",
                    }}
                  >
                    <f.icon size={17} className="text-[--accent]" />
                  </div>
                  <span
                    className="rounded-[3px] px-1.5 py-px font-mono text-[8px] font-semibold tracking-[0.08em]"
                    style={{
                      color: "var(--text-tertiary)",
                      border: "1px solid var(--border-subtle)",
                    }}
                  >
                    {f.meta}
                  </span>
                </div>
                <div className="mb-1.5 text-[14px] font-semibold">{f.title}</div>
                <div className="text-[12.5px] leading-relaxed text-[--text-secondary]">
                  {f.desc}
                </div>
                {f.graphic && f.graphic}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
