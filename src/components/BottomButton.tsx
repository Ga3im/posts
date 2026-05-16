import type { ReactNode } from "react";

type BottomButtonType = {
  onClick: () => void;
  children: ReactNode;
  background: string;
};

export const BottomButton = ({
  onClick,
  children,
  background,
}: BottomButtonType) => {
  return (
    <button
      onClick={onClick}
      className={`bg-[${background}] fixed cursor-pointer bottom-[20px] right-[10px] rounded-full w-[40px] h-[40px] shadow-[0px_0px_10px_-3px]`}
    >
      {children}
    </button>
  );
};
