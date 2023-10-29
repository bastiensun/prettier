// eslint-disable-next-line import/no-unassigned-import
import "@testing-library/jest-dom/vitest";
import { App } from "./app";
import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
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
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>,
  );

  // Assert
  expect(
    screen.getByRole("heading", {
      name: /prettier java playground/iu,
    }),
  ).toHaveTextContent(/prettier java playground/iu);

  const unformattedCodeTextarea = screen.getByRole("textbox");
  expect(unformattedCodeTextarea).toHaveDisplayValue(`class  HelloWorld
{
  public  static  void  main( String[ ]  args ) 
  {
        System.out.println( "Hello, World!" ) ; 
    }
}`);

  const formattedCode = await screen.findByRole("button", {
    name: 'class HelloWorld { public static void main ( String [ ] args ) { System . out . println ( "Hello, World!" ) ; } }',
  });
  expect(formattedCode).toBeVisible();

  expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  expect(unformattedCodeTextarea).toHaveAttribute("rows", "7");
  expect(unformattedCodeTextarea).toHaveAttribute("spellcheck", "false");

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
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>,
  );

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
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>,
  );

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
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>,
  );
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

test("diff view", async () => {
  // Arrange
  const user = userEvent.setup();

  // Act
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>,
  );

  // Assert
  const diffViewSwitch = screen.getByRole("switch", { name: /diff view/iu });
  expect(diffViewSwitch).not.toBeChecked();

  // Act
  await user.click(diffViewSwitch);

  // Assert
  expect(diffViewSwitch).toBeChecked();
  expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  expect(screen.getAllByRole("table")).toHaveLength(2);

  // Act
  await user.click(diffViewSwitch);

  // Assert
  expect(diffViewSwitch).not.toBeChecked();
  expect(screen.getByRole("textbox")).toBeVisible();
  expect(screen.queryByRole("table")).not.toBeInTheDocument();

  // Act
  await user.click(diffViewSwitch);
  await user.click(
    screen.getByRole("button", {
      name: '1 - class HelloWorld 1 + class HelloWorld { 2 - { 3 - public static void main( String[ ] args ) 2 + public static void main(String[] args) { 4 - { 3 + System.out.println("Hello, World!"); 5 - System.out.println( "Hello, World!" ) ; 4 + 6 5 } 7 6 } 1 - class HelloWorld 1 + class HelloWorld { 2 - { 3 - public static void main( String[ ] args ) 2 + public static void main(String[] args) { 4 - { 3 + System.out.println("Hello, World!"); 5 - System.out.println( "Hello, World!" ) ; 4 + 6 } 5 } 7 } 6 } ;',
    }),
  );

  // Assert
  expect(diffViewSwitch).not.toBeChecked();
});