import { format } from "@/lib/format";
import { useLanguage } from "@/lib/use-language";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const useUnformattedCode = (
  initialState: string,
): readonly [string, (code: string) => void] => {
  const [searchParameters, setSearchParameters] = useSearchParams({
    data: btoa(initialState),
  });
  const [unformattedCode, setUnformattedCode] = useState("");

  const encodedData = searchParameters.get("data");

  useEffect(() => {
    if (!encodedData) {
      setUnformattedCode("");
      return;
    }

    let decodedData: string;
    try {
      decodedData = atob(encodedData);
    } catch {
      setUnformattedCode("");
      return;
    }

    setUnformattedCode(decodedData);
  }, [encodedData]);

  const synchronizeUnformattedCodeAndDataQueryString = (
    updatedUnformattedCode: string,
  ): void => {
    if (updatedUnformattedCode === "") {
      setSearchParameters((previousSearchParameters) => {
        previousSearchParameters.delete("data");
        return searchParameters;
      });

      setUnformattedCode("");

      return;
    }

    let updatedEncodedData: string;
    try {
      updatedEncodedData = btoa(updatedUnformattedCode);
    } catch {
      return;
    }

    setSearchParameters((previousSearchParameters) => {
      previousSearchParameters.set("data", updatedEncodedData);
      return previousSearchParameters;
    });

    setUnformattedCode(updatedUnformattedCode);
  };

  return [unformattedCode, synchronizeUnformattedCodeAndDataQueryString];
};

export const useCode = (
  initialState: string,
): {
  formattedCode: string;
  setUnformattedCode: (code: string) => void;
  unformattedCode: string;
} => {
  const [language] = useLanguage();
  const [unformattedCode, setUnformattedCode] =
    useUnformattedCode(initialState);
  const [formattedCode, setFormattedCode] = useState("");

  useEffect(() => {
    const runEffect = async (): Promise<void> => {
      let content;
      try {
        content = await format({
          code: unformattedCode,
          language,
        });
      } catch (error) {
        if (error instanceof Error) {
          setFormattedCode(error.message);
        }

        return;
      }

      setFormattedCode(content);
    };

    runEffect();
  }, [language, unformattedCode]);

  return {
    formattedCode,
    setUnformattedCode,
    unformattedCode,
  };
};
