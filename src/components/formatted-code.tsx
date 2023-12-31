import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { type Language, useLanguage } from "@/lib/use-language";
import { Highlight, themes } from "prism-react-renderer";
import { type JSX, useState } from "react";

// eslint-disable-next-line consistent-return
const getHighlightLanguage = (language: Language): string => {
  switch (language) {
    case "java":
      return "kotlin";
    case "json":
      return "javascript";
  }
};

type FormattedCodeProps = {
  readonly formattedCode: string;
  readonly setTooltipToCopied: () => void;
  readonly tooltipMessage: string;
};

export const FormattedCode = ({
  formattedCode,
  setTooltipToCopied,
  tooltipMessage,
}: FormattedCodeProps): JSX.Element => {
  const [language] = useLanguage();
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  const handleClick = async (): Promise<void> => {
    await navigator.clipboard.writeText(formattedCode);
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
          <Highlight
            code={formattedCode}
            language={getHighlightLanguage(language)}
            theme={themes.oneLight}
          >
            {({ getLineProps, getTokenProps, style, tokens }): JSX.Element => (
              <pre className="overflow-x-scroll" style={style}>
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
