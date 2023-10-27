// eslint-disable-next-line import/no-unassigned-import
import "@testing-library/jest-dom/vitest";
import { App } from "./App";
import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, expect, test, vi } from "vitest";

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  vi.resetAllMocks();
  vi.restoreAllMocks();
});

test("happy path", async () => {
  // Arrange
  const user = userEvent.setup();

  // Act
  render(<App />);

  // Assert
  expect(
    screen.getByRole("heading", { name: /prettier java playground/iu }),
  ).toBeVisible();

  const unformattedCodeTextarea = screen.getByRole("textbox");
  expect(unformattedCodeTextarea).toHaveDisplayValue(`class  HelloWorld
{
  public  static  void  main( String[ ]  args ) 
  {
        System.out.println( "Hello, World!" ) ; 
    }
}`);

  const formattedCode = screen.getByRole("button", {
    name: 'class HelloWorld { public static void main ( String [ ] args ) { System . out . println ( "Hello, World!" ) ; } }',
  });
  expect(formattedCode).toBeVisible();

  // Act
  await user.clear(unformattedCodeTextarea);

  // Assert
  expect(unformattedCodeTextarea).toHaveDisplayValue("");
  expect(formattedCode).toHaveTextContent("");

  // Act
  await user.type(
    unformattedCodeTextarea,
    "  class  HelloWorld  {\\{}{\\}} ; ",
  );

  // Assert
  expect(unformattedCodeTextarea).toHaveDisplayValue(
    "  class  HelloWorld  {} ; ",
  );
  expect(formattedCode).toHaveTextContent("class HelloWorld {}");
});

test("on paste on success", async () => {
  // Arrange
  const user = userEvent.setup();

  const unformattedCode = "  class  HelloWorld{     } ; ";
  const formattedCode = "class HelloWorld { }";

  // Act
  render(<App />);

  const unformattedCodeTextarea = screen.getByRole("textbox");
  await user.click(unformattedCodeTextarea);
  await user.clear(unformattedCodeTextarea);
  await user.paste(unformattedCode);

  // Assert
  expect(screen.getByText(/copied to clipboard/iu)).toBeVisible();

  // Act
  await user.hover(screen.getByRole("button", { name: formattedCode }));

  // Assert
  expect(
    screen.getByRole("tooltip", { name: /copied to clipboard/iu }),
  ).toBeVisible();
});

test("on paste on error", async () => {
  // Arrange
  const user = userEvent.setup();

  const invalidCode = "invalid code";

  // Act
  render(<App />);

  const unformattedCodeTextarea = screen.getByRole("textbox");
  await user.click(unformattedCodeTextarea);
  await user.clear(unformattedCodeTextarea);
  await user.paste(invalidCode);

  // Assert
  // expect(screen.queryByText(/copied to clipboard/iu)).not.toBeInTheDocument(); // FIXME

  // Act
  await user.hover(
    screen.getByRole("button", {
      name: /parsing errors detected in line/iu,
    }),
  );

  // Assert
  expect(
    screen.getByRole("tooltip", { name: /copy to clipboard/iu }),
  ).toBeVisible();
});

test("tooltip", async () => {
  // Arrange
  const user = userEvent.setup();

  // Act
  render(<App />);
  const formattedCode = screen.getByRole("button", {
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
  const unformattedCodeTextarea = screen.getByRole("textbox");
  await user.type(unformattedCodeTextarea, ";");

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
});
