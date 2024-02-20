import React from "react";
import { createEditor } from "slate";
import { ReactEditor, withReact } from "slate-react";
import { withHistory } from "slate-history";
import { assignNodeId } from "../plugins/slate/assign-node-id";
import { applyBaseConfiguration } from "../plugins/slate/base";
import { applyMarkConfiguration } from "../plugins/slate/marks";
import { applyHashtagConfiguration } from "../plugins/slate/hashtag";

const withNodeId = assignNodeId;
const withBase = applyBaseConfiguration;
const withMarks = applyMarkConfiguration;
const withHashtag = applyHashtagConfiguration;

export const useEditor = () => {
  const editor = React.useRef(
    withHashtag(
      withMarks(withNodeId(withHistory(withBase(withReact(createEditor())))))
    ) as ReactEditor
  );

  return {
    editor: editor.current,
  };
};
