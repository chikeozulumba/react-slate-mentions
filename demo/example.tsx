import { useState } from "react";
import { MentionEditor as Editor } from "../src/components/Editor";
import { EDITOR_INITIAL_STATE } from "../src/constants";

const items = [
  { key: "love", label: "Love" },
  { key: "bag", label: "Bag" },
  { key: "lane", label: "Lane" },
  { key: "life", label: "Life" },
  { key: "leap", label: "Leap" },
  { key: "light", label: "Light" },
];

interface Props {
  initialValue?: any;
  placeholder?: string;
  searchContainerClassName?: string;
  searchMenuItemClassName?: string;
  elementClassName?: string;
  editorClassname?: string;
  editorId?: string;
  uniqueHashTags?: boolean;
  uniqueHashMentions?: boolean;
}

function SlateMentionExample({
  initialValue = EDITOR_INITIAL_STATE,
  ...props
}: Props) {
  const [, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hashTags, setHashTags] = useState<
    { key: string; label: string; prefix: string }[]
  >([]);

  function handleHashtagSelected(data: {
    key: string;
    label: string;
    prefix: string;
  }): boolean | void {
    setHashTags([data, ...hashTags]);
  }

  const handleOnChange = () => {};

  async function handleSearch(search: string) {
    // setIsLoading(true);
    setSearchTerm(search);
    setTimeout(() => {
      setIsLoading(false);
    }, 5000);
  }

  return (
    <Editor
      editorClassname={props.editorClassname}
      editorId={props.editorId}
      placeholder={props.placeholder}
      hashTagEnabled
      menuItems={items}
      collectedItems={hashTags}
      isProcessing={isLoading}
      handleSearch={handleSearch}
      searchContainerClassName={
        props.searchContainerClassName ||
        "SlateMention__searchContainerClassName"
      }
      searchMenuItemClassName={
        props.searchMenuItemClassName || "SlateMention__searchMenuItemClassName"
      }
      elementClassName={
        props.elementClassName || "SlateMention__elementClassName"
      }
      handleHashtagSelected={handleHashtagSelected}
      handleOnChange={handleOnChange}
      initialValue={initialValue}
      uniqueHashTags={props.uniqueHashTags}
      uniqueHashMentions={props.uniqueHashMentions}
      loadingComponent={
        <h1 style={{ fontSize: "12px" }}>Please wait for me</h1>
      }
    />
  );
}

export default SlateMentionExample;
