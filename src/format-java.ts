import { format } from "prettier";
// @ts-expect-error Could not find a declaration file for module `prettier-plugin-java`.
import parserJava from "prettier-plugin-java";

export const formatJava = (code: string): Promise<string> =>
  format(code, {
    parser: "java",
    plugins: [parserJava],
    printWidth: 120,
    tabWidth: 4,
  });
