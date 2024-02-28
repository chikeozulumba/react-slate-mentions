import { Range, Editor as SlateEditor, Transforms } from "slate";
import { Editable, ReactEditor, Slate } from "slate-react";
import type { Descendant } from "slate";
import { useEditor } from "../hooks/useEditor";
import { EDITOR_INITIAL_STATE, editorPrefixes } from "../constants/editor";
import React, {
  CSSProperties,
  KeyboardEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Portal } from "./Portal";
import { useClickOutside } from "../hooks/useClickOutside";
import { BaseEditorElement } from "./elements";

import "./index.css";

type InputValue<T> = T & { prefix: keyof typeof editorPrefixes };
type InputPrefixType = "@" | "#";

type EditorProps = {
  initialValue?: Descendant[] | null;
  handleOnChange?: (data: Descendant[]) => void;
  uniqueHashTags?: boolean;
  uniqueHashMentions?: boolean;
  menuItems?: { key: string; label: string }[];
  collectedItems?: { key: string; label: string; prefix: string }[];
  handleSearch?: (search: string, prefix: string) => void;
  hashTagEnabled?: boolean;
  isProcessing?: boolean;
  searchContainerClassName?: string;
  searchContainerStyle?: CSSProperties;
  searchMenuItemClassName?: string;
  emptySearchMenuItemClassName?: string;
  searchMenuItemStyle?: CSSProperties;
  handleHashtagSelected?: (data: {
    key: string;
    label: string;
    prefix: string;
  }) => boolean | void | null;
  elementClassName?: string;
  placeholder?: string;
  editorClassname?: string;
  editorId?: string;
  hashTagPrefix?: string;
  mentionPrefix?: string;
  loadingComponent?: React.ReactNode;
  defaultLoadingText?: string;
  isReadOnly?: boolean
};

