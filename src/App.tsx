import { format } from "prettier";
// @ts-expect-error Could not find a declaration file for module `prettier-plugin-java`.
import parserJava from "prettier-plugin-java";
import { type ChangeEvent, type JSX, useState } from "react";

const placeholder = `class  HelloWorld
{
  public  static  void  main( String[ ]  args ) 
  {
        System.out.println( "Hello, World!" ) ; 
    }
}`;

const formattedPlaceholder = `class HelloWorld {

    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`;

export const App = (): JSX.Element => {
  const [source, setSource] = useState(placeholder);
  const [result, setResult] = useState(formattedPlaceholder);

  const handleChange = async (
    event: ChangeEvent<HTMLTextAreaElement>,
  ): Promise<void> => {
    setSource(event.target.value);

    let formatted = "";

    try {
      formatted = await format(event.target.value, {
        parser: "java",
        plugins: [parserJava],
        printWidth: 120,
        tabWidth: 4,
      });
    } catch (error) {
      if (error instanceof Error) {
        setResult(error.message);
        return;
      }
    }

    setResult(formatted);
  };

  return (
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      <div>
        <textarea
          cols={120}
          onChange={handleChange}
          rows={(source.match(/\n/gu)?.length ?? 0) + 10}
          spellCheck={false}
          value={source}
        />
      </div>
      <div>
        <pre>
          <code>{result}</code>
        </pre>
      </div>
    </div>
  );
};
