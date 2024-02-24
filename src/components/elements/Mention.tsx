export const Mention = ({ attributes, element, children, className = '' }: any) => {
  return (
    <span
      {...attributes}
      contentEditable={false}
      data-cy={`mention-${element.value.label.replace(" ", "-")}`}
      className={className}
    >
      {children}
      @{element.value.label}
    </span>
  );
};
