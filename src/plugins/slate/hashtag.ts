import { Editor } from "slate";
import { SlateBlockTypes } from "../../constants/editor";

export const applyHashtagConfiguration = (editor: Editor) => {
  const { isInline, isVoid, markableVoid } = editor;

  editor.isInline = (element) => {
    return element.type === SlateBlockTypes.Hashtag ? true : isInline(element);
  };

  editor.isVoid = (element) => {
    return element.type === SlateBlockTypes.Hashtag ? true : isVoid(element);
  };

  editor.markableVoid = (element) => {
    return element.type === SlateBlockTypes.Hashtag || markableVoid(element);
  };

  return editor;
};