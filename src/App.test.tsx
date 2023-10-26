// eslint-disable-next-line import/no-unassigned-import
import "@testing-library/jest-dom/vitest";
import { App } from "./App";
import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, expect, test, vi } from "vitest";

afterEach(() => {
  vi.clearAllMocks();
  vi.resetAllMocks();
  vi.restoreAllMocks();
});

test("happy path", async () => {
  // Arrange
  const user = userEvent.setup();

  const placeholder = `class  HelloWorld
{
  public  static  void  main( String[ ]  args ) 
  {
        System.out.println( "Hello, World!" ) ; 
    }
}`;

  // Act
  render(<App />);

  // Assert
  expect(
    screen.getByRole("heading", { name: /prettier java playground/iu }),
  ).toBeVisible();

  const textarea = screen.getByRole("textbox");
  expect(textarea).toHaveDisplayValue(placeholder);

  // Act
  await user.clear(textarea);

  // Assert
  expect(textarea).toHaveDisplayValue("");

  // Act
  await user.type(textarea, "class HelloWorld {\\{}{\\}}");

  // Assert
  expect(textarea).toHaveDisplayValue("class HelloWorld {}");

  // Act
  await user.click(
    screen.getByRole("button", { name: "class HelloWorld { }" }),
  );

  // Assert
  waitFor(() =>
    expect(screen.getByText(/copied to clipboard/iu)).toBeVisible(),
  );
});

test("on paste", async () => {
  // Arrange
  const user = userEvent.setup();

  const unformattedCode = "  class  HelloWorld{     }  ";
  const formattedCode = "class HelloWorld { }";

  // Act
  render(<App />);

  const textarea = screen.getByRole("textbox");
  await user.click(textarea);
  await user.clear(textarea);
  await user.paste(unformattedCode);

  // Assert
  expect(textarea).toHaveDisplayValue(unformattedCode);
  expect(screen.getByText(/copied to clipboard/iu)).toBeVisible();

  // Act
  await user.hover(screen.getByRole("button", { name: formattedCode }));

  // Assert
  waitFor(() =>
    expect(
      screen.getByRole("tooltip", { name: /copied to clipboard/iu }),
    ).toBeVisible(),
  );
});

test("on hover", async () => {
  // Arrange
  const user = userEvent.setup();

  // Act
  render(<App />);
  const formattedCode = await screen.findByRole("button", {
    name: 'class HelloWorld { public static void main ( String [ ] args ) { System . out . println ( "Hello, World!" ) ; } }',
  });
  await user.hover(formattedCode);

  // Assert
  expect(
    screen.getByRole("tooltip", { name: /copy to clipboard/iu }),
  ).toBeVisible();

  // Act
  await user.click(formattedCode);

  // Assert
  expect(
    screen.getByRole("tooltip", { name: /copied to clipboard/iu }),
  ).toBeVisible();

  // Act
  const textarea = screen.getByRole("textbox");
  await user.clear(textarea);
  await user.type(textarea, "class HelloWorld {\\{}{\\}}");

  await user.hover(formattedCode);

  // Assert
  expect(
    screen.getByRole("tooltip", { name: /copy to clipboard/iu }),
  ).toBeVisible();
});
