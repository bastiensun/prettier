import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SUPPORTED_LANGUAGES, useLanguage } from "@/lib/use-language";
import { type JSX } from "react";

export const LanguageSelect = (): JSX.Element => {
  const [language, setLanguage] = useLanguage();

  return (
    <Select onValueChange={setLanguage} value={language}>
      {/* eslint-disable-next-line react/forbid-component-props*/}
      <SelectTrigger className="w-28">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(SUPPORTED_LANGUAGES).map(([value, label]) => (
          <SelectItem key={value} value={value}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
