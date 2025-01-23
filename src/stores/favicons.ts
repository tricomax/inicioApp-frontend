import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';
import { useAuthStore } from './auth';
import { useBookmarksStore } from './bookmarks';

interface FaviconsState {
  uploading: boolean;
  error: string | null;
}

export const useFaviconsStore = defineStore('favicons', {
  state: (): FaviconsState => ({
    uploading: false,
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

    async saveCustomFavicon(url: string, iconFile: File) {
      this.uploading = true;
      this.error = null;

      try {
        const token = await this.getAuthToken();
        const formData = new FormData();
        formData.append('url', url);
        formData.append('favicon', iconFile);

        // Enviar el favicon al servidor
        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/favicons`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );

        if (response.data.status === "success") {
          // Si la subida fue exitosa, recargar los bookmarks de la cache
          const bookmarksStore = useBookmarksStore();
          await bookmarksStore.fetchBookmarks();
          return true;
        } else {
          throw new Error("Error al guardar el favicon");
        }
      } catch (err: any) {
        this.error = err.message || "Error al guardar el favicon";
        console.error("Error al guardar el favicon:", err);
        throw err;
      } finally {
        this.uploading = false;
      }
    }
  }
});
