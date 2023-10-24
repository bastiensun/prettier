// eslint-disable-next-line import/no-unassigned-import
import "@testing-library/jest-dom/vitest";
import { App } from "./App";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { expect, test } from "vitest";

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
  expect(screen.getByText(/copied to clipboard/iu));
});
