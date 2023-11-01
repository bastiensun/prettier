import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { format } from "@/lib/format";
import { useLanguage } from "@/lib/use-language";
import { type ChangeEvent, type ClipboardEvent, type JSX } from "react";

type UnformattedCodeProps = {
  readonly copiedMessage: string;
  readonly resetTooltipMessage: () => void;
  readonly setTooltipToCopied: () => void;
  readonly setUnformattedCode: (code: string) => void;
  readonly unformattedCode: string;
};

export const UnformattedCode = ({
  copiedMessage,
  resetTooltipMessage,
  setTooltipToCopied,
  setUnformattedCode,
  unformattedCode,
}: UnformattedCodeProps): JSX.Element => {
  const [language] = useLanguage();
  const { toast } = useToast();

  const handleChange = async (
    event: ChangeEvent<HTMLTextAreaElement>,
  ): Promise<void> => {
    setUnformattedCode(event.target.value);
    resetTooltipMessage();
  };

  const handlePaste = async (
    event: ClipboardEvent<HTMLTextAreaElement>,
  ): Promise<void> => {
    let formattedCode: string;
    try {
      formattedCode = await format({
        code: event.clipboardData.getData("text/plain"),
        language,
      });
    } catch {
      return;
    }

    await navigator.clipboard.writeText(formattedCode);

    toast({
      description: copiedMessage,
    });

    setTooltipToCopied();
  };

  return (
    <pre>
      <Textarea
        onChange={handleChange}
        onPaste={handlePaste}
        rows={(unformattedCode.match(/\n/gu)?.length ?? 0) + 1}
        spellCheck={false}
        value={unformattedCode}
      />
    </pre>
  );
};
