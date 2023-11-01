import { render, renderWithRouter, screen } from "@/lib/test-utils";
import { routes } from "@/routes";
import { userEvent } from "@testing-library/user-event";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { describe, expect, it, test, vi } from "vitest";

test("happy path", async () => {
  // Arrange
  const user = userEvent.setup();

  // Act
  renderWithRouter();

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
  renderWithRouter();

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
  renderWithRouter();

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
  renderWithRouter();
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
  const router = createMemoryRouter(routes);

  // Act
  render(<RouterProvider router={router} />);

  // Assert
  const diffViewSwitch = screen.getByRole("switch", { name: /diff view/iu });
  expect(diffViewSwitch).not.toBeChecked();

  // Act
  await user.click(diffViewSwitch);

  // Assert
  expect(diffViewSwitch).toBeChecked();
  expect(router.state.location.search).toEqual(
    `?${new URLSearchParams({ diff: "true" }).toString()}`,
  );
  expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  expect(screen.getAllByRole("table")).toHaveLength(2);

  // Act
  await user.click(diffViewSwitch);

  // Assert
  expect(diffViewSwitch).not.toBeChecked();
  expect(router.state.location.search).toEqual("");
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

describe("data query string", () => {
  it("should not be decoded when it cannot be decoded", async () => {
    // Arrange
    const urlSearchParameters = new URLSearchParams({
      data: "undefined",
    });
    const router = createMemoryRouter(routes, {
      initialEntries: [`/java?${urlSearchParameters.toString()}`],
    });

    // Act
    render(<RouterProvider router={router} />);

    // Assert
    expect(screen.getByRole("textbox")).toHaveDisplayValue("");
  });

  it("should not be set when unformatted code is empty", async () => {
    // Arrange
    const user = userEvent.setup();
    const router = createMemoryRouter(routes);

    // Act
    render(<RouterProvider router={router} />);

    await user.clear(screen.getByRole("textbox"));

    // Assert
    expect(router.state.location.search).toEqual("");
    expect(screen.getByRole("textbox")).toHaveDisplayValue("");
  });

  it("should not be set when unformatted code cannot be encoded", async () => {
    // Arrange
    const user = userEvent.setup();
    const router = createMemoryRouter(routes);

    // Act
    render(<RouterProvider router={router} />);

    const unformattedCodeTextarea = screen.getByRole("textbox");
    await user.clear(unformattedCodeTextarea);
    await user.type(unformattedCodeTextarea, "☀️");

    // Assert
    expect(router.state.location.search).toEqual("");
    expect(unformattedCodeTextarea).toHaveDisplayValue("");
  });

  it("should be updated when unformatted code is updated", async () => {
    // Arrange
    const user = userEvent.setup();
    const router = createMemoryRouter(routes);

    const expectedUpdatedUnformattedCode = "record HelloWorld()";

    // Act
    render(<RouterProvider router={router} />);

    const unformattedCodeTextarea = screen.getByRole("textbox");
    await user.clear(unformattedCodeTextarea);
    await user.type(unformattedCodeTextarea, expectedUpdatedUnformattedCode);

    // Assert
    expect(router.state.location.search).toEqual(
      `?${new URLSearchParams({
        data: btoa(expectedUpdatedUnformattedCode),
      }).toString()}`,
    );
    expect(screen.getByRole("textbox")).toHaveDisplayValue(
      expectedUpdatedUnformattedCode,
    );
  });
});

test("language pathname", async () => {
  // Arrange
  const user = userEvent.setup();
  const router = createMemoryRouter(routes, { initialEntries: ["/"] });

  // Act
  render(<RouterProvider router={router} />);

  // Assert
  expect(router.state.location.pathname).toEqual("/java");

  const title = screen.getByRole("heading", {
    name: /prettier java playground/iu,
  });
  expect(title).toHaveTextContent(/prettier java playground/iu);

  const unformattedCodeTextarea = screen.getByRole("textbox");
  expect(unformattedCodeTextarea).toHaveTextContent(
    'class HelloWorld { public static void main( String[ ] args ) { System.out.println( "Hello, World!" ) ; } }',
  );

  // Arrange
  window.HTMLElement.prototype.hasPointerCapture = vi.fn();
  window.HTMLElement.prototype.scrollIntoView = vi.fn();

  // Act
  const languageSelect = screen.getByRole("combobox");
  await user.click(languageSelect);

  // Assert
  expect(
    screen.getByRole("option", { name: /java/iu, selected: true }),
  ).toBeVisible();

  // Act
  await user.click(
    screen.getByRole("option", { name: /json/iu, selected: false }),
  );
  await user.click(languageSelect);

  // Assert
  expect(
    screen.getByRole("option", { name: /json/iu, selected: true }),
  ).toBeVisible();
  expect(router.state.location.pathname).toEqual("/json");
  expect(title).toHaveTextContent(/prettier json playground/iu);
  expect(unformattedCodeTextarea).toHaveTextContent('{ "hello" : "world"}');

  // Act
  await user.click(
    screen.getByRole("option", { name: /java/iu, selected: false }),
  );

  // Assert
  expect(unformattedCodeTextarea).toHaveTextContent(
    'class HelloWorld { public static void main( String[ ] args ) { System.out.println( "Hello, World!" ) ; } }',
  );
});

test.each(["/invalid-language", "/invalid-language/other-pathname"])(
  "invalid pathname ('%s')",
  async (invalidPathname) => {
    // Arrange
    const user = userEvent.setup();
    const router = createMemoryRouter(routes, {
      initialEntries: [invalidPathname],
    });

    // Act
    render(<RouterProvider router={router} />);

    // Assert
    expect(router.state.location.pathname).toEqual("/java");

    // Arrange
    window.HTMLElement.prototype.hasPointerCapture = vi.fn();
    window.HTMLElement.prototype.scrollIntoView = vi.fn();

    // Act
    await user.click(screen.getByRole("combobox"));

    // Assert
    expect(
      screen.getByRole("option", { name: /java/iu, selected: true }),
    ).toBeVisible();
  },
);

test("json", async () => {
  // Arrange
  const user = userEvent.setup();
  const router = createMemoryRouter(routes, {
    initialEntries: ["/json"],
  });

  window.HTMLElement.prototype.hasPointerCapture = vi.fn();
  window.HTMLElement.prototype.scrollIntoView = vi.fn();

  // Act
  render(<RouterProvider router={router} />);

  const unformattedCodeTextarea = screen.getByRole("textbox");
  await user.clear(unformattedCodeTextarea);
  await user.type(
    unformattedCodeTextarea,
    '{\\[}"Immortality","Heat Immunity","Inferno","Teleportation","Interdimensional travel"{\\]}',
  );

  // Assert
  expect(
    screen.getByRole("button", {
      name: '[ "Immortality" , "Heat Immunity" , "Inferno" , "Teleportation" , "Interdimensional travel" ]',
    }),
  ).toBeVisible();
});
