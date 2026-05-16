import { useMemo, useState } from "react";
import { handleToTopBtn, ScrollToTop } from "../components/ScrollToTop";
import {
  useDeleteMultiplePostsMutation,
  useGetPostsQuery,
} from "../services/postApi";
import { Dropdown } from "../components/Dropdown";
import { Skeleton } from "../components/Skeleton";
import { PaginationNav } from "../components/PaginationNav";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useAppDispatch, useAppSelector } from "../store";
import { FavoriteIcon } from "../components/icons/FavoriteIcon";
import { DeleteIcon } from "../components/icons/DeleteIcon";
import { PostCard } from "../components/PostCard";
import { CloseIcon } from "../components/icons/CloseIcon";
import { toggleBulkFavorites, removeSelectedPosts } from "../store/postSlice";
import { ModalClose } from "../components/CloseModal";
import { BottomButton } from "../components/BottomButton";
import { routes } from "./routes";
import { Outlet, useNavigate } from "react-router-dom";
import { FilterPosts, type SortDirectionType } from "../components/FilterPosts";

export const PostPage = () => {
  const { getfromLS, setToLS } = useLocalStorage();
  const savedPage = getfromLS("currentPage");
  const savedDropDownValue = getfromLS("dropDownValue");

  const [searchTerm, setSearchTerm] = useState<string>("");

  const { selectedPosts, favoritePosts } = useAppSelector(
    (state) => state.post
  );
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const dropdownList: (number | string)[] = [10, 20, 50, 100, "все"];
  const [currentPage, setCurrentPage] = useState(savedPage ? savedPage : 1);
  const [dropDownValue, setDropDownValue] = useState<number | string>(
    savedDropDownValue ? savedDropDownValue : 10
  );

  const [titleSort, setTitleSort] = useState<SortDirectionType>("По умолчанию");
  const [authorSort, setAuthorSort] =
    useState<SortDirectionType>("По умолчанию");
  const [isOnlyFavorites, setIsOnlyFavorites] = useState<boolean>(false);
  const [isDelete, setIsDelete] = useState<boolean>(false);

  const getServerSortParams = () => {
    if (titleSort !== "По умолчанию") {
      return {
        sortKey: "title",
        sortOrder: titleSort === "А → Я" ? ("asc" as const) : ("desc" as const),
      };
    }
    if (authorSort !== "По умолчанию") {
      return {
        sortKey: "userId",
        sortOrder:
          authorSort === "А → Я" ? ("asc" as const) : ("desc" as const),
      };
    }
    return { sortKey: undefined, sortOrder: undefined };
  };

  const { sortKey, sortOrder } = getServerSortParams();

  const { data, isLoading, isFetching } = useGetPostsQuery({
    page: currentPage,
    limit: dropDownValue,
    search: searchTerm,
    sortKey,
    sortOrder,
  });

  const totalItems = data?.totalCount || 100;
  const posts = data?.posts || [];

  const processedPosts = useMemo(() => {
    const result = [...posts];

    if (isOnlyFavorites) {
      const favIds = new Set(favoritePosts.map((p) => p.id));
      result.sort((a, b) => {
        const aFav = favIds.has(a.id) ? 1 : 0;
        const bFav = favIds.has(b.id) ? 1 : 0;
        return bFav - aFav;
      });
    }

    return result;
  }, [posts, isOnlyFavorites, favoritePosts]);

  const handleLimitChange = (value: number | string) => {
    setDropDownValue(value);
    setCurrentPage(1);
    setToLS("currentPage", 1);
    setToLS("dropDownValue", value);
  };

  const handleTitleSortChange = (value: SortDirectionType) => {
    setTitleSort(value);
    setAuthorSort("По умолчанию");
    setCurrentPage(1);
  };

  const handleAuthorSortChange = (value: SortDirectionType) => {
    setAuthorSort(value);
    setTitleSort("По умолчанию");
    setCurrentPage(1);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
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

  const handleAddPost = () => {
    navigate(routes.addingPost, {
      state: {
        currentPage,
        dropDownValue,
        searchTerm,
      },
    });
  };

  return (
    <>
      <Outlet />
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
            <Dropdown
              list={dropdownList}
              dropDownValue={dropDownValue}
              setDropDownValue={handleLimitChange}
            />
            )
          </div>
        </div>

        <FilterPosts
          handleSearchChange={handleSearch}
          isLoading={isLoading || isFetching}
          isOnlyFavorites={isOnlyFavorites}
          setIsOnlyFavorites={setIsOnlyFavorites}
          titleSort={titleSort}
          handleTitleSortChange={handleTitleSortChange}
          authorSort={authorSort}
          handleAuthorSortChange={handleAuthorSortChange}
        />

        {isLoading ? (
          <Skeleton />
        ) : (
          <div
            className={`grid gap-[20px] py-[10px] md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 sm:grid-cols-2 grid-cols-1 transition-opacity duration-200 ${
              isFetching ? "opacity-50 pointer-events-none" : "opacity-100"
            }`}
          >
            {processedPosts.map((item) => (
              <PostCard
                key={item.id}
                post={item}
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
      <BottomButton onClick={handleAddPost} background={"blue"}>
        <div className="relative">
          <div className="absolute w-[4px] h-[16px] bg-white top-[50%] left-[50%] transform translate-x-[-50%] translate-y-[-50%]"></div>
          <div className="absolute w-[16px] h-[4px] bg-white top-[50%] left-[50%] transform translate-x-[-50%] translate-y-[-50%]"></div>
        </div>
      </BottomButton>
    </>
  );
};
