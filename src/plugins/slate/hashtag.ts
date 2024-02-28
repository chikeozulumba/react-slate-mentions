import { Editor } from "slate";
import { SlateBlockTypes } from "../../constants/editor";

export const applyHashtagConfiguration = (editor: Editor) => {
  const { isInline, isVoid, markableVoid } = editor;

  editor.isInline = (element: any) => {
    return [SlateBlockTypes.Mention, SlateBlockTypes.Hashtag].includes(element.type) ? true : isInline(element);
  };

  editor.isVoid = (element: any) => {
    return [SlateBlockTypes.Mention, SlateBlockTypes.Hashtag].includes(element.type) ? true : isVoid(element);
  };

  editor.markableVoid = (element: any) => {
    return [SlateBlockTypes.Mention, SlateBlockTypes.Hashtag].includes(element.type) || markableVoid(element);
  };

  return editor;
};
