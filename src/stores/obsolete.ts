import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';
import { useAuthStore } from './auth';
import type { BookmarkItem } from '../types/bookmarks';

/**
 * Store que gestiona los marcadores obsoletos de la aplicación.
 * Se encarga de obtener y mantener la lista de marcadores que pueden estar
 * obsoletos o no disponibles, proporcionando estado de carga y manejo de errores.
 */
export const useObsoleteStore = defineStore('obsolete', () => {
  const items = ref<BookmarkItem[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  /**
   * Obtiene el token de autenticación del usuario actual.
   * @throws Error si el usuario no está autenticado
   * @returns Promise con el token de autenticación
   */
  const getAuthToken = async () => {
    const authStore = useAuthStore();
    if (!authStore.user) {
      throw new Error("Usuario no autenticado");
    }
    return await authStore.user.getIdToken();
  };

  /**
   * Obtiene la lista de marcadores obsoletos desde el servidor.
   * Actualiza el estado del store con los resultados o el error si ocurre.
   * @throws Error si hay un problema al obtener los marcadores
   */
  const fetchObsoleteBookmarks = async () => {
    loading.value = true;
    error.value = null;

    try {
      const token = await getAuthToken();
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/obsolete-bookmarks`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      items.value = response.data.data.obsoleteBookmarks;
    } catch (err: any) {
      console.error("Error al obtener los marcadores obsoletos:", err);
      error.value = err.response?.data?.message || "Error al obtener los marcadores obsoletos";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    items,
    loading,
    error,
    fetchObsoleteBookmarks
  };
});
