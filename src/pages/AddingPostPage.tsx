import { useState } from "react";
import { useAppSelector } from "../store";
import type { Post } from "../components/PostCard";
import { useNavigate, useLocation } from "react-router-dom"; // Добавили useLocation
import { useAddPostMutation } from "../services/postApi";
import { CloseIcon } from "../components/icons/CloseIcon";
import { routes } from "./routes";

export const AddingPostPage = () => {
  const { currentUser } = useAppSelector((state) => state.post);
  const navigate = useNavigate();
  const location = useLocation(); // Перехватываем state из роутера
  const [addPost, { isLoading }] = useAddPostMutation();

  // Достаем переданные параметры или берем дефолтные значения на случай, если зашли по прямой ссылке
  const page = location.state?.currentPage || 1;
  const limit = location.state?.dropDownValue || 10;
  const search = location.state?.searchTerm || "";

  const [addingPost, setAddingPost] = useState<Omit<Post, "id">>({
    title: "",
    body: "",
    userId: currentUser?.id || 1,
    user: {
      id: currentUser?.id || 1,
      name: currentUser?.name || currentUser?.username || "Аноним",
      username: currentUser?.username || "anonymous",
    },
  });

  const handleAddClick = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if (!addingPost.title.trim() || !addingPost.body.trim()) {
      alert("Заполните все поля");
      return;
    }
    try {
      // ИСПРАВЛЕНО: Передаем объект аргументов в соответствии с новым типом в API
      await addPost({ 
        post: addingPost, 
        page, 
        limit,
        search: search || undefined
      }).unwrap();
      
      navigate(routes.post);
    } catch (err) {
      console.error("Не удалось создать пост:", err);
    }
  };

  return (
    <div className="fixed z-10 bg-black/50 w-full h-full flex justify-center items-center">
      <div className="w-full mx-[20px] max-w-md bg-[#16171d] rounded-[10px] p-[20px] text-[#fff] shadow-[0px_0px_10px_-5px]">
        <div className="flex justify-end">
          <button onClick={() => navigate(-1)}>
            <CloseIcon />
          </button>
        </div>
        <p className="text-[24px] pb-[10px] font-bold">Новый пост</p>
        <div className="text-start flex gap-[5px] pb-[15px]">
          <p className="text-gray-400">Автор:</p>
          <p className="font-semibold">{currentUser?.username}</p>
        </div>
        <p className="text-start pb-1 text-sm text-gray-400">Название поста:</p>

        <input
          value={addingPost.title}
          onChange={(e) =>
            setAddingPost((prev) => ({ ...prev, title: e.target.value }))
          }
          className="text-[#fff] bg-[#54545d] w-full text-[16px] px-[10px] py-[6px] border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="text"
          placeholder="Введите название"
        />
        <p className="text-start pt-[15px] pb-1 text-sm text-gray-400">Описание:</p>

        <textarea
          value={addingPost.body}
          onChange={(e) =>
            setAddingPost((prev) => ({ ...prev, body: e.target.value }))
          }
          rows={4}
          className="text-[#fff] bg-[#54545d] w-full mb-[20px] px-[10px] py-[6px] border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          placeholder="Введите описание"
        />
        <button
          onClick={handleAddClick}
          disabled={isLoading}
          className="w-full rounded-[10px] bg-[blue] hover:bg-blue-700 transition-colors px-[20px] py-[8px] text-[#fff] font-medium disabled:opacity-50"
        >
          {isLoading ? "Добавление..." : "Добавить"}
        </button>
      </div>
    </div>
  );
};
