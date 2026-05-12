import { useNavigate } from "react-router-dom";
import { LogoIcon } from "./icons/LogoIcon";
import { ProfileIcon } from "./icons/ProfileIcon";
import { SettingIcon } from "./icons/SettingIcon";
import { routes } from "../pages/routes";
import { useAppSelector } from "../store";

export const Header = () => {
  const navigate = useNavigate();

  const { currentUser } = useAppSelector((state) => state.post);

  return (
    <div className="flex justify-between items-center fixed w-full h-[50px] px-[10px] py-[5px] z-10 bg-black/5">
      <button onClick={() => navigate(routes.post)}>
        <LogoIcon />
      </button>
      <div className="flex gap-[10px] items-center">
        <p>{currentUser?.username}</p>
        <button onClick={() => navigate(routes.users)}>
          <ProfileIcon />
        </button>
        <SettingIcon />
      </div>
    </div>
  );
};
