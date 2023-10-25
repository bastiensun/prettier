import { Textarea } from "@/components/ui/textarea";
import { Toaster } from "@/components/ui/toaster";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";
import { format } from "prettier";
// @ts-expect-error Could not find a declaration file for module `prettier-plugin-java`.
import parserJava from "prettier-plugin-java";
import { Highlight, themes } from "prism-react-renderer";
import {
  type ChangeEvent,
  type ClipboardEvent,
  type JSX,
  useState,
} from "react";

const placeholder = `class  HelloWorld
{
  public  static  void  main( String[ ]  args ) 
  {
        System.out.println( "Hello, World!" ) ; 
    }
}`;

const formattedPlaceholder = `class HelloWorld {

    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`;

const copyToClipboardMessage = "📋 Copy to clipboard";
const copiedToClipboardMessage = "✅ Copied to clipboard!";

export const App = (): JSX.Element => {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [result, setResult] = useState(formattedPlaceholder);
  const [source, setSource] = useState(placeholder);
  const [tooltipMessage, setTooltipMessage] = useState(copyToClipboardMessage);
  const { toast } = useToast();

  const handleChange = async (
    event: ChangeEvent<HTMLTextAreaElement>,
  ): Promise<void> => {
    setSource(event.target.value);

    let formatted = "";

    try {
      formatted = await format(event.target.value, {
        parser: "java",
        plugins: [parserJava],
        printWidth: 120,
        tabWidth: 4,
      });
    } catch (error) {
      if (error instanceof Error) {
        setResult(error.message);
        return;
      }
    }

    setResult(formatted);
    setTooltipMessage(copyToClipboardMessage);
  };

  const handlePaste = async (
    event: ClipboardEvent<HTMLTextAreaElement>,
  ): Promise<void> => {
    let formatted = "";

    try {
      formatted = await format(event.clipboardData.getData("text/plain"), {
        parser: "java",
        plugins: [parserJava],
        printWidth: 120,
        tabWidth: 4,
      });
    } catch {
      return;
    }

    await navigator.clipboard.writeText(formatted);

    toast({
      description: copiedToClipboardMessage,
    });

    setTooltipMessage(copiedToClipboardMessage);
  };

  const handleClick = async (): Promise<void> => {
    await navigator.clipboard.writeText(result);
    setIsTooltipOpen(true);
    setTooltipMessage(copiedToClipboardMessage);
  };

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
            <Textarea
              onChange={handleChange}
              onPaste={handlePaste}
              rows={(source.match(/\n/gu)?.length ?? 0) + 1}
              spellCheck={false}
              value={source}
            />
          </div>
          <Tooltip
            delayDuration={0}
            onOpenChange={(open): void => setIsTooltipOpen(open)}
            open={isTooltipOpen}
          >
            <TooltipTrigger asChild>
              <div
                onClick={handleClick}
                onKeyDown={handleClick}
                role="button"
                tabIndex={0}
              >
                <Highlight
                  code={result}
                  language="kotlin"
                  theme={themes.oneLight}
                >
                  {({
                    getLineProps,
                    getTokenProps,
                    style,
                    tokens,
                  }): JSX.Element => (
                    <pre style={style}>
                      {/* eslint-disable react/no-array-index-key*/}
                      {tokens.map((line, lineIndex) => (
                        <div key={lineIndex} {...getLineProps({ line })}>
                          {line.map((token, tokenIndex) => (
                            <span
                              key={tokenIndex}
                              {...getTokenProps({ token })}
                            />
                          ))}
                        </div>
                      ))}
                      {/* eslint-enable react/no-array-index-key */}
                    </pre>
                  )}
                </Highlight>
              </div>
            </TooltipTrigger>
            <TooltipContent align="start">{tooltipMessage}</TooltipContent>
          </Tooltip>
        </div>
      </div>
      <Toaster />
    </TooltipProvider>
  );
};
