import { create } from "zustand";
import { persist } from "zustand/middleware";
import ApiController from "../src/data/ApiController";
import SessionManager from "../src/data/SessionManager";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

const formatMeme = (img) => ({
  id: img._id,
  title: img.title,
  author: img.author,
  caption: img.description,
  createdAt: img.createdAt,
  url: `${API_BASE_URL}/${img.imageURL}`,
  likes: Array.isArray(img.likes) ? img.likes.length : 0,
  isLikedByUser: img.likes.includes(SessionManager.getUserName()),
  comments: img.comments || [],
});

const initialState = {
  images: [],
  image: {
    id: "Error",
    title: "Error - Image not found",
    caption: "Error",
    author: "Error",
    createdAt: "Error",
    url: "Error",
    comments: [],
    likes: 0,
    isLikedByUser: false,
  },
  pageIndex: 0,
  memeIndex: 0,
  loading: true,
  error: null,
  lastParams: { filters: null, sorting: null },
};

const useMemeStore = create(
  persist(
    (set, get) => ({
      ...initialState,

      resetStore: () => set(() => ({ ...initialState })),

      // Fetch all memes or a specific meme by ID
      fetchMemeById: async (id) => {
        set({ loading: true });
        try {
          const meme = await ApiController.fetchMemeById(id);
          set({ image: formatMeme(meme) });
        } catch (error) {
          set({ error: "Failed to load meme" });
        } finally {
          set({ loading: false });
        }
      },

      fetchMemes: async ({ filters, sorting, append = false }) => {
        set(() => ({ loading: true }));
        const currentState = get();

        // Reset pageIndex if filters or sorting have changed
        if (
          JSON.stringify(filters) !==
            JSON.stringify(currentState.lastParams.filters) ||
          JSON.stringify(sorting) !==
            JSON.stringify(currentState.lastParams.sorting) ||
          !append
        ) {
          currentState.resetStore();
          set({
            pageIndex: 0,
            memeIndex: 0,
            lastParams: { filters: filters, sorting: sorting },
          });
        }

        try {
          const { results } = await ApiController.fetchAllMemes({
            page: currentState.pageIndex,
            filter: filters,
            sortedBy: sorting,
          });
          set((state) => ({
            images: append
              ? [...state.images, ...results.map(formatMeme)]
              : results.map(formatMeme),
            pageIndex: state.pageIndex + 1,
            loading: false,
          }));
        } catch (error) {
          set({ error: "Failed to load memes", loading: false });
        }
      },

      // Handling likes
      handleUpvote: async (memeId) => {
        const username = SessionManager.getUserName();
        try {
          await ApiController.like(memeId, username);
          set((state) => ({
            images: state.images.map((img) =>
              img.id === memeId
                ? {
                    ...img,
                    likes: img.isLikedByUser ? img.likes - 1 : img.likes + 1,
                    isLikedByUser: !img.isLikedByUser,
                  }
                : img
            ),
            image:
              state.image.id === memeId
                ? {
                    ...state.image,
                    likes: state.image.isLikedByUser
                      ? state.image.likes - 1
                      : state.image.likes + 1,
                    isLikedByUser: !state.image.isLikedByUser,
                  }
                : state.image,
          }));
        } catch (error) {
          console.error("Error handling like:", error);
        }
      },

      // Adding comments
      addComment: async (commentText) => {
        const username = SessionManager.getUserName();
        const currentState = get();
        if (!commentText.trim()) return;

        try {
          await ApiController.addComment(
            currentState.image.id,
            commentText,
            username
          );
          const newComment = { author: username, comment: commentText };
          set((state) => ({
            images: state.images.map((img) =>
              img.id === currentState.image.id
                ? {
                    ...img,
                    comments: [...img.comments, newComment],
                  }
                : img
            ),
            image:
              state.image.id === currentState.image.id
                ? {
                    ...state.image,
                    comments: [...state.image.comments, newComment],
                  }
                : state.image,
          }));
        } catch (error) {
          console.error("Error adding comment:", error);
        }
      },

      // Navigation methods
      navigateNext: () => {
        console.log(get().images);
        const currentState = get();

        const newIndex = currentState.memeIndex + 1;
        if (newIndex >= currentState.images.length) {
          // Optionally fetch more data here if at the end of the array
          set(() => ({ memeIndex: 0 })); // or handle pagination
        }
        set(() => ({
          memeIndex: newIndex,
          image: currentState.images[newIndex],
        }));
      },

      navigatePrevious: () => {
        console.log(get().images);
        const currentState = get();
        const newIndex = currentState.memeIndex - 1;
        if (newIndex < 0) {
          // Optionally fetch more data here if at the beginning of the array
          set(() => ({ memeIndex: currentState.images.length - 1 })); // or handle pagination
        }
        set(() => ({
          memeIndex: newIndex,
          image: currentState.images[newIndex],
        }));
      },
    }),
    {
      name: "meme-storage",
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.log('An error occurred during rehydration:', error);
          return;
        }
        console.log(state)
        // Reset pageIndex upon rehydration
      }
    }
  )
);

export default useMemeStore;
