export interface ToolInfo {
  name: string;
  description: string;
}

export interface GenerationMetadata {
  name: string;
  description: string;
  tools_count: number;
  auth_type: "api_key" | "oauth2" | "bearer" | "none";
  transport: "stdio";
  language: "typescript";
  base_url: string;
  tools: ToolInfo[];
}

export interface GenerationResult {
  metadata: GenerationMetadata;
  files: Record<string, string>;
  config: {
    mcpServers: Record<string, {
      command: string;
      args: string[];
      env?: Record<string, string>;
    }>;
  };
}

export interface FetchDocsResult {
  content: string;
  title: string;
  byteLength: number;
}

export type SSEEvent =
  | { type: "step"; step: 1 | 2 | 3; label: string }
  | { type: "chunk"; content: string }
  | { type: "complete"; data: GenerationResult }
  | { type: "error"; message: string };

export type GenerationStatus = "idle" | "generating" | "complete" | "error";

export interface GenerationState {
  status: GenerationStatus;
  step: number;
  stepLabel: string;
  result: GenerationResult | null;
  error: string | null;
}
