import { useState, type MouseEvent, type ReactNode } from "react";

type ExpandableTextType = {
  children: ReactNode;
};

export const ExpandableText = ({ children }: ExpandableTextType) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenCommetBody = (e: MouseEvent<HTMLParagraphElement>) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };
  return (
    <p
      onClick={handleOpenCommetBody}
      className={
        isOpen
          ? "line-clamp-none cursor-pointer block"
          : "line-clamp-2 cursor-pointer"
      }
    >
      {children}
    </p>
  );
};
