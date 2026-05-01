import { useEffect, useRef, useState } from "react";
import { PostCard } from "../components/PostCard";
import { handleToTopBtn, ScrollToTop } from "../components/ScrollToTop";
import { useGetPostsQuery } from "../services/postApi";
import { Dropdown } from "../components/Dropdown";
import { Skeleton } from "../components/Skeleton";
import { PaginationNav } from "../components/PaginationNav";
import { useGetUsersQuery } from "../services/userApi";
import { useSaveLS } from "../hooks/useSaveLS";

export const PostPage = () => {
  const { getfromLS, setToLS } = useSaveLS();
  const savedPage = getfromLS("currentPage");

  const dropdownList: (number | string)[] = [10, 20, 50, 100, "все"];
  const [currentPage, setCurrentPage] = useState(savedPage ? savedPage : 1);
  const [dropDownValue, setDropDownValue] = useState<number | string>("");

  const { data, isLoading } = useGetPostsQuery({
    page: currentPage,
    limit: dropDownValue,
  });
  const { data: users = [], isLoading: isLoadingUsers } = useGetUsersQuery();

  const totalItems = data?.totalCount || 100;
  const posts = data?.posts || [];
  const totalPagesRef = useRef<string | number>(1);

  useEffect(() => {
    totalPagesRef.current =
      dropDownValue === "все"
        ? 100
        : Math.ceil(totalItems) / Number(dropDownValue);
    setCurrentPage(1);
    setToLS("currentPage", 1);
  }, [dropDownValue]);

  return (
    <>
      <div className="pt-[50px] pb-[20px] px-[20px]">
        <div className="flex justify-center items-center gap-[10px]">
          <h1>Посты</h1>
          <div className="flex text-[#808080] text-[32px]">
            (
            {
              <Dropdown
                list={dropdownList}
                dropDownValue={dropDownValue}
                setDropDownValue={setDropDownValue}
              />
            }
            )
          </div>
        </div>
        {isLoading && isLoadingUsers ? (
          <Skeleton />
        ) : (
          <div className="grid gap-[20px] pb-[10px] md:grid-cols-3 sm:grid-cols-2 grid-cols-1">
            {posts.map((item) => (
              <PostCard key={item.id} item={item} users={users} />
            ))}
          </div>
        )}

        <PaginationNav
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={Number(totalPagesRef.current)}
        />
      </div>

      <ScrollToTop onClick={handleToTopBtn} />
    </>
  );
};
