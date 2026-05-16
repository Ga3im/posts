import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../store";
import { setFavoritePosts, setSelectedPosts } from "../store/postSlice";
import { RoundCheckbox } from "./Checkbox";
import { ExpandableText } from "./ExpandableText";
import {
  useDeletePostMutation,
  useGetCommentPostQuery,
  useUpdatePostMutation,
} from "../services/postApi";
import { UserIcon } from "./icons/UserIcon";
import { CommentIcon } from "./icons/CommentIcon";
import { EditIcon } from "./icons/EditIcon";
import { FavoriteIcon } from "./icons/FavoriteIcon";
import { DeleteIcon } from "./icons/DeleteIcon";
import { SuccessIcon } from "./icons/SuccessIcon";
import { CloseIcon } from "./icons/CloseIcon";
import { ModalClose } from "./CloseModal";
import { LoaderIcon } from "./icons/LoaderIcon";

export type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
  user?: {
    id: number;
    name: string;
    username: string;
  };
};

type PostCardType = {
  post: Post;
  currentPage: number;
  dropDownValue: number | string;
};

export const PostCard = ({
  post,
  currentPage,
  dropDownValue,
}: PostCardType) => {
  const [openComment, setOpenComment] = useState<null | number>(null);
  const [isDelete, setIsDelete] = useState<boolean>(false);
  const [editPost, setEditPost] = useState<Post | null>(null);
  const [updatePost, { isLoading: isEditLoading }] = useUpdatePostMutation();

  const { selectedPosts, favoritePosts, currentUser } = useAppSelector(
    (state) => state.post
  );
  const dispatch = useAppDispatch();

  const { data: postComments } = useGetCommentPostQuery({
    postId: openComment,
  });

  const [deletePost] = useDeletePostMutation();

  const handleUpdate = async () => {
    if (!editPost) return;

    try {
      await updatePost({
        post: editPost, // Берем из локального стейта
        page: currentPage,
        limit: dropDownValue,
      }).unwrap();

      setEditPost(null);
    } catch (err) {
      console.error("Ошибка обновления:", err);
    }
  };

  if (!post) {
    return null;
  }

  const handleCommentClick = () => {
    if (openComment) {
      setOpenComment(null);
    } else {
      setOpenComment(post.id);
    }
  };

  const handleEditClick = () => {
    setEditPost(editPost ? null : post);
  };

  const handleDelete = () => {
    deletePost({
      id: post.id,
      page: currentPage, // Передаем текущую страницу
      limit: dropDownValue, // Передаем текущий лимит
    });
    setIsDelete(false);
  };

  let isFavorite = favoritePosts.some((item) => item.id === post.id);
  let isMyPost = currentUser?.id === post.userId;
  let editingPost = editPost?.id === post.id;

  return (
    <>
      {isDelete && (
        <ModalClose
          text={"Вы хотите удалить пост?"}
          clickNo={() => setIsDelete(false)}
          clickYes={handleDelete}
        />
      )}
      <div className="rounded-[10px] bg-[#484848] p-[10px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <UserIcon /> <p>{post.user.username}</p>
          </div>
          <RoundCheckbox
            checked={selectedPosts.some((item) => item.id === post.id)}
            onChange={() => dispatch(setSelectedPosts(post))}
          />
        </div>
        {editingPost ? (
          <textarea
            rows={3}
            value={editPost?.title || ""}
            onChange={(e) =>
              setEditPost(
                editPost ? { ...editPost, title: e.target.value } : null
              )
            }
            className="w-full text-[20px] px-[5px] py-[2px] text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        ) : (
          <h2 className="text-start pl-[10px]">{post.title}</h2>
        )}
        <div className="p-[10px] text-justify">
          {editingPost ? (
            <textarea
              rows={4}
              value={editPost?.body || ""}
              onChange={(e) =>
                setEditPost(
                  editPost ? { ...editPost, body: e.target.value } : null
                )
              }
              className="w-full px-[5px] py-[2px] text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          ) : (
            <ExpandableText>{post.body}</ExpandableText>
          )}
        </div>
        <div className="flex justify-between px-[20px] pt-[10px]">
          {editingPost ? (
            <>
              <button onClick={handleUpdate}>
                {isEditLoading ? <LoaderIcon /> : <SuccessIcon />}
              </button>
              <button onClick={() => setEditPost(null)}>
                <CloseIcon />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleCommentClick}
                className="flex items-center"
              >
                <CommentIcon isActive={openComment ? true : false} />
              </button>
              {isMyPost && (
                <button onClick={handleEditClick}>
                  <EditIcon />
                </button>
              )}

              <button onClick={() => dispatch(setFavoritePosts(post))}>
                <FavoriteIcon isFavorite={isFavorite} />
              </button>
              {isMyPost && (
                <button onClick={() => setIsDelete(!isDelete)}>
                  <DeleteIcon />
                </button>
              )}
            </>
          )}
        </div>

        {openComment && (
          <div className="pt-[10px] px-[20px]">
            {postComments.map((comment) => (
              <div
                key={comment.id}
                className="border-b-1 text-start pt-[8px] pb-[3px]"
              >
                <h3 className="text-white">{comment.name}</h3>
                <p className="text-[10px]">{comment.email}</p>
                <p className="text-justify">{comment.body}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};
