import { describe, expect, it } from "vitest";
import { decodeHtmlEntities, formatBlogDate } from "./displayText";

describe("CMS preview text", () => {
  it("decodes Azerbaijani named and numeric characters before truncation", () => {
    expect(decodeHtmlEntities("təsis&ccedil;isi &mdash; &#399; &#x259; &amp; g&uuml;l&uuml;ş"))
      .toBe("təsisçisi — Ə ə & gülüş");
  });
  it("decodes one layer and preserves unknown or invalid entities", () => {
    expect(decodeHtmlEntities("&amp;ccedil; &unknown; &#x110000; &#xD800;"))
      .toBe("&ccedil; &unknown; &#x110000; &#xD800;");
  });
});

describe("publication dates across SSR and browsers", () => {
  it.each([
    ["az", "22 mart 2026"],
    ["ru", "22 марта 2026 г."],
    ["en", "March 22, 2026"],
  ] as const)("formats %s without depending on installed ICU locales", (lang, expected) => {
    expect(formatBlogDate("2026-03-22T23:00:00Z", lang)).toBe(expected);
  });
  it("handles missing and malformed CMS values", () => {
    expect(formatBlogDate(null, "az")).toBeNull();
    expect(formatBlogDate("invalid", "az")).toBe("invalid");
  });
});
