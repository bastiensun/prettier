import { useSearchParams } from "react-router-dom";

export const useDiffView = (): [boolean, (diff: boolean) => void] => {
  const [searchParameters, setSearchParameters] = useSearchParams();
  const diff = searchParameters.get("diff") === "true";

  const synchronizeIsDiffAndDiffQueryString = (updatedDiff: boolean): void => {
    if (!updatedDiff) {
      setSearchParameters((previousSearchParameters) => {
        previousSearchParameters.delete("diff");
        return previousSearchParameters;
      });
      return;
    }

    setSearchParameters((previousSearchParameters) => {
      previousSearchParameters.set("diff", updatedDiff.toString());
      return previousSearchParameters;
    });
  };

  return [diff, synchronizeIsDiffAndDiffQueryString];
};
