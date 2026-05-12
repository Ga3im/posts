import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store";
import { selectUser } from "../store/postSlice";
import type { User } from "../types/types";
import { routes } from "../pages/routes";

type UserCardType = {
  user: User;
};

export const UseCard = ({ user }: UserCardType) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { currentUser } = useAppSelector((state) => state.post);

  const handleUserClick = () => {
    dispatch(selectUser(user));
    navigate(routes.post);
  };
  return (
    <div
      onClick={handleUserClick}
      className={
        currentUser?.id === user.id
          ? "rounded-[10px] bg-[#484848] p-[10px] text-start border-1 border-[red]"
          : "rounded-[10px] bg-[#484848] p-[10px] text-start"
      }
    >
      <h2>{user.username}</h2>
      <div className="flex gap-[5px]">
        <p>Почта:</p>
        <p>{user.email}</p>
      </div>
      <div className="flex gap-[5px]">
        <p>Имя:</p>
        <p>{user.name}</p>
      </div>
    </div>
  );
};
