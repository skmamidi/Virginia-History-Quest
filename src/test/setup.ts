import "@testing-library/jest-dom/vitest";
import "vitest-axe/extend-expect";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
  configurable: true,
  value: () => null,
});

afterEach(() => {
  cleanup();
});
