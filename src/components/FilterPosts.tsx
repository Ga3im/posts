import { useState } from "react";
import { FilterIcon } from "./icons/FilterIcon";
import { LoaderIcon } from "./icons/LoaderIcon";
import { Dropdown } from "../components/Dropdown";

export type SortDirectionType = "По умолчанию" | "А → Я" | "Я → А";

type FilterPostsType = {
  handleSearchChange: (text: string) => void;
  isLoading: boolean;
  isOnlyFavorites: boolean;
  setIsOnlyFavorites: (value: boolean) => void;
  titleSort: SortDirectionType;
  handleTitleSortChange: (val: SortDirectionType) => void;
  authorSort: SortDirectionType;
  handleAuthorSortChange: (val: SortDirectionType) => void;
};

export const FilterPosts = ({
  isLoading,
  isOnlyFavorites,
  setIsOnlyFavorites,
  titleSort,
  handleTitleSortChange,
  authorSort,
  handleAuthorSortChange,
}: FilterPostsType) => {
  const [isOpenFilter, setIsOpenFilter] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>("");

  const sortOptions: SortDirectionType[] = ["По умолчанию", "А → Я", "Я → А"];

  return (
    <>
      <div className="flex items-center justify-center gap-[10px]">
        <div className="flex justify-center">
          <div className="flex items-center border-2 border-[#9c9c9c] rounded-[10px] px-[5px] py-[1px] group focus-within:border-[blue]">
            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="focus:outline-none bg-transparent text-white"
              type="text"
              placeholder="Искать"
            />
            <button
              disabled={isLoading}
              className="opacity-50 group-focus-within:opacity-100 p-1 pointer-events-none"
            >
              {isLoading ? <LoaderIcon /> : "🔍"}
            </button>
          </div>
        </div>
        <button onClick={() => setIsOpenFilter(!isOpenFilter)}>
          <FilterIcon isActive={isOpenFilter} />
        </button>
      </div>

      {isOpenFilter && (
        <div className="mt-3 p-4 bg-[#16171d] border border-gray-700 rounded-lg max-w-md mx-auto flex flex-col gap-4 shadow-md text-white">
          <label className="flex items-center gap-2 cursor-pointer text-sm select-none w-full border-b border-gray-800 pb-2">
            <input
              type="checkbox"
              checked={isOnlyFavorites}
              onChange={(e) => setIsOnlyFavorites(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500 focus:ring-2 accent-blue-500"
            />
            <span>Сначала избранные ★ (Клиентский фильтр)</span>
          </label>

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-4 text-sm bg-[#22232b] p-2 rounded-lg">
              <span className="text-gray-300 font-medium">
                По названию поста:
              </span>
              <Dropdown
                list={sortOptions}
                dropDownValue={titleSort}
                setDropDownValue={handleTitleSortChange}
              />
            </div>

            <div className="flex items-center justify-between gap-4 text-sm bg-[#22232b] p-2 rounded-lg">
              <span className="text-gray-300 font-medium">
                По имени автора:
              </span>
              <Dropdown
                list={sortOptions}
                dropDownValue={authorSort}
                setDropDownValue={handleAuthorSortChange}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
