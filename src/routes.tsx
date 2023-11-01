import { App } from "@/app";
import { DEFAULT_LANGUAGE } from "@/lib/use-language";
import { Navigate } from "react-router-dom";

export const routes = [
  {
    element: <App />,
    path: "/:language",
  },
  {
    element: <Navigate replace to={`/${DEFAULT_LANGUAGE}`} />,
    path: "*",
  },
];
