import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Post } from "../components/PostCard";
import type { Comment } from "../types/types";

export const postApi = createApi({
  reducerPath: "postsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://jsonplaceholder.typicode.com",
  }),
  tagTypes: ["Post"],
  endpoints: (builder) => ({
    getPosts: builder.query<
      { posts: Post[]; totalCount: number },
      { page: number; limit: number | string }
    >({
      query: ({ page, limit }) => ({
        url: "/posts",
        params: {
          _page: page,
          _limit: limit === "все" ? 100 : limit,
        },
      }),
      transformResponse: (posts: Post[], meta) => {
        const totalCount = Number(meta?.response?.headers.get("X-Total-Count"));
        return {
          posts,
          totalCount: totalCount || 100,
        };
      },
    }),

    getCommentPost: builder.query<Comment[], { postId: number }>({
      query: ({ postId }) => ({
        url: `/posts/${postId}/comments`,
      }),
    }),

    updatePost: builder.mutation<
      Post,
      { post: Post; page: number; limit: number | string }
    >({
      query: ({ post }) => ({
        url: `/posts/${post.id}`,
        method: "PATCH", // или "PUT", если JSONPlaceholder требует полной замены
        body: post,
      }),
      async onQueryStarted(
        { post, page, limit },
        { dispatch, queryFulfilled }
      ) {
        const patchResult = dispatch(
          postApi.util.updateQueryData("getPosts", { page, limit }, (draft) => {
            const index = draft.posts.findIndex((p) => p.id === post.id);
            if (index !== -1) {
              draft.posts[index] = { ...draft.posts[index], ...post };
            }
          })
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
  useGetCommentPostQuery,
  useUpdatePostMutation,
  useDeletePostMutation,
  useDeleteMultiplePostsMutation,
} = postApi;
