import { Editor, Element } from "slate";
import { nanoid } from "nanoid";

export const makeNodeId = () => nanoid(16);

export const assignIdRecursively = (
  node: Element & { id: string; children: any }
) => {
  if (Element.isElement(node)) {
    if (!node.id) {
      node.id = makeNodeId();
    }
    node.children.forEach(assignIdRecursively);
  }
};

export const assignNodeId = (editor: Editor) => {
  const { apply } = editor;

  editor.apply = (operation) => {
    if (operation.type === "insert_node") {
      assignIdRecursively((operation as any).node);
      return apply(operation);
    }

    if (operation.type === "split_node") {
      (operation as any).properties.id = makeNodeId();
      return apply(operation);
    }

    return apply(operation);
  };

  return editor;
};
