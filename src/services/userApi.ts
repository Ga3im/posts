import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { User } from "../types/types";

export const userApi = createApi({
  reducerPath: "usersApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://jsonplaceholder.typicode.com",
  }),
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      query: () => ({
        url: "/users",
      }),
    }),
    getUserById: builder.query({
      query: ({ id }) => ({
        url: `/users/${id}`,
      }),
    }),
  }),
});

export const { useGetUsersQuery, useGetUserByIdQuery } = userApi;
