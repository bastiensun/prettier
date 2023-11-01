// eslint-disable-next-line import/no-unassigned-import
import "@testing-library/jest-dom/vitest";
import { cleanup } from "./src/lib/test-utils";
import { afterEach } from "vitest";

afterEach(() => {
  cleanup();
});
