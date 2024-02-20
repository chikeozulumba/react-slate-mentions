import { Editor } from "slate";

export const applyMarkConfiguration = (editor: any) => {
  editor.isMarkActive = (mark: any): boolean => {
    const marks: any = Editor.marks(editor);
    return marks ? marks[mark] === true : false;
  };

  editor.toggleMark = (mark: string, prop: any = true) => {
    editor.isMarkActive(mark)
      ? Editor.removeMark(editor, mark)
      : Editor.addMark(editor, mark, prop);
  };
  return editor;
};
