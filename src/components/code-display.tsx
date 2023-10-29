import { DiffView } from "@/components/diff-view";
import { FormattedCode } from "@/components/formatted-code";
import { UnformattedCode } from "@/components/unformatted-code";
import { useCode } from "@/lib/use-code";
import { type JSX, useState } from "react";

type CodeProps = {
  readonly disableDiffView: () => void;
  readonly isDiffView: boolean;
};

const UNFORMATTED_CODE_EXAMPLE = `class  HelloWorld
{
  public  static  void  main( String[ ]  args ) 
  {
        System.out.println( "Hello, World!" ) ; 
    }
}`;

const COPY_MESSAGE = "📋 Copy to clipboard";
const COPIED_MESSAGE = "✅ Copied to clipboard!";

export const CodeDisplay = ({
  disableDiffView,
  isDiffView,
}: CodeProps): JSX.Element => {
  const { formattedCode, setUnformattedCode, unformattedCode } = useCode(
    UNFORMATTED_CODE_EXAMPLE,
  );
  const [tooltipMessage, setTooltipMessage] = useState(COPY_MESSAGE);

  const resetTooltipMessage = (): void => setTooltipMessage(COPY_MESSAGE);
  const setTooltipToCopied = (): void => setTooltipMessage(COPIED_MESSAGE);

  if (isDiffView) {
    return (
      <div
        onClick={disableDiffView}
        onKeyDown={disableDiffView}
        role="button"
        tabIndex={0}
      >
        <DiffView newValue={formattedCode} oldValue={unformattedCode} />;
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-10 xl:grid-cols-2">
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
  );
};
