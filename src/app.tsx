import { CodeDisplay } from "@/components/code-display";
import { Title } from "@/components/title";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useDiffView } from "@/lib/use-diff-view";
import { type JSX } from "react";

export const App = (): JSX.Element => {
  const [isDiffView, setIsDiffView] = useDiffView();

  const disableDiffView = (): void => setIsDiffView(false);

  return (
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
        <CodeDisplay
          disableDiffView={disableDiffView}
          isDiffView={isDiffView}
        />
      </div>
    </div>
  );
};
