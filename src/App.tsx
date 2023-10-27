import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { FormattedCode } from "@/formatted-code";
import { formatJava } from "@/lib/format-java";
import { Title } from "@/title";
import { UnformattedCode } from "@/unformatted-code";
import { type JSX, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const UNFORMATTED_CODE_EXAMPLE = `class  HelloWorld
{
  public  static  void  main( String[ ]  args ) 
  {
        System.out.println( "Hello, World!" ) ; 
    }
}`;

const COPY_MESSAGE = "📋 Copy to clipboard";
const COPIED_MESSAGE = "✅ Copied to clipboard!";

export const App = (): JSX.Element => {
  const [searchParameters, setSearchParameters] = useSearchParams({
    data: btoa(UNFORMATTED_CODE_EXAMPLE),
  });
  const [formattedCode, setFormattedCode] = useState("");
  const [tooltipMessage, setTooltipMessage] = useState(COPY_MESSAGE);

  const unformattedCode = atob(searchParameters.get("data") ?? "");

  useEffect(() => {
    const runEffect = async (): Promise<void> => {
      let content;
      try {
        content = await formatJava(unformattedCode);
      } catch (error) {
        if (error instanceof Error) {
          setFormattedCode(error.message);
        }

        return;
      }

      setFormattedCode(content);
    };

    runEffect();
  }, [unformattedCode]);

  const setUnformattedCode = (code: string): void => {
    setSearchParameters({ data: btoa(code) });
  };

  const resetTooltipMessage = (): void => setTooltipMessage(COPY_MESSAGE);
  const setTooltipToCopied = (): void => setTooltipMessage(COPIED_MESSAGE);

  return (
    <TooltipProvider>
      <div className="m-10">
        <Title />
        <div className="mt-6 grid grid-cols-1 gap-10 xl:grid-cols-2">
          <div>
            <UnformattedCode
              copiedMessage={COPIED_MESSAGE}
              resetTooltipMessage={resetTooltipMessage}
              setTooltipToCopied={setTooltipToCopied}
              setUnformattedCode={setUnformattedCode}
              unformattedCode={unformattedCode}
            />
          </div>
          <div>
            <FormattedCode
              formattedCode={formattedCode}
              setTooltipToCopied={setTooltipToCopied}
              tooltipMessage={tooltipMessage}
            />
          </div>
        </div>
      </div>
      <Toaster />
    </TooltipProvider>
  );
};
