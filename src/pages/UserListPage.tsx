import { Skeleton } from "../components/Skeleton";
import { UseCard } from "../components/UserCard";
import { useGetUsersQuery } from "../services/userApi";
import { useAppDispatch, useAppSelector } from "../store";
import { selectUser } from "../store/postSlice";

export const UserListPage = () => {
  const { data: users = [], isLoading } = useGetUsersQuery();
  const { currentUser } = useAppSelector((state) => state.post);

  const dispatch = useAppDispatch();

  return (
    <>
      <div className="pt-[50px] pb-[20px] px-[20px]">
        <div className="flex justify-center items-center gap-[10px]">
          <h1>Пользователи</h1>
        </div>
        {currentUser && (
          <p onClick={() => dispatch(selectUser(null))} className="pb-[10px]">
            Выйти из профиля
          </p>
        )}

        {isLoading ? (
          <Skeleton />
        ) : (
          <div className="grid gap-[20px] pb-[10px] md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 sm:grid-cols-2 grid-cols-1">
            {users.map((item) => (
              <UseCard key={item.id} user={item} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};
