"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    question: "What URL formats are supported?",
    answer:
      "Any REST API docs page, OpenAPI/Swagger specs, or README files. We parse the HTML and extract endpoint info.",
  },
  {
    question: "What happens if my URL fails?",
    answer:
      "Make sure the URL is publicly accessible. Private/authenticated docs, PDFs, and JavaScript-heavy SPAs may not parse correctly. Try the raw docs URL.",
  },
  {
    question: "How does BYOK work?",
    answer:
      "Your Anthropic API key is stored in your browser only. During generation, it's sent directly to Anthropic's API. We never log, store, or see your key.",
  },
  {
    question: "What's included in the generated server?",
    answer:
      "A complete, runnable MCP server: package.json, tsconfig.json, src/index.ts with tool definitions, auth handling, error handling, and a ready-to-paste claude_desktop_config.json.",
  },
  {
    question: "Can I customize the generated code?",
    answer:
      "Yes — it's your code. Download the ZIP, modify anything, and run it wherever you want. No vendor lock-in.",
  },
  {
    question: "How many free generations do I get?",
    answer:
      "2 per month with a GitHub sign-in. Add your own Anthropic API key for unlimited generations.",
  },
  {
    question: "Which AI model is used?",
    answer:
      "Claude Haiku 4.5 by Anthropic. When using BYOK, your key is used with the same model.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section id="faq" className="relative z-10 py-16">
      <div className="mx-auto max-w-[1100px] px-6">
        <div className="mb-10 text-center">
          <h2 className="mb-2 text-[22px] font-bold tracking-[-0.02em]">
            Frequently asked questions
          </h2>
          <p className="mx-auto max-w-[420px] text-[13px] leading-relaxed text-[--text-secondary]">
            Everything you need to know about generating MCP servers.
          </p>
        </div>

        <div className="mx-auto flex max-w-[700px] flex-col gap-2">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className="rounded-[10px] transition-colors duration-200"
                style={{
                  background: "var(--bg-elevated)",
                  border: isOpen
                    ? "1px solid rgba(0,255,136,0.15)"
                    : "1px solid var(--border-subtle)",
                }}
                onMouseEnter={(e) => {
                  if (!isOpen) {
                    e.currentTarget.style.borderColor =
                      "rgba(255,255,255,0.08)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isOpen) {
                    e.currentTarget.style.borderColor =
                      "rgba(255,255,255,0.05)";
                  }
                }}
              >
                <button
                  onClick={() => toggle(index)}
                  className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
                >
                  <span className="text-[13px] font-semibold text-[--text-primary]">
                    {item.question}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="shrink-0"
                  >
                    <ChevronDown
                      size={14}
                      style={{
                        color: isOpen
                          ? "var(--accent)"
                          : "var(--text-tertiary)",
                      }}
                    />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-4 pt-0">
                        <p className="text-[12.5px] leading-relaxed text-[--text-secondary]">
                          {item.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
