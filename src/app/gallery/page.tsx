"use client";

import { useState, useMemo } from "react";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { ArrowLeft, Search } from "lucide-react";
import Link from "next/link";

interface GalleryItem {
  name: string;
  description: string;
  url: string;
  category: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    name: "Stripe",
    description: "Payment processing API",
    url: "https://docs.stripe.com/api",
    category: "Payments",
  },
  {
    name: "GitHub",
    description: "Repository and developer platform API",
    url: "https://docs.github.com/en/rest",
    category: "Developer Tools",
  },
  {
    name: "Notion",
    description: "Workspace and database API",
    url: "https://developers.notion.com/reference",
    category: "Productivity",
  },
  {
    name: "OpenAI",
    description: "AI model inference API",
    url: "https://platform.openai.com/docs/api-reference",
    category: "AI/ML",
  },
  {
    name: "Twilio",
    description: "Communication and messaging API",
    url: "https://www.twilio.com/docs/usage/api",
    category: "Communication",
  },
  {
    name: "Slack",
    description: "Team messaging and integration API",
    url: "https://api.slack.com/methods",
    category: "Communication",
  },
  {
    name: "Spotify",
    description: "Music streaming and metadata API",
    url: "https://developer.spotify.com/documentation/web-api",
    category: "Media",
  },
  {
    name: "Discord",
    description: "Chat platform and bot API",
    url: "https://discord.com/developers/docs/reference",
    category: "Communication",
  },
  {
    name: "Shopify",
    description: "E-commerce platform API",
    url: "https://shopify.dev/docs/api",
    category: "E-commerce",
  },
  {
    name: "Vercel",
    description: "Deployment and hosting API",
    url: "https://vercel.com/docs/rest-api",
    category: "Developer Tools",
  },
  {
    name: "Linear",
    description: "Project management API",
    url: "https://developers.linear.app/docs/graphql/working-with-the-graphql-api",
    category: "Productivity",
  },
  {
    name: "Resend",
    description: "Email sending API",
    url: "https://resend.com/docs/api-reference/introduction",
    category: "Communication",
  },
];

const CATEGORIES = [
  "All",
  "Developer Tools",
  "Payments",
  "Communication",
  "Productivity",
  "AI/ML",
  "Media",
  "E-commerce",
];

export default function GalleryPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = useMemo(() => {
    return GALLERY_ITEMS.filter((item) => {
      const matchesSearch =
        search.trim() === "" ||
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        activeCategory === "All" || item.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory]);

  return (
    <div className="relative min-h-screen">
      <Nav />

      <div className="mx-auto max-w-[1100px] px-6 pb-16 pt-10">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1.5 text-xs text-[--text-tertiary] transition-colors hover:text-[--text-secondary]"
        >
          <ArrowLeft size={12} />
          Back to generator
        </Link>

        <h1 className="mb-1 text-xl font-bold tracking-[-0.02em]">
          MCP Server Gallery
        </h1>
        <p className="mb-8 text-[13px] text-[--text-secondary]">
          Pre-configured servers for popular APIs. Click to generate instantly.
        </p>

        {/* Search input */}
        <div className="relative mb-5">
          <Search
            size={14}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[--text-tertiary]"
          />
          <input
            type="text"
            placeholder="Search APIs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-[11px] bg-transparent py-2.5 pl-9 pr-4 font-mono text-xs text-[--text-primary] placeholder:text-[--text-tertiary] outline-none transition-colors focus:border-[--accent-border]"
            style={{ border: "1px solid var(--border-default)" }}
          />
        </div>

        {/* Category filter tabs */}
        <div className="mb-6 flex flex-wrap gap-1.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="rounded-[6px] px-3 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.04em] transition-colors"
              style={{
                background:
                  activeCategory === cat
                    ? "var(--accent-bg)"
                    : "transparent",
                border:
                  activeCategory === cat
                    ? "1px solid var(--accent-border)"
                    : "1px solid var(--border-subtle)",
                color:
                  activeCategory === cat
                    ? "var(--accent)"
                    : "var(--text-tertiary)",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery grid */}
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-xs text-[--text-tertiary]">
              No APIs match your search
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
            {filtered.map((item) => (
              <div
                key={item.name}
                className="group flex flex-col justify-between rounded-[14px] p-5 transition-all duration-200 hover:-translate-y-[2px]"
                style={{
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border-subtle)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "rgba(0, 255, 136, 0.15)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "var(--border-subtle)";
                }}
              >
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-[--text-primary]">
                      {item.name}
                    </h3>
                    <span
                      className="rounded-[4px] px-1.5 py-px font-mono text-[8.5px] font-semibold uppercase tracking-[0.06em]"
                      style={{
                        color: "var(--text-tertiary)",
                        border: "1px solid var(--border-subtle)",
                      }}
                    >
                      {item.category}
                    </span>
                  </div>
                  <p className="mb-5 text-xs leading-relaxed text-[--text-secondary]">
                    {item.description}
                  </p>
                </div>
                <Link
                  href={`/?url=${encodeURIComponent(item.url)}`}
                  className="block w-full rounded-[8px] py-2 text-center text-xs font-semibold transition-opacity hover:opacity-90"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--accent), var(--accent-dark))",
                    color: "var(--bg-primary)",
                  }}
                >
                  Generate
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
