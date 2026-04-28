import { Dropdown } from "./Dropdown";

type PaginationType = {
  title: string;
  itemCount: number;
  RenderItem: React.ComponentType;
};

export const Pagination = ({
  title,
  itemCount,
  RenderItem,
}: PaginationType) => {
  return (
    <div className="pt-[50px] px-[20px]">
      <h1>
        {title} <span className="opacity-50">({itemCount})</span>
      </h1>
      <RenderItem />
      <Dropdown/>
    </div>
  );
};
