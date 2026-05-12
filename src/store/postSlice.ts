import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Post } from "../components/PostCard";
import type { User } from "../types/types";
import { useLocalStorage } from "../hooks/useLocalStorage";

export type sliceType = {
  selectedPosts: Post[];
  favoritePosts: Post[];
  currentUser: User;
};

const { getfromLS, setToLS, removeItemLS } = useLocalStorage();

const savedFavoritePosts = getfromLS("favoritePosts");
const savedSelectedPosts = getfromLS("selectedPosts");
const savedCurrentUser = getfromLS("currentUser");

const initialState: sliceType = {
  selectedPosts: savedSelectedPosts ? savedSelectedPosts : [],
  favoritePosts: savedFavoritePosts ? savedFavoritePosts : [],
  currentUser: savedCurrentUser ? savedCurrentUser : null,
};

export const postSlice = createSlice({
  name: "slices",
  initialState,
  reducers: {
    setSelectedPosts: (state, action: PayloadAction<Post>) => {
      if (state.selectedPosts.some((post) => post.id === action.payload.id)) {
        state.selectedPosts = state.selectedPosts.filter(
          (selectedPost) => selectedPost.id !== action.payload.id
        );
      } else {
        state.selectedPosts.push(action.payload);
      }
      setToLS("selectedPosts", state.selectedPosts);
    },
    removeSelectedPosts: (state) => {
      state.selectedPosts = [];
      removeItemLS("selectedPosts");
    },
    setFavoritePosts: (state, action: PayloadAction<Post>) => {
      if (state.favoritePosts.some((post) => post.id === action.payload.id)) {
        state.favoritePosts = state.favoritePosts.filter(
          (selectedPost) => selectedPost.id !== action.payload.id
        );
      } else {
        state.favoritePosts.push(action.payload);
      }
      setToLS("favoritePosts", state.favoritePosts);
    },
    selectUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
      setToLS("currentUser", state.currentUser);
    },
    
    toggleBulkFavorites: (state) => {
      const selectedIds = state.selectedPosts.map((p) => p.id);
      const allSelectedAreFavorites = state.selectedPosts.every((post) =>
        state.favoritePosts.some((fav) => fav.id === post.id)
      );

      if (allSelectedAreFavorites) {
        state.favoritePosts = state.favoritePosts.filter(
          (fav) => !selectedIds.includes(fav.id)
        );
      } else {
        state.selectedPosts.forEach((post) => {
          if (!state.favoritePosts.some((fav) => fav.id === post.id)) {
            state.favoritePosts.push(post);
          }
        });
      }
    },
  },
});

export const {
  setSelectedPosts,
  removeSelectedPosts,
  setFavoritePosts,
  selectUser,
  toggleBulkFavorites,
} = postSlice.actions;
export const postReduser = postSlice.reducer;
