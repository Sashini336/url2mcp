import Anthropic from "@anthropic-ai/sdk";
import { buildGenerationPrompt, buildAnalyzePrompt } from "./prompt";
import type { GenerationResult, AnalyzeResult, OutputLanguage } from "@/types";

const MODEL = "claude-haiku-4-5";
const MAX_TOKENS = 16384;

let defaultClient: Anthropic | null = null;

function getDefaultClient(): Anthropic {
  if (!defaultClient) {
    defaultClient = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }
  return defaultClient;
}

export function extractJSON<T = GenerationResult>(raw: string): T {
  let text = raw.trim();

  text = text.replace(/^```(?:json)?\s*\n?/i, "").replace(/\n?```\s*$/i, "");

  const firstBrace = text.indexOf("{");
  const lastBrace = text.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
    throw new Error("No valid JSON object found in Claude response");
  }

  const jsonString = text.slice(firstBrace, lastBrace + 1);

  try {
    return JSON.parse(jsonString) as T;
  } catch (err) {
    throw new Error(`Failed to parse generation output as JSON: ${(err as Error).message}`);
  }
}

export async function generateMCPServer(
  docsContent: string,
  docsTitle: string,
  userApiKey?: string,
  language: OutputLanguage = "typescript",
  selectedEndpoints?: string[]
): Promise<GenerationResult> {
  const { system, user } = buildGenerationPrompt(docsContent, docsTitle, language, selectedEndpoints);

  const anthropic = userApiKey
    ? new Anthropic({ apiKey: userApiKey })
    : getDefaultClient();

  const message = await anthropic.messages.create({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    temperature: 0,
    system,
    messages: [{ role: "user", content: user }],
  });

  const textBlock = message.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No text content in Claude response");
  }

  return extractJSON<GenerationResult>(textBlock.text);
}

export async function analyzeAPIDocs(
  docsContent: string,
  docsTitle: string,
  userApiKey?: string
): Promise<AnalyzeResult> {
  const { system, user } = buildAnalyzePrompt(docsContent, docsTitle);

  const anthropic = userApiKey
    ? new Anthropic({ apiKey: userApiKey })
    : getDefaultClient();

  const message = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 4096,
    temperature: 0,
    system,
    messages: [{ role: "user", content: user }],
  });

  const textBlock = message.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No text content in Claude response");
  }

  return extractJSON<AnalyzeResult>(textBlock.text);
}
