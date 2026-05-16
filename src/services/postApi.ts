import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Post } from "../components/PostCard";
import type { Comment } from "../types/types";

type GetsPostType = {
  page: number;
  limit: number | string;
  search?: string;
  sortKey?: string; // ИСПРАВЛЕНО: Добавлен ключ сортировки
  sortOrder?: "asc" | "desc"; // ИСПРАВЛЕНО: Добавлено направление сортировки
};

export const postApi = createApi({
  reducerPath: "postsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://jsonplaceholder.typicode.com",
  }),
  tagTypes: ["Post"],
  endpoints: (builder) => ({
    getPosts: builder.query<
      { posts: Post[]; totalCount: number },
      GetsPostType
    >({
      query: ({ page, limit, search, sortKey, sortOrder }) => {
        const params: Record<string, any> = {
          _page: page,
          _limit: limit === "все" ? 100 : limit,
          _expand: "user", // Обязательно подтягиваем вложенный объект user от сервера
        };

        if (search && search.trim() !== "") {
          params.title_like = search.trim();
        }

        // === СЕРВЕРНАЯ СОРТИРОВКА ДЛЯ JSON SERVER ===
        if (sortKey && sortOrder) {
          params._sort = sortKey;
          params._order = sortOrder;
        }

        return {
          url: "/posts",
          params,
        };
      },
      providesTags: ["Post"],
      transformResponse: (posts: Post[], meta) => {
        const totalCount = Number(meta?.response?.headers.get("X-Total-Count"));
        return {
          posts,
          totalCount: totalCount || 100,
        };
      },
    }),

    addPost: builder.mutation<
      Post,
      {
        post: Omit<Post, "id">;
        page: number;
        limit: number | string;
        search?: string;
      }
    >({
      query: ({ post }) => ({
        url: "/posts",
        method: "POST",
        body: post,
      }),
      async onQueryStarted(
        { page, limit, search, post },
        { dispatch, queryFulfilled }
      ) {
        try {
          const { data: serverResponse } = await queryFulfilled;

          dispatch(
            postApi.util.updateQueryData(
              "getPosts",
              { page, limit, search: search || "" },
              (draft) => {
                const completeNewPost: Post = {
                  id: serverResponse.id || 101, // Защита на случай фейкового ID от JSONPlaceholder
                  title: post.title,
                  body: post.body,
                  userId: post.userId,
                  user: {
                    id: post.user?.id || post.userId,
                    name: post.user?.name || "Аноним",
                    username: post.user?.username || "anonymous",
                  },
                };

                draft.posts.unshift(completeNewPost);

                if (draft.totalCount) {
                  draft.totalCount += 1;
                }
              }
            )
          );
        } catch (error) {
          console.error("Ошибка при пессимистичном обновлении кэша:", error);
        }
      },
    }),

    getCommentPost: builder.query<Comment[], { postId: number }>({
      query: ({ postId }) => ({
        url: `/posts/${postId}/comments`,
      }),
    }),

    updatePost: builder.mutation<
      Post,
      { post: Post; page: number; limit: number | string; search?: string }
    >({
      query: ({ post }) => ({
        url: `/posts/${post.id}`,
        method: "PATCH",
        body: post,
      }),
      async onQueryStarted(
        { post, page, limit, search },
        { dispatch, queryFulfilled }
      ) {
        const patchResult = dispatch(
          postApi.util.updateQueryData(
            "getPosts",
            { page, limit, search: search || "" },
            (draft) => {
              const index = draft.posts.findIndex((p) => p.id === post.id);
              if (index !== -1) {
                draft.posts[index] = { ...draft.posts[index], ...post };
              }
            }
          )
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),

    deletePost: builder.mutation<
      void,
      { id: number; page: number; limit: number | string }
    >({
      query: ({ id }) => ({
        url: `/posts/${id}`,
        method: "DELETE",
      }),
      async onQueryStarted({ id, page, limit }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          postApi.util.updateQueryData("getPosts", { page, limit }, (draft) => {
            draft.posts = draft.posts.filter((p) => p.id !== id);
            if (draft.totalCount) draft.totalCount -= 1;
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),

    deleteMultiplePosts: builder.mutation<
      void,
      { ids: number[]; page: number; limit: number | string }
    >({
      queryFn: async () => ({ data: undefined }),

      async onQueryStarted({ ids, page, limit }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          postApi.util.updateQueryData("getPosts", { page, limit }, (draft) => {
            draft.posts = draft.posts.filter((post) => !ids.includes(post.id));
            draft.totalCount -= ids.length;
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const {
  useGetPostsQuery,
  useAddPostMutation,
  useGetCommentPostQuery,
  useUpdatePostMutation,
  useDeletePostMutation,
  useDeleteMultiplePostsMutation,
} = postApi;
