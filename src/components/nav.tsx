"use client";

import { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import { Heart, LayoutDashboard, Menu, X } from "lucide-react";
import Link from "next/link";

export function Nav() {
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-[--border-subtle] backdrop-blur-md bg-[--bg-primary]/80">
      <div className="mx-auto flex max-w-[1100px] items-center justify-between px-6 py-3.5">
        <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-80">
          <Image src="/logo.svg" alt="url2mcp logo" width={24} height={24} className="rounded-[5px]" />
          <span className="font-mono text-sm font-bold text-[--text-primary]">
            url2mcp
          </span>
          <span className="rounded-[3px] border border-[--accent-border] bg-[--accent-bg] px-1.5 py-px font-mono text-[9px] font-semibold text-[--accent]">
            BETA
          </span>
        </Link>

        {/* Desktop nav — hidden on mobile */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/gallery" className="text-xs font-medium text-[--text-secondary] transition-colors hover:text-[--text-primary]">
            Gallery
          </Link>
          <a href="#features" className="text-xs font-medium text-[--text-secondary] transition-colors hover:text-[--text-primary]">
            Features
          </a>
          <a href="#pricing" className="text-xs font-medium text-[--text-secondary] transition-colors hover:text-[--text-primary]">
            Pricing
          </a>
          <a
            href="https://github.com/Sashini336/url2mcp"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-[--text-secondary] transition-colors hover:text-[--text-primary]"
          >
            GitHub
          </a>
          <a
            href="https://buymeacoffee.com/sa6ko"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 rounded-[7px] border border-[rgba(219,39,119,0.15)] bg-[rgba(219,39,119,0.06)] px-2.5 py-1.5 text-[10px] font-semibold text-pink-400 transition-colors hover:border-[rgba(219,39,119,0.3)]"
          >
            <Heart size={11} />
            Support
          </a>

          {loading ? (
            <div className="h-7 w-24 animate-pulse rounded-[7px] bg-[--bg-elevated]" />
          ) : session ? (
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="flex items-center gap-1 text-xs font-medium text-[--text-secondary] transition-colors hover:text-[--text-primary]"
              >
                <LayoutDashboard size={13} />
                Dashboard
              </Link>
              {session.user?.image && (
                <Image
                  src={session.user.image}
                  alt={session.user.name ?? "User avatar"}
                  width={26}
                  height={26}
                  className="rounded-full border border-[--border-default]"
                />
              )}
              <span className="text-xs font-medium text-[--text-secondary]">
                {session.user?.name}
              </span>
              <button
                onClick={() => signOut()}
                className="rounded-[7px] border border-[--border-default] bg-[--bg-elevated] px-3.5 py-1.5 text-xs font-medium text-[--text-primary] transition-colors hover:border-[--border-muted] hover:text-[--text-primary]"
              >
                Sign out
              </button>
            </div>
          ) : (
            <button
              onClick={() => signIn("github")}
              className="flex items-center gap-2 rounded-[7px] border border-[--border-default] bg-[--bg-elevated] px-3.5 py-1.5 text-xs font-medium text-[--text-primary] transition-colors hover:border-[--accent-border] hover:text-[--accent]"
            >
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current" aria-hidden="true">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              Sign in
            </button>
          )}
        </div>

        {/* Mobile hamburger button — visible on mobile, hidden on md+ */}
        <button
          onClick={() => setMobileOpen((prev) => !prev)}
          className="flex md:hidden items-center justify-center rounded-[7px] border border-[--border-default] bg-[--bg-elevated] p-1.5 text-[--text-primary] transition-colors hover:border-[--accent-border] hover:text-[--accent]"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile menu panel */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[rgba(255,255,255,0.05)] backdrop-blur-md bg-[rgba(8,8,14,1)]">
          <div className="mx-auto max-w-[1100px] flex flex-col gap-1 px-6 py-4">
            <Link
              href="/gallery"
              onClick={() => setMobileOpen(false)}
              className="rounded-[8px] px-3 py-2.5 text-xs font-medium text-[--text-secondary] transition-colors hover:bg-[--bg-elevated] hover:text-[--text-primary]"
            >
              Gallery
            </Link>
            <a
              href="#features"
              onClick={() => setMobileOpen(false)}
              className="rounded-[8px] px-3 py-2.5 text-xs font-medium text-[--text-secondary] transition-colors hover:bg-[--bg-elevated] hover:text-[--text-primary]"
            >
              Features
            </a>
            <a
              href="#pricing"
              onClick={() => setMobileOpen(false)}
              className="rounded-[8px] px-3 py-2.5 text-xs font-medium text-[--text-secondary] transition-colors hover:bg-[--bg-elevated] hover:text-[--text-primary]"
            >
              Pricing
            </a>
            <a
              href="https://github.com/Sashini336/url2mcp"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-[8px] px-3 py-2.5 text-xs font-medium text-[--text-secondary] transition-colors hover:bg-[--bg-elevated] hover:text-[--text-primary]"
            >
              GitHub
            </a>
            <a
              href="https://buymeacoffee.com/sa6ko"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-[8px] px-3 py-2.5 text-xs font-semibold text-pink-400 transition-colors hover:bg-[--bg-elevated]"
            >
              <Heart size={11} />
              Support
            </a>

            <div className="my-2 border-t border-[rgba(255,255,255,0.05)]" />

            {loading ? (
              <div className="h-7 w-full animate-pulse rounded-[7px] bg-[--bg-elevated]" />
            ) : session ? (
              <>
                <div className="flex items-center gap-2.5 px-3 py-2">
                  {session.user?.image && (
                    <Image
                      src={session.user.image}
                      alt={session.user.name ?? "User avatar"}
                      width={24}
                      height={24}
                      className="rounded-full border border-[--border-default]"
                    />
                  )}
                  <span className="text-xs font-medium text-[--text-secondary]">
                    {session.user?.name}
                  </span>
                </div>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-1.5 rounded-[8px] px-3 py-2.5 text-xs font-medium text-[--text-secondary] transition-colors hover:bg-[--bg-elevated] hover:text-[--text-primary]"
                >
                  <LayoutDashboard size={13} />
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    signOut();
                  }}
                  className="mt-1 w-full rounded-[7px] border border-[--border-default] bg-[--bg-elevated] px-3.5 py-2 text-xs font-medium text-[--text-primary] text-left transition-colors hover:border-[--border-muted] hover:text-[--text-primary]"
                >
                  Sign out
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setMobileOpen(false);
                  signIn("github");
                }}
                className="flex items-center gap-2 rounded-[7px] border border-[--border-default] bg-[--bg-elevated] px-3.5 py-2 text-xs font-medium text-[--text-primary] transition-colors hover:border-[--accent-border] hover:text-[--accent]"
              >
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current" aria-hidden="true">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                </svg>
                Sign in with GitHub
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
