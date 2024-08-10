import React, { useRef } from "react";
import {
  DockviewApi,
  DockviewGroupPanelApi,
  DockviewPanelApi,
  DockviewReact,
  DockviewReadyEvent,
  IDockviewPanelProps,
} from "dockview";
import "../../../node_modules/dockview/dist/styles/dockview.css";

import Bible from "../Bible/Bible";
import RichTextEditor from "../RichTextEditor/RichTextEditor";
const LocalDockview = () => {
  const bibleCountRef = useRef(0);
  const dockviewRef = useRef<DockviewApi>(null);
  const components: Record<
    string,
    React.FunctionComponent<IDockviewPanelProps>
  > = {
    bible: (props: IDockviewPanelProps) => {
      console.log("props", props);
      const api: DockviewPanelApi = props.api;
      // const groupApi: DockviewGroupPanelApi  = props.group.api;
      const containerApi: DockviewApi = props.containerApi;

      return <Bible />;
    },
    textEditor: (props: IDockviewPanelProps) => {
      console.log("props", props);
      const api: DockviewPanelApi = props.api;
      // const groupApi: DockviewGroupPanelApi  = props.group.api;
      const containerApi: DockviewApi = props.containerApi;

      return (
        <div>
          <h2>Text Editor</h2>
          <RichTextEditor />
        </div>
      );
    },
  };
  function onReady(event: DockviewReadyEvent) {
    console.log("onReady");
    const api: DockviewApi = event.api;
    api.addPanel({
      id: "textEditor",
      component: "textEditor",
    });
    dockviewRef.current = api;
  }

  return (
    <div className="relative max-h-[80vh] w-full">
      <DockviewReact
        className="dockview-theme-light"
        components={components}
        onReady={onReady}
      />
      <button
        onClick={() => {
          bibleCountRef.current += 1;
          dockviewRef.current?.addPanel({
            id: `bible_${bibleCountRef.current}`,
            component: "bible",
          });
        }}
      >
        Open Bible
      </button>
    </div>
  );
};

export default LocalDockview;
