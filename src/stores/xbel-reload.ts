import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';
import { useAuthStore } from './auth';
import { useBookmarksStore } from './bookmarks';
import { useObsoleteStore } from './obsolete';

interface XbelReloadState {
  isReloading: boolean;
  error: string | null;
}

export const useXbelReloadStore = defineStore('xbel-reload', {
  state: (): XbelReloadState => ({
    isReloading: false,
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

    // Esta función es EXCLUSIVAMENTE para el botón "Recargar XBEL"
    async reloadXbel() {
      this.isReloading = true;
      this.error = null;

      try {
        const token = await this.getAuthToken();

        // POST /xbel-reload es exclusivo para reparsear el archivo XBEL
        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/xbel-reload`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (response.data.status === "success") {
          // Una vez que el servidor confirma que se ha reprocesado el XBEL,
          // obtenemos los datos actualizados de la cache
          const bookmarksStore = useBookmarksStore();
          const obsoleteStore = useObsoleteStore();

          // Obtener los datos actualizados de la cache
          await Promise.all([
            bookmarksStore.fetchBookmarks(),
            obsoleteStore.fetchObsoleteBookmarks()
          ]);

          return true;
        } else {
          throw new Error("Error al recargar el archivo XBEL");
        }
      } catch (err: any) {
        this.error = err.message || "Error al recargar el archivo XBEL";
        console.error("Error al recargar XBEL:", err);
        return false;
      } finally {
        this.isReloading = false;
      }
    }
  }
});
