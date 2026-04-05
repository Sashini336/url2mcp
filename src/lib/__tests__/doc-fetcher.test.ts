import { describe, it, expect } from "vitest";
import { extractContent } from "../doc-fetcher";

const SAMPLE_HTML = `
<html>
<head><title>Stripe API Reference</title></head>
<body>
  <nav><a href="/">Home</a></nav>
  <script>var x = 1;</script>
  <style>.foo { color: red; }</style>
  <main>
    <h1>Create a PaymentIntent</h1>
    <p>Creates a PaymentIntent object. POST /v1/payment_intents</p>
    <h2>Parameters</h2>
    <p>amount — required. Amount intended to be collected.</p>
    <p>currency — required. Three-letter ISO currency code.</p>
  </main>
  <footer>Copyright 2024</footer>
</body>
</html>`;

describe("extractContent", () => {
  it("extracts main content and strips nav/footer/script/style", () => {
    const result = extractContent(SAMPLE_HTML);
    expect(result.content).toContain("Create a PaymentIntent");
    expect(result.content).toContain("POST /v1/payment_intents");
    expect(result.content).not.toContain("var x = 1");
    expect(result.content).not.toContain("Copyright 2024");
    expect(result.content).not.toContain(".foo");
    expect(result.title).toBe("Stripe API Reference");
  });

  it("returns short content for thin pages", () => {
    const thinHTML = "<html><head><title>T</title></head><body><main><p>Hi</p></main></body></html>";
    const result = extractContent(thinHTML);
    expect(result.content.length).toBeLessThan(500);
  });
});
