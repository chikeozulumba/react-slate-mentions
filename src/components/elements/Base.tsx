import { SlateBlockTypes } from "../../constants";
import { Hashtag } from "./Hashtag";
import { Mention } from "./Mention";

export const BaseEditorElement = (props: any) => {
  const { attributes, children, element } = props;
  switch (element.type) {
    case SlateBlockTypes.Hashtag:
      return <Hashtag {...props} />;
    case SlateBlockTypes.Mention:
      return <Mention {...props} />;
    default:
      return <p {...attributes}>{children}</p>;
  }
};