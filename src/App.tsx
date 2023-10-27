import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { FormattedCode } from "@/formatted-code";
import { UnformattedCode } from "@/unformatted-code";
import { type JSX, useState } from "react";

const UNFORMATTED_CODE_EXAMPLE = `class  HelloWorld
{
  public  static  void  main( String[ ]  args ) 
  {
        System.out.println( "Hello, World!" ) ; 
    }
}`;

const FORMATTED_CODE_EXAMPLE = `class HelloWorld {

    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`;

const COPY_MESSAGE = "📋 Copy to clipboard";
const COPIED_MESSAGE = "✅ Copied to clipboard!";

export const App = (): JSX.Element => {
  const [unformattedCode, setUnformattedCode] = useState(
    UNFORMATTED_CODE_EXAMPLE,
  );
  const [formattedCode, setFormattedCode] = useState(FORMATTED_CODE_EXAMPLE);

  const [tooltipMessage, setTooltipMessage] = useState(COPY_MESSAGE);

  const resetTooltipMessage = (): void => setTooltipMessage(COPY_MESSAGE);
  const setTooltipToCopied = (): void => setTooltipMessage(COPIED_MESSAGE);

  return (
    <TooltipProvider>
      <div className="m-10">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          ☕ Prettier Java{" "}
          <span className="ml-1 font-semibold text-muted-foreground">
            Playground
          </span>
        </h1>
        <div className="mt-6 grid grid-cols-1 gap-10 xl:grid-cols-2">
          <div>
            <UnformattedCode
              copiedMessage={COPIED_MESSAGE}
              setFormattedCode={setFormattedCode}
              setTooltipToCopied={setTooltipToCopied}
              setUnformattedCode={setUnformattedCode}
              unformattedCode={unformattedCode}
            />
          </div>
          <div>
            <FormattedCode
              formattedCode={formattedCode}
              resetTooltipMessage={resetTooltipMessage}
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
