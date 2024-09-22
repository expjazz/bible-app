"use client";

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
import { useParams } from "next/navigation";
import { trpc } from "~/server/trpc/client";
import { Descendant } from "slate";
const LocalDockview = () => {
  const { articleId } = useParams<{ articleId?: string }>();
  const [article] = articleId
    ? trpc.getArticleById.useSuspenseQuery({ id: articleId })
    : [undefined];
  console.log("article", article, articleId);
  const bibleCountRef = useRef(0);
  const dockviewRef = useRef<DockviewApi>();
  const components: Record<
    string,
    React.FunctionComponent<IDockviewPanelProps>
  > = {
    bible: (props: IDockviewPanelProps) => {
      const api: DockviewPanelApi = props.api;
      // const groupApi: DockviewGroupPanelApi  = props.group.api;
      const containerApi: DockviewApi = props.containerApi;

      return <Bible />;
    },
    textEditor: (props: IDockviewPanelProps) => {
      const api: DockviewPanelApi = props.api;
      // const groupApi: DockviewGroupPanelApi  = props.group.api;
      const containerApi: DockviewApi = props.containerApi;

      return (
        <div>
          <h2>Text Editor</h2>
          <RichTextEditor
            initialValue={
              // @ts-expect-error article.content is of type JsonValue
              article ? (article.content as unknown as Descendant[]) : undefined
            }
            articleId={articleId}
          />
        </div>
      );
    },
  };
  function onReady(event: DockviewReadyEvent) {
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
