import { useState } from "react";
import { handleToTopBtn, ScrollToTop } from "../components/ScrollToTop";
import {
  useDeleteMultiplePostsMutation,
  useGetPostsQuery,
} from "../services/postApi";
import { Dropdown } from "../components/Dropdown";
import { Skeleton } from "../components/Skeleton";
import { PaginationNav } from "../components/PaginationNav";
import { useGetUsersQuery } from "../services/userApi";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useAppDispatch, useAppSelector } from "../store";
import { FavoriteIcon } from "../components/icons/FavoriteIcon";
import { DeleteIcon } from "../components/icons/DeleteIcon";
import { PostCard } from "../components/PostCard";
import { CloseIcon } from "../components/icons/CloseIcon";
import { toggleBulkFavorites, removeSelectedPosts } from "../store/postSlice";
import { ModalClose } from "../components/CloseModal";

export const PostPage = () => {
  const { getfromLS, setToLS } = useLocalStorage();
  const savedPage = getfromLS("currentPage");
  const savedDropDownValue = getfromLS("dropDownValue");

  const { selectedPosts, favoritePosts } = useAppSelector(
    (state) => state.post
  );
  const dispatch = useAppDispatch();

  const dropdownList: (number | string)[] = [10, 20, 50, 100, "все"];
  const [currentPage, setCurrentPage] = useState(savedPage ? savedPage : 1);
  const [dropDownValue, setDropDownValue] = useState<number | string>(
    savedDropDownValue ? savedDropDownValue : 10
  );
  const [isDelete, setIsDelete] = useState<boolean>(false);
  const { data, isLoading } = useGetPostsQuery({
    page: currentPage,
    limit: dropDownValue,
  });
  const { data: users = [], isLoading: isLoadingUsers } = useGetUsersQuery();

  const totalItems = data?.totalCount || 100;
  const posts = data?.posts || [];

  const handleLimitChange = (value: number | string) => {
    setDropDownValue(value);
    setCurrentPage(1);
    setToLS("currentPage", 1);
    setToLS("dropDownValue", value);
  };

  const totalPages =
    dropDownValue === "все"
      ? 1
      : Math.ceil(totalItems / Number(dropDownValue)) || 1;

  let isFavorite: boolean =
    selectedPosts.length > 0 &&
    selectedPosts.every((post) =>
      favoritePosts.some((fav) => fav.id === post.id)
    );

  const [deleteMultiple] = useDeleteMultiplePostsMutation();
  const selectedIds = selectedPosts.map((p) => p.id);

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;

    try {
      await deleteMultiple({
        ids: selectedIds,
        page: currentPage,
        limit: dropDownValue,
      }).unwrap();
      dispatch(removeSelectedPosts());
      setIsDelete(false);
    } catch (err) {
      console.error("Ошибка при массовом удалении:", err);
    }
  };

  return (
    <>
      {isDelete && (
        <ModalClose
          text={`Вы хотите удалить выбранные посты?`}
          clickNo={() => setIsDelete(false)}
          clickYes={handleBulkDelete}
        />
      )}
      {selectedPosts.length > 0 && (
        <div className="fixed bottom-0 bg-black flex items-center justify-between w-full z-2 h-[40px] px-[20px]">
          <button onClick={() => dispatch(toggleBulkFavorites())}>
            <FavoriteIcon isFavorite={isFavorite} />
          </button>
          <button onClick={() => setIsDelete(true)}>
            <DeleteIcon />
          </button>

          <button onClick={() => dispatch(removeSelectedPosts())}>
            <CloseIcon />
          </button>
        </div>
      )}

      <div className="pt-[50px] pb-[20px] px-[20px]">
        <div className="flex justify-center items-center gap-[10px]">
          <h1>Посты</h1>
          <div className="flex text-[#808080] text-[32px]">
            (
            {
              <Dropdown
                list={dropdownList}
                dropDownValue={dropDownValue}
                setDropDownValue={handleLimitChange}
              />
            }
            )
          </div>
        </div>
        {isLoading && isLoadingUsers ? (
          <Skeleton />
        ) : (
          <div className="grid gap-[20px] pb-[10px] md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 sm:grid-cols-2 grid-cols-1">
            {posts.map((item) => (
              <PostCard
                key={item.id}
                post={item}
                users={users}
                currentPage={currentPage}
                dropDownValue={dropDownValue}
              />
            ))}
          </div>
        )}

        <PaginationNav
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={Number(totalPages)}
        />
      </div>
      <ScrollToTop onClick={handleToTopBtn} />
    </>
  );
};
