import { type JSX } from "react";
import ReactDiffViewer, { DiffMethod } from "react-diff-viewer-continued";

type DiffViewProps = {
  readonly newValue: string;
  readonly oldValue: string;
};

type DiffViewerProps = DiffViewProps & {
  readonly splitView: boolean;
};

const DiffViewer = ({
  newValue,
  oldValue,
  splitView,
}: DiffViewerProps): JSX.Element => (
  <ReactDiffViewer
    compareMethod={DiffMethod.LINES}
    newValue={newValue}
    oldValue={oldValue}
    splitView={splitView}
  />
);

const DiffViewMobile = ({ newValue, oldValue }: DiffViewProps): JSX.Element => (
  <div className="block xl:hidden">
    <DiffViewer newValue={newValue} oldValue={oldValue} splitView={false} />
  </div>
);

const DiffViewDesktop = ({
  newValue,
  oldValue,
}: DiffViewProps): JSX.Element => (
  <div className="hidden xl:block">
    <DiffViewer newValue={newValue} oldValue={oldValue} splitView />
  </div>
);

export const DiffView = ({
  newValue,
  oldValue,
}: DiffViewProps): JSX.Element => (
  <>
    <DiffViewMobile newValue={newValue} oldValue={oldValue} />
    <DiffViewDesktop newValue={newValue} oldValue={oldValue} />
  </>
);
