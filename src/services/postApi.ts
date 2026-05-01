import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Post } from "../components/PostCard";

export const postApi = createApi({
  reducerPath: "postsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://jsonplaceholder.typicode.com",
  }),
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
  }),
});

export const { useGetPostsQuery } = postApi;
