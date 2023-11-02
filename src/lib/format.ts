import { type Language } from "@/lib/use-language";
import { format as prettierFormat } from "prettier";
import * as prettierPluginBabel from "prettier/plugins/babel";
import * as prettierPluginEstree from "prettier/plugins/estree";
// @ts-expect-error Could not find a declaration file for module `prettier-plugin-java`.
import parserJava from "prettier-plugin-java";

const formatJava = async (code: string): Promise<string> =>
  prettierFormat(code, {
    parser: "java",
    plugins: [parserJava],
    printWidth: 120,
    tabWidth: 4,
  });

const formatJson = async (code: string): Promise<string> =>
  prettierFormat(code, {
    parser: "json",
    plugins: [prettierPluginBabel, prettierPluginEstree],
  });

type FormatParameters = {
  code: string;
  language: Language;
};

export const format = async ({
  code,
  language, // eslint-disable-next-line consistent-return
}: FormatParameters): Promise<string> => {
  switch (language) {
    case "java":
      return formatJava(code);
    case "json":
      return formatJson(code);
  }
};
