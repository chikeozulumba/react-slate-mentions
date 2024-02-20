import { Range, Editor as SlateEditor, Transforms } from "slate";
import {
  Editable,
  ReactEditor,
  Slate,
} from "slate-react";
import type { Descendant } from "slate";
import { useEditor } from "../hooks/useEditor";
import { EDITOR_INITIAL_STATE, SlateBlockTypes } from "../constants/editor";
import {
  CSSProperties,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Portal } from "./Portal";
import { useClickOutside } from "../hooks/useClickOutside";

type EditorProps = {
  initialValue?: Descendant[] | null;
  handleOnChange?: (data: Descendant[]) => void;
  uniqueHashTags?: boolean;
  hashTags?: { key: string; label: string }[];
  hashTagItems?: { key: string; label: string }[];
  handleSearch?: (search: string) => void;
  hashTagEnabled?: boolean;
  isHasTagSearching?: boolean;
  searchContainerClassName?: string;
  searchContainerStyle?: CSSProperties;
  searchMenuItemClassName?: string;
  searchMenuItemStyle?: CSSProperties;
  handleHashtagSelected?: (data: { key: string; label: string }) => void;
  elementClassName?: string;
  placeholder?: string;
};

export const Editor = (props: EditorProps) => {
  const { editor } = useEditor() as any;

  const ref = useRef<HTMLDivElement>(null);
  const [target, setTarget] = useState<Range | null>();
  const [index, setIndex] = useState(0);
  const [search, setSearch] = useState("");

  useClickOutside(ref, () => {
    setTarget(null);
  });

  const Leaf = ({ attributes, children, leaf }: any) => {
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

  const Element = (props: any) => {
    const { attributes, children, element } = props;
    switch (element.type) {
      case SlateBlockTypes.Hashtag:
        return <Hashtag {...props} />;
      default:
        return <p {...attributes}>{children}</p>;
    }
  };

  const Hashtag = ({ attributes, children, element }: any) => {
    const className = props.elementClassName;

    return (
      <span
        {...attributes}
        contentEditable={false}
        data-cy={`hashtag-${element.value.label.replace(" ", "-")}`}
        className={className}
      >
        #{element.value.label}
        {children}
      </span>
    );
  };

  const renderElement = (elProps: any) => <Element {...elProps} />;
  const renderLeaf = useCallback((props: any) => <Leaf {...props} />, []);

  const chars = useMemo(() => {
    const items = props.hashTagItems || [];

    return items.length === 0 && !props.isHasTagSearching
      ? [
          {
            key: "is-new",
            label: search,
          },
        ]
      : items;
  }, [props.hashTagItems, props.isHasTagSearching, search]);

  useEffect(() => {
    if (target && chars.length > 0) {
      const el = ref.current;
      const domRange = ReactEditor.toDOMRange(editor, target);
      const rect = domRange.getBoundingClientRect();
      if (el) {
        el.style.top = `${rect.top + window.pageYOffset + 24}px`;
        el.style.left = `${rect.left + window.pageXOffset}px`;
      }
    }
  }, [chars.length, editor, index, search, target]);

  function editorOnChange(data: Descendant[]) {
    const { selection } = editor;

    if (selection && Range.isCollapsed(selection) && props.hashTagEnabled) {
      const [start] = Range.edges(selection);
      const wordBefore = SlateEditor.before(editor, start, { unit: "word" });
      const before = wordBefore && SlateEditor.before(editor, wordBefore);
      const beforeRange = before && SlateEditor.range(editor, before, start);
      const beforeText = beforeRange && SlateEditor.string(editor, beforeRange);
      const beforeMatch = beforeText && beforeText.match(/^#(\w+)$/);
      const after = SlateEditor.after(editor, start);
      const afterRange = SlateEditor.range(editor, start, after);
      const afterText = SlateEditor.string(editor, afterRange);
      const afterMatch = afterText.match(/^(\s|$)/);

      if (beforeMatch && afterMatch) {
        setTarget(beforeRange);
        setSearch(beforeMatch[1]);
        setIndex(0);
        props.handleSearch?.(beforeMatch[1]);
        return;
      }
    }
    props.handleOnChange?.(data)
    setTarget(null);
  }

  const insertHashtag = useCallback(
    (editor: any, value: any) => {
      if (!value) return;
      // check if exists
      const exists =
        (props.hashTags || [])?.filter(
          ({ label }) => value.label.toLowerCase() === label.toLowerCase()
        ).length > 0;

      if (exists && props.uniqueHashTags) return;

      const hashtag = {
        type: SlateBlockTypes.Hashtag,
        value,
        children: [{ text: "" }],
      };
      Transforms.insertNodes(editor, hashtag);
      Transforms.move(editor, { edge: "end" });
      setIndex(0)
    },
    [props.hashTags, props.uniqueHashTags]
  );

  const onKeyDown = useCallback(
    (event: any) => {
      if (target && chars.length > 0) {
        switch (event.key) {
          case "ArrowDown":
            event.preventDefault();
            const prevIndex = index >= chars.length - 1 ? 0 : index + 1;
            setIndex(prevIndex);
            break;
          case "ArrowUp":
            event.preventDefault();
            const nextIndex = index <= 0 ? chars.length - 1 : index - 1;
            setIndex(nextIndex);
            break;
          case "Tab":
          case "Enter":
            event.preventDefault();
            Transforms.select(editor, target);
            insertHashtag(editor, chars[index]);
            setTarget(null);
            break;
          case "Escape":
            event.preventDefault();
            setTarget(null);
            break;
        }
      }
    },
    [chars, editor, index, insertHashtag, target]
  );

  function handleClick(char: (typeof chars)[0]) {
    if (!target) return;
    ReactEditor.blur(editor);
    Transforms.select(editor, target);
    insertHashtag(editor, char);
    setTarget(null);
    props.handleHashtagSelected?.(char);
  }

  return (
    <Slate
      editor={editor}
      initialValue={props.initialValue || EDITOR_INITIAL_STATE}
      onChange={editorOnChange}
    >
      <Editable
        spellCheck
        autoFocus
        onKeyDown={onKeyDown}
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        placeholder={props.placeholder || "Provide description for your ad, you can add hastags also e.g. #clothes"}
      />
      {(target || props.isHasTagSearching) && (
        <Portal>
          <div
            ref={ref}
            style={{
              top: "-9999px",
              left: "-9999px",
              position: "absolute",
              ...props.searchContainerStyle,
            }}
            className={props.searchContainerClassName || ""}
            data-cy="hashtags-portal"
          >
            {props.isHasTagSearching ? (
              <h1>Loading</h1>
            ) : target ? (
              chars.map((char) => (
                <div
                  key={char.key}
                  onClick={(evt) => {
                    evt.preventDefault();
                    handleClick(char);
                  }}
                  className={props.searchMenuItemClassName || ""}
                  style={props.searchMenuItemStyle}
                >
                  {char.label}
                </div>
              ))
            ) : null}
          </div>
        </Portal>
      )}
    </Slate>
  );
};
