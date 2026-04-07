import type { OutputLanguage } from "@/types";

const TS_CODE_STRUCTURE = `REQUIRED CODE STRUCTURE for src/index.ts:
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

REQUIRED tsconfig.json: target ES2022, module Node16, moduleResolution Node16, outDir ./build, rootDir ./src, strict true, esModuleInterop true, skipLibCheck true`;

const TS_FILES_SCHEMA = `"files": {
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
  }`;

const PY_CODE_STRUCTURE = `REQUIRED CODE STRUCTURE for server.py:
- from mcp.server import Server
- from mcp.server.stdio import stdio_server
- import httpx, os, json
- server = Server("<name>")
- @server.list_tools() — return list of Tool objects with inputSchema
- @server.call_tool() — match on name, make httpx requests with auth headers from os.environ
- async def main(): async with stdio_server() as (read, write): await server.run(read, write, server.create_initialization_options())
- if __name__ == "__main__": import asyncio; asyncio.run(main())
- Wrap each API call in try/except, return [TextContent(type="text", text=json.dumps(result))]
- On error return [TextContent(type="text", text="Error: " + str(e))]

REQUIRED pyproject.toml: name, version "1.0.0", dependencies: ["mcp>=1.0.0", "httpx>=0.27.0"], scripts: {"<name>": "<package>.server:main"}
- Use [build-system] with hatchling`;

const PY_FILES_SCHEMA = `"files": {
    "pyproject.toml": "<stringified pyproject.toml>",
    "src/<package_name>/server.py": "<complete MCP server source code as a string>",
    "src/<package_name>/__init__.py": "",
    "README.md": "<setup instructions as a string>",
    ".env.example": "<env vars as a string>"
  },
  "config": {
    "mcpServers": {
      "<api-name>-mcp": {
        "command": "uv",
        "args": ["run", "<package-name>"],
        "env": {"<AUTH_VAR>": "<placeholder>"}
      }
    }
  }`;

export function buildGenerationPrompt(
  docsContent: string,
  docsTitle: string,
  language: OutputLanguage = "typescript",
  selectedEndpoints?: string[]
): { system: string; user: string } {
  const isTS = language === "typescript";

  const endpointFilter = selectedEndpoints?.length
    ? `\nIMPORTANT: Only generate tools for these specific endpoints/groups: ${selectedEndpoints.join(", ")}. Ignore all other endpoints.`
    : "";

  const system = `You generate MCP servers from API docs. Output ONLY a JSON object — no text, no markdown fences, no explanation.

RULES:
- Group endpoints into 5-15 logical tools (not 1:1 with endpoints)
- Tool names: snake_case
- Detect auth: "API key"/"X-API-Key"/"Bearer sk_" → "api_key", "OAuth2" → "oauth2", "Bearer token" → "bearer", else → "none"
- Generated code uses ${isTS ? "@modelcontextprotocol/sdk with real HTTP fetch calls" : "the mcp Python package with httpx for HTTP calls"}
- All file string values must have newlines escaped as \\n and quotes escaped as \\"${endpointFilter}

EXACT OUTPUT SCHEMA:
{
  "metadata": {
    "name": "<api-name>-mcp",
    "description": "MCP server for <API Name>",
    "tools_count": <number>,
    "auth_type": "<api_key|oauth2|bearer|none>",
    "transport": "stdio",
    "language": "${language}",
    "base_url": "<base URL>",
    "tools": [{"name": "<snake_case>", "description": "<one line>"}]
  },
  ${isTS ? TS_FILES_SCHEMA : PY_FILES_SCHEMA}
}

${isTS ? TS_CODE_STRUCTURE : PY_CODE_STRUCTURE}

OUTPUT THE JSON OBJECT NOW. Nothing else.`;

  const user = `Generate a complete MCP server in ${isTS ? "TypeScript" : "Python"} from this API documentation.

Title: ${docsTitle}

Documentation:
${docsContent}`;

  return { system, user };
}

export function buildAnalyzePrompt(docsContent: string, docsTitle: string): { system: string; user: string } {
  const system = `You analyze API documentation and extract endpoints. Output ONLY a JSON object — no text, no markdown fences, no explanation.

RULES:
- List ALL detected API endpoints with method, path, and description
- Group them into logical categories
- Detect the authentication type
- Identify the base URL

EXACT OUTPUT SCHEMA:
{
  "api_name": "<human readable API name>",
  "base_url": "<base API URL>",
  "auth_type": "<api_key|oauth2|bearer|none>",
  "endpoints": [
    {
      "name": "<short_name>",
      "method": "<GET|POST|PUT|DELETE|PATCH>",
      "path": "</path/to/endpoint>",
      "description": "<one line description>",
      "group": "<logical group name>"
    }
  ]
}

OUTPUT THE JSON OBJECT NOW. Nothing else.`;

  const user = `Analyze this API documentation and list all detected endpoints.

Title: ${docsTitle}

Documentation:
${docsContent}`;

  return { system, user };
}
