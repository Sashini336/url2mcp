"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Globe, FileText, Zap, Check } from "lucide-react";

const STEPS = [
  { icon: Globe, step: "STEP 1", title: "Paste URL", desc: "Any API docs page, OpenAPI spec, or README" },
  { icon: FileText, step: "STEP 2", title: "Fetch & Extract", desc: "We scrape and parse the docs into structured data" },
  { icon: Zap, step: "STEP 3", title: "AI Analyzes", desc: "Claude identifies endpoints, groups tools, detects auth" },
  { icon: Check, step: "STEP 4", title: "Server Ready", desc: "Download ZIP, paste config into Claude Desktop" },
];

const STEP_DELAY = 600;

export function PipelineSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(-1);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          STEPS.forEach((_, i) => {
            setTimeout(() => setActiveStep(i), i * STEP_DELAY);
          });
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative z-10 py-12">
      <div className="mx-auto max-w-[1100px] px-6">
        <div className="mb-12 text-center">
          <h2 className="mb-2 text-[22px] font-bold tracking-[-0.02em]">From docs to server in four steps</h2>
          <p className="text-[13px] text-[--text-secondary]">No config. No boilerplate. Just paste and go.</p>
        </div>

        <div className="flex flex-col items-start gap-8 md:flex-row md:items-start md:justify-center md:gap-0">
          {STEPS.map((s, i) => (
            <div key={i} className="flex items-start md:flex-col md:items-center">
              <div className="flex flex-col items-center text-center">
                <motion.div
                  className="mb-3.5 flex h-14 w-14 items-center justify-center rounded-[14px]"
                  animate={{
                    background: activeStep >= i ? "rgba(0,255,136,0.08)" : "rgba(255,255,255,0.04)",
                    borderColor: activeStep >= i ? (i === 3 ? "rgba(0,255,136,0.3)" : "rgba(0,255,136,0.2)") : "rgba(255,255,255,0.1)",
                    boxShadow: activeStep >= i ? (i === 3 ? "0 0 30px rgba(0,255,136,0.12)" : "0 0 20px rgba(0,255,136,0.08)") : "none",
                  }}
                  style={{ border: "1.5px solid" }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <s.icon
                    size={24}
                    className="transition-colors duration-[400ms]"
                    style={{ color: activeStep >= i ? "var(--accent)" : "var(--text-secondary)" }}
                  />
                </motion.div>
                <div
                  className="mb-1 font-mono text-[9px] font-semibold uppercase tracking-[0.06em] transition-colors duration-[400ms]"
                  style={{ color: activeStep >= i ? "var(--accent)" : "var(--text-secondary)" }}
                >
                  {s.step}
                </div>
                <div className="mb-1 text-[13px] font-semibold">{s.title}</div>
                <div className="max-w-[150px] text-[11px] leading-relaxed text-[--text-secondary]">{s.desc}</div>

                {/* Mini config under Step 4 */}
                {i === 3 && activeStep >= 3 && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="mt-3"
                  >
                    <div className="mx-auto mb-2 h-4 w-px" style={{ borderLeft: "1px dashed rgba(0,255,136,0.2)" }} />
                    <div
                      className="w-[150px] rounded-lg p-2 text-left font-mono text-[8px] leading-relaxed text-[--code-default]"
                      style={{ border: "1px solid rgba(0,255,136,0.1)", background: "var(--bg-secondary)" }}
                    >
                      <div className="text-[--code-comment]">{"// claude_desktop_config"}</div>
                      <div>{"{"}<span className="text-[--code-string]">{'"stripe-mcp"'}</span>{": {"}</div>
                      <div>{"  "}<span className="text-[--code-string]">{'"command"'}</span>{": "}<span className="text-[--code-string]">{'"node"'}</span></div>
                      <div>{"}}"}</div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Connector line (not after last) */}
              {i < STEPS.length - 1 && (
                <div className="hidden md:flex md:items-center md:px-2 md:pt-7">
                  <svg width="60" height="2" className="overflow-visible">
                    <line
                      x1="0" y1="1" x2="60" y2="1"
                      stroke={activeStep > i ? "rgba(0,255,136,0.3)" : "rgba(255,255,255,0.12)"}
                      strokeWidth="2"
                      strokeDasharray={activeStep > i ? "0" : "4 4"}
                      className="transition-all duration-500"
                    />
                    {activeStep > i && (
                      <circle cx="60" cy="1" r="4" fill="var(--accent)" style={{ filter: "drop-shadow(0 0 6px rgba(0,255,136,0.5))" }} />
                    )}
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
