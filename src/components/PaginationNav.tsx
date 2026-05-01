import type { Dispatch } from "react";
import { useSaveLS } from "../hooks/useSaveLS";

const ChevronLeft = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

const ChevronRight = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 18l6-6-6-6" />
  </svg>
);

type PaginationNavType = {
  currentPage: number;
  setCurrentPage: Dispatch<number>;
  totalPages: number;
};

export const PaginationNav = ({
  currentPage = 1,
  setCurrentPage,
  totalPages,
}: PaginationNavType) => {
  const { setToLS } = useSaveLS();

  const handleSetCurrenPage = (newValue: number) => {
    setCurrentPage(newValue);
    setToLS("currentPage", newValue);
  };

  return (
    <>
      <div className="flex items-center justify-center text-[#fff] py-[5px] gap-[10px]">
        <button
          className={
            currentPage === 1
              ? "bg-[#707070] rounded-[10px] opacity-50"
              : "bg-[#707070] rounded-[10px] cursor-pointer"
          }
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft />
        </button>
        {currentPage > 2 && (
          <>
            <p
              onClick={() => handleSetCurrenPage(1)}
              className="pl-[5px] cursor-pointer"
            >
              1
            </p>
            <span>...</span>
          </>
        )}
        {currentPage > 1 && (
          <div
            onClick={() => handleSetCurrenPage(currentPage - 1)}
            className="flex max-w-[35px] overflow-hidden gap-[10px] cursor-pointer"
          >
            {currentPage - 1}
          </div>
        )}

        <div className="flex bg-[red] px-[3px] rounded-[5px] max-w-[35px] overflow-hidden gap-[10px]">
          {currentPage}
        </div>
        {totalPages > currentPage && (
          <div
            onClick={() => handleSetCurrenPage(currentPage + 1)}
            className="flex max-w-[35px] overflow-hidden gap-[10px] cursor-pointer"
          >
            {currentPage + 1}
          </div>
        )}

        {totalPages > 2 && currentPage + 1 < totalPages && (
          <>
            <span>...</span>
            <p
              onClick={() => handleSetCurrenPage(totalPages)}
              className="pl-[5px] cursor-pointer"
            >
              {totalPages}
            </p>
          </>
        )}

        <button
          className={
            currentPage === totalPages
              ? "bg-[#707070] rounded-[10px] opacity-50"
              : "bg-[#707070] rounded-[10px] cursor-pointer"
          }
          onClick={() => handleSetCurrenPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight />
        </button>
      </div>
    </>
  );
};
