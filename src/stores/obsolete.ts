import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';
import { useAuthStore } from './auth';
import type { BookmarkItem } from '../types/bookmarks';

interface ObsoleteState {
  items: BookmarkItem[];
  loading: boolean;
  error: string | null;
}

export const useObsoleteStore = defineStore('obsolete', {
  state: (): ObsoleteState => ({
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

    async fetchObsoleteBookmarks() {
      this.loading = true;
      this.error = null;

      try {
        const token = await this.getAuthToken();
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/obsolete-bookmarks`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        this.items = response.data.data.obsoleteBookmarks;
      } catch (err: any) {
        console.error("Error al obtener los marcadores obsoletos:", err);
        this.error = err.response?.data?.message || "Error al obtener los marcadores obsoletos";
        throw err;
      } finally {
        this.loading = false;
      }
    }
  }
});
