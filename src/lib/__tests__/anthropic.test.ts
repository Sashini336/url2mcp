import { describe, it, expect } from "vitest";
import { extractJSON } from "../anthropic";

describe("extractJSON", () => {
  it("parses clean JSON", () => {
    const input = '{"metadata":{"name":"test"},"files":{},"config":{"mcpServers":{}}}';
    const result = extractJSON(input);
    expect(result.metadata.name).toBe("test");
  });

  it("strips markdown code fences", () => {
    const input = '```json\n{"metadata":{"name":"test"},"files":{},"config":{"mcpServers":{}}}\n```';
    const result = extractJSON(input);
    expect(result.metadata.name).toBe("test");
  });

  it("strips preamble text before JSON", () => {
    const input = 'Here is the generated server:\n\n{"metadata":{"name":"test"},"files":{},"config":{"mcpServers":{}}}';
    const result = extractJSON(input);
    expect(result.metadata.name).toBe("test");
  });

  it("strips trailing text after JSON", () => {
    const input = '{"metadata":{"name":"test"},"files":{},"config":{"mcpServers":{}}}\n\nLet me know if you need changes.';
    const result = extractJSON(input);
    expect(result.metadata.name).toBe("test");
  });

  it("throws on invalid JSON", () => {
    expect(() => extractJSON("not json at all")).toThrow();
  });
});
