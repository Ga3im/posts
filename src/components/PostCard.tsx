import type { User } from "../types/types";
import { ExpandableText } from "./ExpandableText";

export type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

type PostCardType = {
  item: Post;
  users: User[];
};

export const PostCard = ({ item, users }: PostCardType) => {
  const UserIcon = () => (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://w3.org"
    >
      <circle cx="20" cy="20" r="15" fill="#1e293b" />

      <g transform="translate(10, 10)">
        <path
          d="M16 17v-1.5a3 3 0 0 0-3-3H7a3 3 0 0 0-3 3V17"
          stroke="white"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <circle cx="10" cy="7" r="3.5" stroke="white" stroke-width="1.5" />
      </g>
    </svg>
  );

  if (!item) {
    return null;
  }

  console.log(users);

  let userName = users.find((user) => user.id === item.userId);

  console.log(userName);

  return (
    <div className="rounded-[10px] bg-[#484848] p-[10px]">
      <div className="flex items-center">
        <UserIcon /> <p>{userName?.username}</p>
      </div>
      <h2 className="text-start pl-[10px]">{item.title}</h2>
      <div className="p-[10px] text-justify">
        <ExpandableText>{item.body}</ExpandableText>
      </div>
    </div>
  );
};
