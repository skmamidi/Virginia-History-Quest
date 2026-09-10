import "@testing-library/jest-dom/vitest";
import "vitest-axe/extend-expect";
import { cleanup } from "@testing-library/react";
import { afterEach, beforeEach, vi } from "vitest";

Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
  configurable: true,
  value: () => null,
});

afterEach(() => {
  cleanup();
});

beforeEach(() => {
  window.history.replaceState(null, "", "/");
  window.scrollTo = vi.fn();
  HTMLElement.prototype.scrollIntoView = vi.fn();
});
