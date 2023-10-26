import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { formatJava } from "@/format-java";
import { type ChangeEvent, type JSX } from "react";

type UnformattedCodeProps = {
  readonly copiedMessage: string;
  readonly setTooltipToCopied: () => void;
  readonly setUnformattedCode: (code: string) => void;
  readonly unformattedCode: string;
};

export const UnformattedCode = ({
  copiedMessage,
  setTooltipToCopied,
  setUnformattedCode,
  unformattedCode,
}: UnformattedCodeProps): JSX.Element => {
  const { toast } = useToast();

  const handleChange = async (
    event: ChangeEvent<HTMLTextAreaElement>,
  ): Promise<void> => setUnformattedCode(event.target.value);

  const handlePaste = async (): Promise<void> => {
    let formattedCode = "";
    try {
      formattedCode = await formatJava(unformattedCode);
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
    <Textarea
      onChange={handleChange}
      onPaste={handlePaste}
      rows={(unformattedCode.match(/\n/gu)?.length ?? 0) + 1}
      spellCheck={false}
      value={unformattedCode}
    />
  );
};
