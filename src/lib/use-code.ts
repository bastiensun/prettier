import { formatJava } from "@/lib/format-java";
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
  const [unformattedCode, setUnformattedCode] =
    useUnformattedCode(initialState);
  const [formattedCode, setFormattedCode] = useState("");

  useEffect(() => {
    const runEffect = async (): Promise<void> => {
      let content;
      try {
        content = await formatJava(unformattedCode);
      } catch (error) {
        if (error instanceof Error) {
          setFormattedCode(error.message);
        }

        return;
      }

      setFormattedCode(content);
    };

    runEffect();
  }, [unformattedCode]);

  return {
    formattedCode,
    setUnformattedCode,
    unformattedCode,
  };
};
