import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { type JSX, type ReactNode } from "react";

type ProvidersProps = {
  readonly children: ReactNode;
};
export const Providers = ({ children }: ProvidersProps): JSX.Element => (
  <TooltipProvider>
    {children}
    <Toaster />
  </TooltipProvider>
);
