import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-[--border-subtle]">
      <div className="mx-auto flex max-w-[1100px] flex-wrap items-center justify-between gap-2 px-6 py-5">
        <span className="font-mono text-[10.5px] text-[--text-tertiary]">
          url2mcp — open source, built by{" "}
          <a
            href="https://github.com/Sashini336"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[--text-secondary] transition-colors hover:text-[--text-primary]"
          >
            sashko
          </a>
        </span>
        <div className="flex items-center gap-3">
          <a
            href="https://github.com/Sashini336/url2mcp"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] text-[--text-tertiary] transition-colors hover:text-[--text-secondary]"
          >
            GitHub
          </a>
          <a
            href="https://buymeacoffee.com/sa6ko"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[11px] text-[--text-tertiary] transition-colors hover:text-pink-400"
          >
            <Heart size={10} />
            Support
          </a>
          <a
            href="https://buymeacoffee.com/sa6ko"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] text-[--text-tertiary] transition-colors hover:text-[--text-secondary]"
          >
            Buy me a coffee
          </a>
        </div>
      </div>
    </footer>
  );
}
