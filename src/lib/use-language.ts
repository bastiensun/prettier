import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const SUPPORTED_LANGUAGES = { java: "Java", json: "JSON" };
export type Language = keyof typeof SUPPORTED_LANGUAGES;

export const DEFAULT_LANGUAGE = "java";

const isLanguage = (language: string): language is Language =>
  language in SUPPORTED_LANGUAGES;

// eslint-disable-next-line consistent-return
const getExampleFormattedCode = (language: Language): string => {
  switch (language) {
    case "java":
      return `class  HelloWorld
{
  public  static  void  main( String[ ]  args ) 
  {
        System.out.println( "Hello, World!" ) ; 
    }
}`;
    case "json":
      return `     {
            "hello"     :     "world"}`;
  }
};

export const useLanguage = (): [Language, (language: Language) => void] => {
  const navigate = useNavigate();
  const { language } = useParams();

  useEffect(() => {
    if (!language || !isLanguage(language)) {
      navigate(
        {
          pathname: `/${DEFAULT_LANGUAGE}`,
          search: `?${new URLSearchParams({
            data: btoa(getExampleFormattedCode(DEFAULT_LANGUAGE)),
          })}`,
        },
        { replace: true },
      );
    }
  }, [language, navigate]);

  if (!language) {
    throw new Error("`language` is always defined (cf. `routes`)");
  }

  const setLanguage = (selectedLanguage: Language): void => {
    navigate({
      pathname: `/${selectedLanguage}`,
      search: `?${new URLSearchParams({
        data: btoa(getExampleFormattedCode(selectedLanguage)),
      })}`,
    });
  };

  if (!isLanguage(language)) {
    return [DEFAULT_LANGUAGE, setLanguage];
  }

  return [language, setLanguage];
};
