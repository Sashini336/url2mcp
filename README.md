# url2mcp

> Any REST API docs URL → production-ready MCP server in 60 seconds

[Live Demo](https://url2mcp.com) &nbsp;|&nbsp; [Report Bug](https://github.com/Sashini336/url2mcp/issues) &nbsp;|&nbsp; [Request Feature](https://github.com/Sashini336/url2mcp/issues)

<!-- ![url2mcp screenshot](screenshot.png) -->

## What it does

Paste a link to any API documentation. url2mcp fetches the docs, analyzes every endpoint, and generates a complete MCP (Model Context Protocol) server with:

- Tool definitions for every endpoint
- Auth handling (API key, Bearer, OAuth — auto-detected)
- Input validation and error handling
- Ready-to-paste `claude_desktop_config.json`
- Downloadable ZIP with full project (package.json, tsconfig, src/)

## How it works

```
URL → Fetch & extract docs → Claude analyzes endpoints → MCP server generated → Download ZIP
```

1. You paste an API docs URL
2. Backend fetches and extracts the text content
3. Claude analyzes endpoints and groups them into MCP tools
4. You get a complete, runnable MCP server

## Self-host

### Prerequisites

- Node.js 18+
- An [Anthropic API key](https://console.anthropic.com/)
- A [GitHub OAuth app](https://github.com/settings/developers) (for auth)

### Setup

```bash
git clone https://github.com/Sashini336/url2mcp.git
cd url2mcp
npm install
cp .env.example .env
```

Edit `.env` with your keys:

```env
ANTHROPIC_API_KEY=sk-ant-...
AUTH_SECRET=any-random-string
GITHUB_ID=your-github-oauth-id
GITHUB_SECRET=your-github-oauth-secret
```

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FSashini336%2Furl2mcp&env=ANTHROPIC_API_KEY,AUTH_SECRET,GITHUB_ID,GITHUB_SECRET&envDescription=API%20keys%20needed%20for%20url2mcp&envLink=https%3A%2F%2Fgithub.com%2FSashini336%2Furl2mcp%23setup)

## BYOK (Bring Your Own Key)

The hosted version at [url2mcp.com](https://url2mcp.com) gives you **2 free generations per month**. For unlimited use, click the **BYOK** toggle and paste your own Anthropic API key. Your key is sent directly to Anthropic and never stored.

When self-hosting, you provide your own key — all generations are unlimited.

## Tech stack

- **Frontend**: Next.js 16, TypeScript, Tailwind CSS, Framer Motion
- **AI**: Claude Haiku 4.5 via Anthropic API
- **Auth**: NextAuth.js + GitHub OAuth
- **Extraction**: Cheerio for HTML parsing

## Project structure

```
src/
├── app/
│   ├── page.tsx                 # Single-page app
│   └── api/
│       ├── generate/route.ts    # MCP generation endpoint (SSE)
│       └── fetch-docs/route.ts  # Doc extraction endpoint
├── components/                  # UI components
├── hooks/use-generation.ts      # Generation state + streaming
├── lib/
│   ├── prompt.ts                # Core generation prompt
│   ├── anthropic.ts             # Claude API client
│   ├── doc-fetcher.ts           # URL fetcher + HTML extraction
│   └── rate-limit.ts            # In-memory rate limiter
└── types/index.ts
```

## Support

If url2mcp saves you time, consider buying me a coffee, thanks:

- [Buy Me a Coffee](https://buymeacoffee.com/sa6ko)

## License

MIT
