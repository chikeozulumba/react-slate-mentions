
export const Hashtag = ({ attributes, element, children, className = '' }: any) => {

  return (
    <span
      {...attributes}
      contentEditable={false}
      data-cy={`hashtag-${element.value.label.replace(" ", "-")}`}
      className={className}
    >
      {children}#{element.value.label}
    </span>
  );
};