export const Editor = ({
  hashTagPrefix = "#",
  mentionPrefix = "@",
  isReadOnly = false,
  ...props
}: EditorProps) => {
  const { editor } = useEditor();

  const ref = useRef<HTMLDivElement>(null);
  const [target, setTarget] = useState<Range | null>();
  const [afterTarget, setAfterTarget] = useState<Range | null>();
  const [index, setIndex] = useState(0);
  const [search, setSearch] = useState<"#" | "@">("#");

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

  const renderElement = (elProps: any) => (
    <BaseEditorElement className={props.elementClassName} {...elProps} />
  );
  const renderLeaf = useCallback((props: any) => <Leaf {...props} />, []);

  const searchItemValues = useMemo(() => {
    const items = props.menuItems || [];

    return items.length === 0 && !props.isProcessing
      ? [
        {
          key: "is-new",
          label: search,
        },
      ]
      : items;
  }, [props.menuItems, props.isProcessing, search]);

  useEffect(() => {
    if (target && searchItemValues.length > 0) {
      const el = ref.current;
      const domRange = ReactEditor.toDOMRange(editor, target);
      const rect = domRange.getBoundingClientRect();
      if (el) {
        el.style.top = `${rect.top + window.pageYOffset + 24}px`;
        el.style.left = `${rect.left + window.pageXOffset}px`;
      }
    }
  }, [searchItemValues.length, editor, index, search, target]);

  function editorOnChange(data: Descendant[]) {
    if (isReadOnly) return;


    const { selection } = editor;

    if (selection && Range.isCollapsed(selection) && props.hashTagEnabled) {
      const [start] = Range.edges(selection);
      const wordBefore = SlateEditor.before(editor, start, { unit: "word" });
      const before = wordBefore && SlateEditor.before(editor, wordBefore);
      const beforeRange = before && SlateEditor.range(editor, before, start);
      const beforeText = beforeRange && SlateEditor.string(editor, beforeRange);
      const beforeMatch = beforeText && beforeText.match(/^(#|@)(\w+)$/);
      const after = SlateEditor.after(editor, start);
      const afterRange = SlateEditor.range(editor, start, after);
      const afterText = SlateEditor.string(editor, afterRange);
      const afterMatch = afterText.match(/^(\s|$)/);

      // console.log(beforeRange, afterRange)

      if (beforeMatch) {
        setSearch((beforeMatch?.[1] as InputPrefixType) ?? undefined);
      }

      if (beforeMatch && afterMatch) {
        setTarget(beforeRange);
        setAfterTarget(afterTarget);
        setIndex(0);
        props.handleSearch?.(beforeMatch[2], beforeMatch[1]);
        return;
      }
    }

    props.handleOnChange?.(data);
    setTarget(null);
  }

  const insertSelectedEntry = useCallback(
    (editor: any, value: InputValue<(typeof searchItemValues)[0]>) => {
      if (!value) return;

      const { prefix } = value;

      if (props.uniqueHashTags && search === hashTagPrefix) {
        const exists =
          (props.collectedItems || []).filter(
            ({ label }) =>
              value.label?.toLowerCase() === label.toLowerCase() &&
              value.prefix === prefix
          ).length > 0;

        if (exists) return;
      }

      const payload = {
        type: editorPrefixes[prefix],
        value,
        children: [{ text: "" }],
      };

      Transforms.insertNodes(editor, payload, { select: true });

      if (afterTarget) {
        ReactEditor.focus(editor);

        //TODO const [firstPos = 0, lastPos = 0]: number[] = (target.focus?.path) || []
        editor.moveToEnd({ ...afterTarget.focus, offset: 0 });
      }

      setIndex(0);
    },
    [props.menuItems, props.collectedItems, props.uniqueHashTags, target]
  );

  /**
   *
   *
   * @param {KeyboardEvent} event
   */
  const onKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (target && searchItemValues.length > 0) {
        switch (event.key) {
          case "ArrowDown":
            event.preventDefault();
            const prevIndex = index >= searchItemValues.length - 1 ? 0 : index + 1;
            setIndex(prevIndex);
            break;
          case "ArrowUp":
            event.preventDefault();
            const nextIndex = index <= 0 ? searchItemValues.length - 1 : index - 1;
            setIndex(nextIndex);
            break;
          case "Tab":
          case "Enter":
            event.preventDefault();
            Transforms.select(editor, target);
            insertSelectedEntry(editor, { prefix: search, ...searchItemValues[index] });
            setTarget(null);
            break;
          case "Escape":
            event.preventDefault();
            setTarget(null);
            break;
        }
      }
    },
    [searchItemValues, editor, index, insertSelectedEntry, target]
  );

  function handleClick(value: InputValue<(typeof searchItemValues)[0]>) {
    if (!target || typeof value.prefix !== "string") return;

    const sendValueAction = props.handleHashtagSelected?.(value);

    if (sendValueAction !== null && sendValueAction !== false) {
      ReactEditor.blur(editor);
      Transforms.select(editor, target);
      insertSelectedEntry(editor, value);

      setTarget(null);
      return;
    }

    ReactEditor.focus(editor);
    setTarget(null);
  }

  return (
    <Slate
      editor={editor}
      initialValue={props.initialValue || EDITOR_INITIAL_STATE}
      onChange={editorOnChange}
    >
      <Editable
        id={props.editorId || undefined}
        className={props.editorClassname || "SlateMention__editorClassname"}
        spellCheck
        autoFocus
        onKeyDown={onKeyDown}
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        placeholder={
          props.placeholder || "Enter hashtag with '#' or mention with '@'"
        }
        readOnly={isReadOnly}
      />
      {target && (
        <Portal>
          <div
            ref={ref}
            style={{
              top: "-9999px",
              left: "-9999px",
              position: "absolute",
              ...props.searchContainerStyle,
            }}
            className={
              props.searchContainerClassName ||
              "SlateMention__searchContainerClassName"
            }
            data-cy="SlateMention__hashtags-portal"
          >
            {props.isProcessing ? (
              props.loadingComponent || (
                <div className="SlateMention__searchContainerLoadingClassName">
                  {props.defaultLoadingText || "Loading"}
                </div>
              )
            ) : target && searchItemValues.length > 0 ? (
              searchItemValues.map((item) => (
                <div
                  key={item.key}
                  onClick={(evt) => {
                    evt.preventDefault();
                    handleClick({ ...item, prefix: search });
                  }}
                  className={
                    props.searchMenuItemClassName ||
                    "SlateMention__searchMenuItemClassName"
                  }
                  style={props.searchMenuItemStyle}
                >
                  {item.label}
                </div>
              ))
            ) : (
              <p
                className={
                  props.emptySearchMenuItemClassName ||
                  "SlateMention__emptySearchMenuItemClassName"
                }
              >
                No options available
              </p>
            )}
          </div>
        </Portal>
      )}
    </Slate>
  );
};
