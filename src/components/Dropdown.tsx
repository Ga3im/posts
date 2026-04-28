import { useState } from "react";

export const Dropdown = ({ list = [10, 20, 50, 100, "все"] }) => {
  const [value, setValue] = useState<number | string>("");

  const handleClick = (
    event: React.ChangeEvent<HTMLSelectElement, HTMLSelectElement>
  ) => {
    setValue(event.target.value);
  };
  console.log(value);
  return (
    <div className="appearance-none outline-none" onClick={handleClick}>
      {list.map((set: number) => (
        <div className="bg-none">{set}</div>
      ))}
    </div>
  );
};
