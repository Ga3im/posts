import { ExpandableText } from "./ExpandableText";

export type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

type PostCardType = {
  post: Post;
  isLoading: boolean;
};

const post = {
  body: "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto",
  id: 1,
  title:
    "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
  userId: 1,
};
// { post, isLoading }: PostCardType

export const PostCard = () => {
  //   if (isLoading) {
  //     return <div>Загрузка</div>;
  //   }

  return (
    <div className="rounded-[10px] bg-[#484848] p-[10px]">
      <h2>{post.title}</h2>
      <ExpandableText>{post.body}</ExpandableText>
    </div>
  );
};
