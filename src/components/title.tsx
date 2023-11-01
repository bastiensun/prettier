import { SUPPORTED_LANGUAGES, useLanguage } from "@/lib/use-language";
import { type JSX } from "react";

export const Title = (): JSX.Element => {
  const [language] = useLanguage();

  return (
    <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
      ☕ Prettier {SUPPORTED_LANGUAGES[language]}{" "}
      <span className="ml-1 font-semibold text-muted-foreground">
        Playground
      </span>
    </h1>
  );
};
