export interface ToolInfo {
  name: string;
  description: string;
}

export type OutputLanguage = "typescript" | "python";

export interface GenerationMetadata {
  name: string;
  description: string;
  tools_count: number;
  auth_type: "api_key" | "oauth2" | "bearer" | "none";
  transport: "stdio";
  language: OutputLanguage;
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

export interface DetectedEndpoint {
  name: string;
  method: string;
  path: string;
  description: string;
  group: string;
}

export interface AnalyzeResult {
  endpoints: DetectedEndpoint[];
  auth_type: "api_key" | "oauth2" | "bearer" | "none";
  base_url: string;
  api_name: string;
}

export type SSEEvent =
  | { type: "step"; step: 1 | 2 | 3; label: string }
  | { type: "chunk"; content: string }
  | { type: "complete"; data: GenerationResult }
  | { type: "error"; message: string };

export type GenerationStatus = "idle" | "generating" | "complete" | "error" | "selecting";

export interface GenerationState {
  status: GenerationStatus;
  step: number;
  stepLabel: string;
  result: GenerationResult | null;
  error: string | null;
  analyzedEndpoints: DetectedEndpoint[] | null;
}
