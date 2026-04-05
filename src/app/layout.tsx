import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/session-provider";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "url2mcp — Generate MCP Servers from Any API Docs in 60 Seconds",
  description:
    "Paste your API docs URL and get a production-ready MCP server with tool definitions, authentication, error handling, and claude_desktop_config.json. Works with any REST API.",
  keywords: [
    "MCP server generator",
    "Model Context Protocol",
    "API to MCP",
    "Claude MCP",
    "MCP tools",
    "API automation",
    "claude_desktop_config",
    "MCP server builder",
  ],
  icons: {
    icon: "/favicon.png",
    apple: "/apple-touch-icon.png",
  },
  metadataBase: new URL("https://url2mcp.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "url2mcp — Generate MCP Servers from Any API Docs",
    description:
      "Paste a URL, get a working MCP server with tools, auth, and config. Supports Stripe, GitHub, Notion, and any REST API.",
    type: "website",
    url: "https://url2mcp.com",
    siteName: "url2mcp",
  },
  twitter: {
    card: "summary_large_image",
    title: "url2mcp — Any API → Working MCP Server",
    description:
      "Generate production-ready MCP servers from API documentation in 60 seconds.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" style={{ colorScheme: "dark" }}>
      <head>
        <meta name="theme-color" content="#08080e" />
        <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="anonymous" />
        <link
          href="https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600,700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "url2mcp",
              applicationCategory: "DeveloperApplication",
              operatingSystem: "Any",
              description:
                "Generate production-ready MCP servers from any API documentation URL. Supports Stripe, GitHub, Notion, and any REST API.",
              url: "https://url2mcp.com",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
                name: "Free & Open Source",
                description: "2 free generations per month, unlimited with your own API key",
              },
            }),
          }}
        />
      </head>
      <body
        className={`${jetbrainsMono.variable} antialiased`}
        style={{ fontFamily: "'General Sans', var(--font-general-sans, system-ui), sans-serif" }}
      >
        <div className="grid-overlay" />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
