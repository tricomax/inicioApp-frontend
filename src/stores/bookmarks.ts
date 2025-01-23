import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';
import { useAuthStore } from './auth';
import type { BookmarkItem } from '../types/bookmarks';

interface BookmarksState {
  items: BookmarkItem[];
  loading: boolean;
  error: string | null;
}

export const useBookmarksStore = defineStore('bookmarks', {
  state: (): BookmarksState => ({
    items: [],
    loading: false,
    error: null
  }),

  actions: {
    async getAuthToken() {
      const authStore = useAuthStore();
      if (!authStore.user) {
        throw new Error("Usuario no autenticado");
      }
      return await authStore.user.getIdToken();
    },

    // Esta función solo obtiene los datos de la cache
    async fetchBookmarks() {
      this.loading = true;
      this.error = null;

      try {
        const token = await this.getAuthToken();
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/bookmarks`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        this.items = response.data.data.bookmarks;
      } catch (err: any) {
        console.error("Error al obtener los marcadores:", err);
        this.error = err.response?.data?.message || "Error desconocido al obtener los marcadores";
        throw err;
      } finally {
        this.loading = false;
      }
    }
  },

  getters: {
    sortedBookmarks: (state) => {
      return [
        ...state.items.filter(item => item.type === 'folder'),
        ...state.items.filter(item => item.type === 'bookmark')
      ];
    }
  }
});
