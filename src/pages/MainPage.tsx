import { Outlet, useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { useEffect, useState } from "react";
import { routes } from "./routes";
import { useScrollDirection } from "../hooks/useScroll";

export const Main = () => {
  const navigate = useNavigate();
  const [isHidden, setIsHidden] = useState(false);
  const { scrollDirection } = useScrollDirection();

  useEffect(() => {
    if ( scrollDirection?.up) {
      setIsHidden(false);
    }
    if ( (scrollDirection?.down && window.scrollY >= 200)) {
      setIsHidden(true);
    }
  }, [ scrollDirection]);

  useEffect(() => {
    navigate(routes.post);
  }, []);

  return (
    <>
      {!isHidden && <Header />}
      <div>
        <Outlet />
      </div>
    </>
  );
};
