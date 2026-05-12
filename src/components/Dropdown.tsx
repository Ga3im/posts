import {  useState, type Dispatch } from "react";

type DropdownType = {
  list: (number | string)[];
  dropDownValue: number | string;
  setDropDownValue: Dispatch<number | string>;
};

export const Dropdown = ({
  list = [],
  dropDownValue,
  setDropDownValue,
}: DropdownType) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className="cursor-pointer relative" onClick={() => setIsOpen(!isOpen)}>
      {dropDownValue}
      <div className="opacity-100 absolute z-10 bg-black shadow-[0px_0px_15px_-5px] rounded-[10px] top-[32px] right-[-15px]">
        {isOpen &&
          list.map((set: number) => (
            <div
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
