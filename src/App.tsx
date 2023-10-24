import { Textarea } from "@/components/ui/textarea";
import { Toaster } from "@/components/ui/toaster";
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

export const App = (): JSX.Element => {
  const [source, setSource] = useState(placeholder);
  const [result, setResult] = useState(formattedPlaceholder);
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
      description: "📋 Copied to clipboard!",
    });
  };

  const handleClick = async (): Promise<void> => {
    await navigator.clipboard.writeText(result);

    toast({
      description: "📋 Copied to clipboard!",
    });
  };

  return (
    <>
      <div className="m-10">
        <div className="grid grid-cols-1 gap-10 xl:grid-cols-2">
          <div>
            <Textarea
              onChange={handleChange}
              onPaste={handlePaste}
              rows={(source.match(/\n/gu)?.length ?? 0) + 1}
              spellCheck={false}
              value={source}
            />
          </div>
          <div
            onClick={handleClick}
            onKeyDown={handleClick}
            role="button"
            tabIndex={0}
          >
            <Highlight code={result} language="kotlin" theme={themes.oneLight}>
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
                        <span key={tokenIndex} {...getTokenProps({ token })} />
                      ))}
                    </div>
                  ))}
                  {/* eslint-enable react/no-array-index-key */}
                </pre>
              )}
            </Highlight>
          </div>
        </div>
      </div>
      <Toaster />
    </>
  );
};
