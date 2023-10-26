import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatJava } from "@/format-java";
import { Highlight, themes } from "prism-react-renderer";
import { type JSX, useEffect, useState } from "react";

type FormattedCodeProps = {
  readonly resetTooltipMessage: () => void;
  readonly setTooltipToCopied: () => void;
  readonly tooltipMessage: string;
  readonly unformattedCode: string;
};

export const FormattedCode = ({
  resetTooltipMessage,
  setTooltipToCopied,
  tooltipMessage,
  unformattedCode,
}: FormattedCodeProps): JSX.Element => {
  const [content, setContent] = useState("");
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  useEffect(() => {
    const formatUnformattedCode = async (): Promise<void> => {
      let formattedCode = "";
      try {
        formattedCode = await formatJava(unformattedCode);
      } catch (error) {
        if (error instanceof Error) {
          setContent(error.message);
        }

        return;
      }

      resetTooltipMessage();
      setContent(formattedCode);
    };

    formatUnformattedCode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unformattedCode]);

  const handleClick = async (): Promise<void> => {
    await navigator.clipboard.writeText(content);
    setIsTooltipOpen(true);
    setTooltipToCopied();
  };

  return (
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
          <Highlight code={content} language="kotlin" theme={themes.oneLight}>
            {({ getLineProps, getTokenProps, style, tokens }): JSX.Element => (
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
      </TooltipTrigger>
      <TooltipContent align="start">{tooltipMessage}</TooltipContent>
    </Tooltip>
  );
};
