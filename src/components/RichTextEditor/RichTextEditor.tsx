import React, { useCallback, useMemo } from "react";
import isHotkey from "is-hotkey";
import { Editable, withReact, useSlate, Slate } from "slate-react";
import {
  Editor,
  Transforms,
  createEditor,
  Descendant,
  Element as SlateElement,
} from "slate";
import { withHistory } from "slate-history";
import {
  MdFormatBold,
  MdFormatItalic,
  MdFormatUnderlined,
  MdCode,
  MdLooksOne,
  MdLooksTwo,
  MdFormatQuote,
  MdFormatListNumbered,
  MdFormatListBulleted,
  MdFormatAlignLeft,
  MdFormatAlignCenter,
  MdFormatAlignRight,
  MdFormatAlignJustify,
} from "react-icons/md";
import { CustomElement } from "~/types/slate";

const HOTKEYS: Record<string, string> = {
  "mod+b": "bold",
  "mod+i": "italic",
  "mod+u": "underline",
  "mod+`": "code",
};

const LIST_TYPES = ["numbered-list", "bulleted-list"];
const TEXT_ALIGN_TYPES = ["left", "center", "right", "justify"];

const RichTextEditor: React.FC = () => {
  const renderElement = useCallback(
    (props: LocalElementPops) => <Element {...props} />,
    [],
  );
  const renderLeaf = useCallback(
    (props: LocalLeafPops) => <Leaf {...props} />,
    [],
  );
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  return (
    <Slate
      editor={editor}
      initialValue={initialValue as unknown as Descendant[]}
    >
      <Toolbar>
        <MarkButton
          format="bold"
          icon={<MdFormatBold className="text-4xl" />}
        />
        <MarkButton
          format="italic"
          icon={<MdFormatItalic className="text-4xl" />}
        />
        <MarkButton
          format="underline"
          icon={<MdFormatUnderlined className="text-4xl" />}
        />
        <MarkButton format="code" icon={<MdCode className="text-4xl" />} />
        <BlockButton
          format="heading-one"
          icon={<MdLooksOne className="text-4xl" />}
        />
        <BlockButton
          format="heading-two"
          icon={<MdLooksTwo className="text-4xl" />}
        />
        <BlockButton
          format="block-quote"
          icon={<MdFormatQuote className="text-4xl" />}
        />
        <BlockButton
          format="numbered-list"
          icon={<MdFormatListNumbered className="text-4xl" />}
        />
        <BlockButton
          format="bulleted-list"
          icon={<MdFormatListBulleted className="text-4xl" />}
        />
        <BlockButton
          format="left"
          icon={<MdFormatAlignLeft className="text-4xl" />}
        />
        <BlockButton
          format="center"
          icon={<MdFormatAlignCenter className="text-4xl" />}
        />
        <BlockButton
          format="right"
          icon={<MdFormatAlignRight className="text-4xl" />}
        />
        <BlockButton
          format="justify"
          icon={<MdFormatAlignJustify className="text-4xl" />}
        />
      </Toolbar>
      <Editable
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        placeholder="Enter some rich text…"
        spellCheck
        autoFocus
        onKeyDown={(event) => {
          for (const hotkey in HOTKEYS) {
            if (isHotkey(hotkey, event)) {
              event.preventDefault();
              const mark = HOTKEYS[hotkey];
              if (!mark) return;
              toggleMark(editor, mark);
            }
          }
        }}
      />
    </Slate>
  );
};

type OmiteCustomElement = Omit<CustomElement, "type">;
interface NewProperties extends Partial<OmiteCustomElement> {
  type?: string;
  align?: string;
}

const toggleBlock = (editor: Editor, format: string) => {
  const isActive = isBlockActive(
    editor,
    format,
    TEXT_ALIGN_TYPES.includes(format) ? "align" : "type",
  );
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      LIST_TYPES.includes(n.type) &&
      !TEXT_ALIGN_TYPES.includes(format),
    split: true,
  });
  let newProperties: NewProperties;
  if (TEXT_ALIGN_TYPES.includes(format)) {
    newProperties = {
      align: isActive ? undefined : format,
    };
  } else {
    newProperties = {
      type: isActive ? "paragraph" : isList ? "list-item" : format,
    };
  }
  Transforms.setNodes(editor, newProperties);

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block as unknown as CustomElement);
  }
};

const toggleMark = (editor: Editor, format: string) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

const isBlockActive = (editor: Editor, format: string, blockType = "type") => {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n) =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        (n as unknown as Record<string, string>)[blockType] === format,
    }),
  );

  return !!match;
};

const isMarkActive = (editor: Editor, format: string) => {
  const marks = Editor.marks(editor);
  return marks
    ? (marks as unknown as Record<string, boolean>)[format] === true
    : false;
};

type LocalElementPops = {
  attributes: React.HTMLAttributes<HTMLElement>;
  children: React.ReactNode;
  element: {
    type: string;
    align?: string;
  };
};

const Element: React.FC<{
  attributes: React.HTMLAttributes<HTMLElement>;
  children: React.ReactNode;
  element: {
    type: string;
    align?: string;
  };
}> = ({ attributes, children, element }) => {
  const style = { textAlign: element.align } as React.CSSProperties;
  switch (element.type) {
    case "block-quote":
      return (
        <blockquote style={style} {...attributes}>
          {children}
        </blockquote>
      );
    case "bulleted-list":
      return (
        <ul style={style} {...attributes}>
          {children}
        </ul>
      );
    case "heading-one":
      return (
        <h1 style={style} {...attributes}>
          {children}
        </h1>
      );
    case "heading-two":
      return (
        <h2 style={style} {...attributes}>
          {children}
        </h2>
      );
    case "list-item":
      return (
        <li style={style} {...attributes}>
          {children}
        </li>
      );
    case "numbered-list":
      return (
        <ol style={style} {...attributes}>
          {children}
        </ol>
      );
    default:
      return (
        <p style={style} {...attributes}>
          {children}
        </p>
      );
  }
};

type LocalLeafPops = {
  attributes: Record<string, boolean>;
  children: React.ReactNode;
  leaf: {
    bold?: boolean;
    code?: boolean;
    italic?: boolean;
    underline?: boolean;
  };
};

const Leaf: React.FC<LocalLeafPops> = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.code) {
    children = <code>{children}</code>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  return <span {...attributes}>{children}</span>;
};

const BlockButton: React.FC<{ format: string; icon: React.ReactNode }> = ({
  format,
  icon,
}) => {
  const editor = useSlate();
  return (
    <button
      type="button"
      style={{
        backgroundColor: isBlockActive(
          editor,
          format,
          TEXT_ALIGN_TYPES.includes(format) ? "align" : "type",
        )
          ? "#ddd"
          : "transparent",
      }}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleBlock(editor, format);
      }}
    >
      {icon}
    </button>
  );
};

const MarkButton: React.FC<{ format: string; icon: React.ReactNode }> = ({
  format,
  icon,
}) => {
  const editor = useSlate();
  return (
    <button
      type="button"
      style={{
        backgroundColor: isMarkActive(editor, format) ? "#ddd" : "transparent",
      }}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
    >
      {icon}
    </button>
  );
};

const Toolbar: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return <div>{children}</div>;
};

const initialValue = [
  {
    type: "paragraph",
    children: [
      { text: "This is editable " },
      { text: "rich", bold: true },
      { text: " text, " },
      { text: "much" },
      { text: " better than a " },
      { text: "<textarea>" },
      { text: "!" },
    ],
  },
];

export default RichTextEditor;
