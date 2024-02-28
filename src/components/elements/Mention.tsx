import React from "react";

interface MentionElementProps {
  children?: React.ReactNode;
  className?: string;
  attributes?: { [key: string]: string }
  element: {
    value?: {
      label: string;
      key: string;
    }
  }
}


export const Mention = ({
  attributes,
  element,
  children,
  className = "",
}: MentionElementProps) => {
  return (
    <span
      {...attributes}
      contentEditable={false}
      data-cy={`mention-${element.value?.label.replace(" ", "-")}`}
      className={className}
    >
      {children}@{element.value?.label}
    </span>
  );
};
