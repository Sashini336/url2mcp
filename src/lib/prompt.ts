export function buildGenerationPrompt(docsContent: string, docsTitle: string): { system: string; user: string } {
  const system = `You generate MCP servers from API docs. Output ONLY a JSON object — no text, no markdown fences, no explanation.

RULES:
- Group endpoints into 5-15 logical tools (not 1:1 with endpoints)
- Tool names: snake_case
- Detect auth: "API key"/"X-API-Key"/"Bearer sk_" → "api_key", "OAuth2" → "oauth2", "Bearer token" → "bearer", else → "none"
- Generated code uses @modelcontextprotocol/sdk with real HTTP fetch calls
- All file string values must have newlines escaped as \\n and quotes escaped as \\"

EXACT OUTPUT SCHEMA:
{
  "metadata": {
    "name": "<api-name>-mcp",
    "description": "MCP server for <API Name>",
    "tools_count": <number>,
    "auth_type": "<api_key|oauth2|bearer|none>",
    "transport": "stdio",
    "language": "typescript",
    "base_url": "<base URL>",
    "tools": [{"name": "<snake_case>", "description": "<one line>"}]
  },
  "files": {
    "package.json": "<stringified package.json>",
    "tsconfig.json": "<stringified tsconfig.json>",
    "src/index.ts": "<complete MCP server source code as a string>",
    "README.md": "<setup instructions as a string>",
    ".env.example": "<env vars as a string>"
  },
  "config": {
    "mcpServers": {
      "<api-name>-mcp": {
        "command": "node",
        "args": ["build/index.js"],
        "env": {"<AUTH_VAR>": "<placeholder>"}
      }
    }
  }
}

REQUIRED CODE STRUCTURE for src/index.ts:
- import { Server } from "@modelcontextprotocol/sdk/server/index.js";
- import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
- import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
- const server = new Server({ name: "<name>", version: "1.0.0" }, { capabilities: { tools: {} } });
- server.setRequestHandler(ListToolsRequestSchema, ...) — return tools array with inputSchema
- server.setRequestHandler(CallToolRequestSchema, ...) — switch on name, make fetch() calls with auth headers from process.env
- const transport = new StdioServerTransport(); await server.connect(transport);
- Wrap each API call in try/catch, return { content: [{ type: "text", text: JSON.stringify(result) }] }
- On error return { content: [{ type: "text", text: "Error: " + message }], isError: true }

REQUIRED package.json: name, version "1.0.0", type "module", scripts.build "tsc", scripts.start "node build/index.js", dependencies: {"@modelcontextprotocol/sdk": "^1.0.0"}, devDependencies: {"typescript": "^5.0.0", "@types/node": "^20.0.0"}

REQUIRED tsconfig.json: target ES2022, module Node16, moduleResolution Node16, outDir ./build, rootDir ./src, strict true, esModuleInterop true, skipLibCheck true

OUTPUT THE JSON OBJECT NOW. Nothing else.`;

  const user = `Generate a complete MCP server from this API documentation.

Title: ${docsTitle}

Documentation:
${docsContent}`;

  return { system, user };
}
