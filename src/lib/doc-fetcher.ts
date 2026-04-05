import * as cheerio from "cheerio";
import type { FetchDocsResult } from "@/types";

const STRIP_SELECTORS = [
  "nav", "footer", "header", "script", "style", "noscript",
  "[role='navigation']", "[role='banner']", "[role='contentinfo']",
  ".sidebar", ".nav", ".footer", ".header", ".ads", ".advertisement",
  "#nav", "#footer", "#header", "#sidebar",
];

const MAX_CONTENT_LENGTH = 48000;

export function extractContent(html: string): FetchDocsResult {
  const $ = cheerio.load(html);
  const title = $("title").first().text().trim() || "Untitled";

  for (const selector of STRIP_SELECTORS) {
    $(selector).remove();
  }

  let content = "";
  const mainSelectors = ["main", "article", "[role='main']", ".content", "#content", ".documentation", ".api-content"];

  for (const sel of mainSelectors) {
    const el = $(sel);
    if (el.length && el.text().trim().length > 200) {
      content = el.text();
      break;
    }
  }

  if (!content) {
    content = $("body").text();
  }

  content = content
    .replace(/\s+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  if (content.length > MAX_CONTENT_LENGTH) {
    content = content.slice(0, MAX_CONTENT_LENGTH) + "\n\n[Content truncated]";
  }

  return {
    content,
    title,
    byteLength: Buffer.byteLength(content, "utf8"),
  };
}

const MIN_CONTENT_LENGTH = 500;

export async function fetchAndExtract(rawUrl: string): Promise<FetchDocsResult> {
  const url = rawUrl.trim();
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new FetchError("Invalid URL format", 400);
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw new FetchError("URL must use HTTP or HTTPS", 400);
  }

  let html: string;
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; url2mcp/1.0; +https://url2mcp.com)",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) {
      throw new FetchError(`Failed to fetch URL: HTTP ${res.status}`, 502);
    }
    html = await res.text();
  } catch (err) {
    if (err instanceof FetchError) throw err;
    throw new FetchError("Failed to fetch URL. Check that it's accessible.", 502);
  }

  const result = extractContent(html);

  if (result.content.length < MIN_CONTENT_LENGTH) {
    throw new FetchError(
      "This page loads content dynamically. Try pasting the raw API reference URL or an OpenAPI spec URL instead.",
      422
    );
  }

  return result;
}

export class FetchError extends Error {
  constructor(message: string, public statusCode: number) {
    super(message);
    this.name = "FetchError";
  }
}
