import { NextRequest } from "next/server";
import { fetchAndExtract, FetchError } from "@/lib/doc-fetcher";
import { generateMCPServer } from "@/lib/anthropic";
import { checkRateLimit } from "@/lib/rate-limit";
import { auth } from "@/lib/auth";
import type { SSEEvent } from "@/types";

function sseEncode(event: SSEEvent): string {
  return `data: ${JSON.stringify(event)}\n\n`;
}

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

  // Validate user-provided API key format (never log the key itself)
  const trimmedKey = apiKey?.trim();
  const usingOwnKey = !!trimmedKey;
  if (usingOwnKey && !/^sk-ant-[a-zA-Z0-9_-]{20,}$/.test(trimmedKey!)) {
    return new Response(
      JSON.stringify({ error: "Invalid API key format" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  // Only rate-limit when using the server's API key
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

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: SSEEvent) => {
        controller.enqueue(encoder.encode(sseEncode(event)));
      };

      try {
        send({ type: "step", step: 1, label: "Fetching docs..." });
        const docs = await fetchAndExtract(url);

        send({ type: "step", step: 2, label: "Analyzing endpoints..." });

        send({ type: "step", step: 3, label: "Generating server..." });
        const result = await generateMCPServer(
          docs.content,
          docs.title,
          usingOwnKey ? trimmedKey! : undefined
        );

        send({ type: "complete", data: result });
      } catch (err) {
        const message =
          err instanceof FetchError
            ? err.message
            : err instanceof Error
              ? err.message
              : "Generation failed. Please try again.";
        send({ type: "error", message });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
