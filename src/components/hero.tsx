"use client";

import { HeroTerminal } from "./hero-terminal";
import { ParticleField } from "./particle-field";
import { GeneratorInput } from "./generator-input";

interface HeroProps {
  url: string;
  onUrlChange: (url: string) => void;
  onGenerate: () => void;
  generating: boolean;
  apiKey: string;
  onApiKeyChange: (key: string) => void;
}

export function Hero({ url, onUrlChange, onGenerate, generating, apiKey, onApiKeyChange }: HeroProps) {
  return (
    <section className="relative z-10 overflow-hidden">
      <div
        className="pointer-events-none absolute -top-44 left-1/3 h-[480px] w-[480px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(0,255,136,0.1) 0%, transparent 70%)",
          filter: "blur(90px)",
        }}
      />

      <div className="mx-auto flex max-w-[1100px] flex-col items-center gap-12 px-6 pb-10 pt-16 lg:flex-row lg:items-center lg:gap-16 lg:pt-20">
        <div className="flex flex-1 flex-col items-center text-center lg:items-start lg:text-left">
          <h1 className="mb-3 text-[clamp(28px,5vw,44px)] font-bold leading-[1.08] tracking-[-0.035em]" style={{ textWrap: "balance" }}>
            Turn Any API into a Working{" "}
            <span className="text-[--accent]">MCP Server</span>
          </h1>

          <p className="mb-7 max-w-[400px] text-[15px] leading-relaxed text-[--text-secondary]">
            Paste your API docs URL. Get a production-ready MCP server with
            tools, auth, and config — in 60 seconds.
          </p>

          <GeneratorInput
            url={url}
            onUrlChange={onUrlChange}
            onGenerate={onGenerate}
            generating={generating}
            apiKey={apiKey}
            onApiKeyChange={onApiKeyChange}
          />
        </div>

        <div className="relative flex flex-1 items-center justify-center">
          <div className="relative h-[340px] w-full max-w-[420px]">
            <ParticleField />
            <div className="absolute inset-0 z-10 flex items-center justify-center">
              <HeroTerminal />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
