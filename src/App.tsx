import { CodeDisplay } from "@/code-display";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Title } from "@/title";
import { useDiffView } from "@/use-diff-view";
import { type JSX } from "react";

export const App = (): JSX.Element => {
  const [isDiffView, setIsDiffView] = useDiffView();

  return (
    <TooltipProvider>
      <div className="m-10">
        <Title />
        <div className="mt-12 flex items-center space-x-2">
          <Switch
            checked={isDiffView}
            id="airplane-mode"
            onCheckedChange={(checked): void => setIsDiffView(checked)}
          />
          <Label htmlFor="airplane-mode">Diff View</Label>
        </div>
        <div className="mt-6">
          <CodeDisplay isDiffView={isDiffView} />
        </div>
      </div>
      <Toaster />
    </TooltipProvider>
  );
};
