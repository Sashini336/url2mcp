import { NextRequest, NextResponse } from "next/server";
import { fetchAndExtract, FetchError } from "@/lib/doc-fetcher";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "Missing required field: url" },
        { status: 400 }
      );
    }

    const result = await fetchAndExtract(url);
    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof FetchError) {
      return NextResponse.json(
        { error: err.message },
        { status: err.statusCode }
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
