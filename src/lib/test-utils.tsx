import { Providers } from "@/components/providers";
import { routes } from "@/routes";
import {
  render as reactTestingLibraryRender,
  type RenderOptions,
} from "@testing-library/react";
import { type ReactElement } from "react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
): ReturnType<typeof reactTestingLibraryRender> =>
  reactTestingLibraryRender(ui, { wrapper: Providers, ...options });

// eslint-disable-next-line import/export,react-refresh/only-export-components
export * from "@testing-library/react";
// eslint-disable-next-line import/export
export { customRender as render };

export const renderWithRouter = (): ReturnType<
  typeof reactTestingLibraryRender
> => {
  const router = createMemoryRouter(routes);
  return customRender(<RouterProvider router={router} />);
};
