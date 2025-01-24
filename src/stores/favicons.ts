import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';
import { useAuthStore } from './auth';
import { useBookmarksStore } from './bookmarks';

/**
 * Store que gestiona la subida y actualización de favicons personalizados.
 * Proporciona funcionalidades para subir nuevos favicons y mantener
 * el estado de la operación de subida.
 */
export const useFaviconsStore = defineStore('favicons', () => {
  const uploading = ref(false);
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
   * Guarda un favicon personalizado para un marcador específico.
   * Actualiza la caché de marcadores si la subida es exitosa.
   *
   * @param url - URL del marcador al que se asociará el favicon
   * @param iconFile - Archivo de imagen del nuevo favicon
   * @returns Promise<boolean> - true si la operación fue exitosa
   * @throws Error si hay problemas durante la subida
   */
  const saveCustomFavicon = async (url: string, iconFile: File) => {
    uploading.value = true;
    error.value = null;

    try {
      const token = await getAuthToken();
      const formData = new FormData();
      formData.append('url', url);
      formData.append('favicon', iconFile);

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
        // Actualizamos la caché de marcadores para reflejar el nuevo favicon
        const bookmarksStore = useBookmarksStore();
        await bookmarksStore.fetchBookmarks();
        return true;
      } else {
        throw new Error("Error al guardar el favicon: la respuesta del servidor no fue exitosa");
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Error desconocido al guardar el favicon";
      error.value = errorMessage;
      console.error("Error al guardar el favicon:", errorMessage);
      throw new Error(errorMessage);
    } finally {
      uploading.value = false;
    }
  };

  return {
    uploading,
    error,
    saveCustomFavicon
  };
});
