const API_LOGOS = ["Stripe", "GitHub", "Notion", "Slack", "Twilio", "OpenAI"];

export function SocialProof() {
  return (
    <div className="relative z-10" style={{ borderTop: "1px solid rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
      <div className="mx-auto flex max-w-[1100px] flex-wrap items-center justify-center gap-x-6 gap-y-2 px-6 py-4">
        <span className="font-mono text-[10px] text-[--text-tertiary]">Generate MCP servers for</span>
        <div className="flex items-center gap-4">
          {API_LOGOS.map((name) => (
            <span key={name} className="text-[11px] font-semibold text-[--text-secondary] opacity-50 transition-opacity hover:opacity-80">
              {name}
            </span>
          ))}
        </div>
        <span className="font-mono text-[10px] text-[--text-tertiary]">&mdash; and any REST API</span>
      </div>
    </div>
  );
}
