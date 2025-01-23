import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';
import { useAuthStore } from './auth';

interface UpdateState {
  isUpdating: boolean;
  error: string | null;
}

export const useUpdateStore = defineStore('update', {
  state: (): UpdateState => ({
    isUpdating: false,
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

    async updateServer() {
      this.isUpdating = true;
      this.error = null;

      try {
        const token = await this.getAuthToken();

        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/update`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (response.data.status === "success") {
          // Disparar evento global para que los módulos se actualicen
          window.dispatchEvent(new CustomEvent('bookmarks-updated'));
          return true;
        } else {
          throw new Error("Error al actualizar el servidor");
        }
      } catch (err: any) {
        this.error = err.message || "Error al actualizar el servidor";
        console.error("Error en la actualización:", err);
        return false;
      } finally {
        this.isUpdating = false;
      }
    }
  }
});
