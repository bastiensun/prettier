import "@testing-library/jest-dom/vitest";
import { App } from "./App";
import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";

test("happy path", () => {
  // Arrange

  // Act
  render(<App />);

  // Assert
  expect(screen.getByText("Hello, world!")).toBeVisible();
});
