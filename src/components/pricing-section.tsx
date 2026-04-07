"use client";

import { Check, Key, Infinity, Zap } from "lucide-react";
import Link from "next/link";

const TIERS = [
  {
    name: "Free",
    price: "Free",
    subtitle: "Sign in with GitHub",
    accent: false,
    features: [
      "2 generations per month",
      "Full MCP server output",
      "ZIP download + config",
      "All supported APIs",
      "Community support",
    ],
    cta: "Get Started",
    ctaHref: "#",
  },
  {
    name: "BYOK",
    price: "Unlimited",
    subtitle: "Bring Your Own Key",
    accent: true,
    features: [
      "Unlimited generations",
      "Use your own Anthropic API key",
      "Key never stored on our servers",
      "Full MCP server output",
      "Priority generation speed",
    ],
    cta: "Add Your Key",
    ctaHref: "/dashboard",
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="relative z-10 py-16">
      <div className="mx-auto max-w-[1100px] px-6">
        <div className="mb-10 text-center">
          <h2 className="mb-2 text-[22px] font-bold tracking-[-0.02em]">
            Simple, transparent pricing
          </h2>
          <p className="mx-auto max-w-[420px] text-[13px] leading-relaxed text-[--text-secondary]">
            Start generating for free. Need more? Just add your own API key — no subscription, no credit card.
          </p>
        </div>

        <div className="mx-auto flex max-w-[640px] flex-col gap-3 md:flex-row">
          {TIERS.map((tier) => (
            <div
              key={tier.name}
              className="relative flex flex-1 flex-col rounded-[14px] p-6 transition-all duration-200 hover:-translate-y-0.5"
              style={{
                background: tier.accent ? "rgba(0,255,136,0.03)" : "var(--bg-elevated)",
                border: tier.accent ? "1px solid rgba(0,255,136,0.15)" : "1px solid var(--border-subtle)",
              }}
            >
              {tier.accent && (
                <div
                  className="pointer-events-none absolute inset-0 rounded-[14px]"
                  style={{
                    background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,255,136,0.06), transparent 70%)",
                  }}
                />
              )}

              <div className="relative z-10">
                <div className="mb-1 flex items-center gap-2">
                  {tier.accent ? (
                    <Key size={14} className="text-[--accent]" />
                  ) : (
                    <Zap size={14} className="text-[--text-secondary]" />
                  )}
                  <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.06em]" style={{ color: tier.accent ? "var(--accent)" : "var(--text-tertiary)" }}>
                    {tier.name}
                  </span>
                </div>

                <div className="mb-0.5 flex items-baseline gap-1.5">
                  <span className="text-[28px] font-bold tracking-[-0.02em]">{tier.price}</span>
                </div>
                <p className="mb-5 text-[11px] text-[--text-tertiary]">{tier.subtitle}</p>

                <ul className="mb-6 flex flex-col gap-2.5">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check size={12} className="mt-0.5 shrink-0" style={{ color: tier.accent ? "var(--accent)" : "var(--text-tertiary)" }} />
                      <span className="text-[12px] leading-snug text-[--text-secondary]">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={tier.ctaHref}
                  className="flex w-full items-center justify-center gap-1.5 rounded-[8px] px-4 py-2.5 text-xs font-semibold transition-all duration-200"
                  style={{
                    background: tier.accent
                      ? "linear-gradient(135deg, var(--accent), var(--accent-dark))"
                      : "rgba(255,255,255,0.03)",
                    color: tier.accent ? "var(--bg-primary)" : "var(--text-primary)",
                    border: tier.accent ? "none" : "1px solid var(--border-default)",
                  }}
                >
                  {tier.accent && <Infinity size={13} />}
                  {tier.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-5 text-center text-[10px] text-[--text-tertiary]">
          Your API key is stored locally in your browser and sent directly to Anthropic. We never log or store it.
        </p>
      </div>
    </section>
  );
}
