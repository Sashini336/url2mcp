import { NextRequest } from "next/server";
import { fetchAndExtract, FetchError } from "@/lib/doc-fetcher";
import { analyzeAPIDocs } from "@/lib/anthropic";
import { checkRateLimit } from "@/lib/rate-limit";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return new Response(JSON.stringify({ error: "Sign in required" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  let body: { url?: string; apiKey?: string };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { url, apiKey } = body;
  if (!url || typeof url !== "string") {
    return new Response(
      JSON.stringify({ error: "Missing required field: url" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const trimmedKey = apiKey?.trim();
  const usingOwnKey = !!trimmedKey;
  if (usingOwnKey && !/^sk-ant-[a-zA-Z0-9_-]{20,}$/.test(trimmedKey!)) {
    return new Response(
      JSON.stringify({ error: "Invalid API key format" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  // Rate limit check (analyze counts as part of the generation flow)
  if (!usingOwnKey) {
    const rateLimitKey =
      (session.user as { githubId?: number | string }).githubId?.toString() ??
      session.user?.email ??
      "unknown";

    const rateResult = checkRateLimit(rateLimitKey);
    if (!rateResult.allowed) {
      return new Response(
        JSON.stringify({
          error: "You've used your 2 free generations this month. Add your own Anthropic API key for unlimited generations.",
        }),
        { status: 429, headers: { "Content-Type": "application/json" } }
      );
    }
  }

  try {
    const docs = await fetchAndExtract(url);
    const result = await analyzeAPIDocs(
      docs.content,
      docs.title,
      usingOwnKey ? trimmedKey! : undefined
    );
    return new Response(JSON.stringify(result), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    const message =
      err instanceof FetchError
        ? err.message
        : err instanceof Error
          ? err.message
          : "Analysis failed. Please try again.";
    const status = err instanceof FetchError ? err.statusCode : 500;
    return new Response(JSON.stringify({ error: message }), {
      status,
      headers: { "Content-Type": "application/json" },
    });
  }
}
