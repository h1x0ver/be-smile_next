import { runInNewContext } from "node:vm";
import { describe, expect, it } from "vitest";
import { INTRO_BOOTSTRAP, INTRO_SESSION_KEY } from "./intro";

function boot(storage = new Map<string, string>(), reduced = false, blocked = false) {
  const root = { dataset: {} as Record<string, string> };
  const context = {
    document: { documentElement: root },
    window: { matchMedia: () => ({ matches: reduced }) },
    performance: { now: () => 100 },
    sessionStorage: {
      getItem: (key: string) => { if (blocked) throw new Error("blocked"); return storage.get(key); },
      setItem: (key: string, value: string) => storage.set(key, value),
    },
  };
  runInNewContext(INTRO_BOOTSTRAP, context);
  return { root, context };
}

describe("first-visit intro", () => {
  it("plays once across page reloads in the same session", () => {
    const storage = new Map<string, string>();
    expect(boot(storage).root.dataset.bsIntro).toBe("play");
    expect(storage.get(INTRO_SESSION_KEY)).toBe("1");
    expect(boot(storage).root.dataset.bsIntro).toBe("done");
  });
  it("skips animation for reduced motion", () => {
    expect(boot(new Map(), true).root.dataset.bsIntro).toBe("done");
  });
  it("still initializes safely when session storage is blocked", () => {
    expect(boot(new Map(), false, true).root.dataset.bsIntro).toBe("play");
  });
  it("does not replay an already initialized document", () => {
    const { root, context } = boot();
    root.dataset.bsIntro = "done";
    runInNewContext(INTRO_BOOTSTRAP, context);
    expect(root.dataset.bsIntro).toBe("done");
  });
});
