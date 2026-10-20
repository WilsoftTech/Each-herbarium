import { afterEach, vi } from "vitest";
import { developmentDatabaseUrl, TEST_SCHEMA } from "../test-database";

// Every test talks to the dedicated test schema (rebuilt by tests/global-setup.ts),
// never to development content.
process.env.DATABASE_URL = developmentDatabaseUrl();
process.env.DATABASE_SCHEMA = TEST_SCHEMA;
process.env.NEON_AUTH_COOKIE_SECRET ??= "test-secret-that-is-at-least-32-characters-long";
process.env.NEON_AUTH_BASE_URL ??= "https://auth.example/neondb/auth";

// Cache Components APIs only work inside Next.js. Tagging is a no-op here, and
// the expiry calls are spies so tests can assert which tags a change expires.
vi.mock("next/cache", () => ({
  cacheLife: vi.fn(),
  cacheTag: vi.fn(),
  updateTag: vi.fn(),
  revalidateTag: vi.fn(),
  revalidatePath: vi.fn(),
  refresh: vi.fn(),
}));

// Sessions come from a test double (tests/integration/auth-double.ts); the
// authorisation code under test (requireAdmin, permissions, actions) is real.
vi.mock("@/services/auth", () => import("../integration/auth-double"));

// Request APIs for Server Actions and admin pages called directly in tests.
vi.mock("next/headers", () => ({
  headers: vi.fn(async () => new Headers()),
  cookies: vi.fn(async () => ({ get: () => undefined, getAll: () => [], has: () => false })),
}));

// Browser API stand-ins for component tests that opt into jsdom with
// `// @vitest-environment jsdom`. Node-environment tests skip all of this.
if (typeof window !== "undefined") {
  const { cleanup } = await import("@testing-library/react");
  const { MotionGlobalConfig } = await import("motion/react");

  // Motion animations complete instantly so presence and exit states settle.
  MotionGlobalConfig.skipAnimations = true;

  /** Set to true in a test to emulate `prefers-reduced-motion: reduce`. */
  globalThis.__reducedMotion = false;

  window.matchMedia = (query: string): MediaQueryList => {
    const reduce = globalThis.__reducedMotion;
    const matches =
      (query.includes("prefers-reduced-motion: reduce") && reduce) ||
      (query.includes("prefers-reduced-motion: no-preference") && !reduce);
    return {
      matches,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    };
  };

  class NoopObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  }
  window.ResizeObserver ??= NoopObserver as unknown as typeof ResizeObserver;
  window.IntersectionObserver ??= NoopObserver as unknown as typeof IntersectionObserver;

  afterEach(() => {
    cleanup();
    globalThis.__reducedMotion = false;
    document.documentElement.removeAttribute("style");
  });
}

declare global {
  var __reducedMotion: boolean;
}
