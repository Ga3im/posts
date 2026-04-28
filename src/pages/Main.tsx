import { Header } from "../components/Header";
import { Pagination } from "../components/Pagination";
import { PostCard } from "../components/PostCard";

export const Main = () => {
  const itemsCount = [10, 20, 50, 100, "все"];
  return (
    <>
      <Header />
      <Pagination title={"Посты"} itemCount={10} RenderItem={PostCard} />
    </>
  );
};
