import { useState, type Dispatch, type SetStateAction } from "react";

type DropdownType<T> = {
  list: T[];
  dropDownValue: T;
  setDropDownValue: Dispatch<SetStateAction<T>> | ((value: T) => void);
};

export const Dropdown = <T extends string | number>({
  list = [],
  dropDownValue,
  setDropDownValue,
}: DropdownType<T>) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className="cursor-pointer relative" onClick={() => setIsOpen(!isOpen)}>
      {dropDownValue}
      <div className="opacity-100 absolute z-10 bg-black shadow-[0px_0px_15px_-5px] rounded-[10px] top-[32px] right-[-15px]">
        {isOpen &&
          list.map((set: T, index) => (
            <div
              key={index}
              onClick={() => setDropDownValue(set)}
              className="cursor-pointer hover:bg-[#343434] hover:text-[#fff] py-[5px] px-[5px]"
            >
              {set}
            </div>
          ))}
      </div>
    </div>
  );
};
