import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';
import { useAuthStore } from './auth';
import { useBookmarksStore } from './bookmarks';
import { useObsoleteStore } from './obsolete';

/**
 * Store que gestiona la recarga y reprocesamiento del archivo XBEL.
 * Proporciona funcionalidad para forzar una recarga manual del archivo XBEL
 * y actualizar todos los datos relacionados en la aplicación.
 */
export const useXbelReloadStore = defineStore('xbel-reload', () => {
  const isReloading = ref(false);
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
   * Fuerza una recarga completa del archivo XBEL en el servidor.
   * Esta función está diseñada específicamente para el botón "Recargar XBEL"
   * y realiza las siguientes operaciones:
   * 1. Solicita al servidor que reprocese el archivo XBEL
   * 2. Si es exitoso, actualiza los datos en caché de bookmarks y obsoletos
   *
   * @returns Promise<boolean> - true si la recarga fue exitosa, false en caso contrario
   * @throws Error si hay problemas durante la recarga
   */
  const reloadXbel = async () => {
    isReloading.value = true;
    error.value = null;

    try {
      const token = await getAuthToken();

      // Solicitar al servidor que reprocese el archivo XBEL
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
        // Actualizar los datos en caché después del reprocesamiento exitoso
        const bookmarksStore = useBookmarksStore();
        const obsoleteStore = useObsoleteStore();

        // Obtener los datos actualizados de manera concurrente
        await Promise.all([
          bookmarksStore.fetchBookmarks(),
          obsoleteStore.fetchObsoleteBookmarks()
        ]);

        return true;
      } else {
        throw new Error("La recarga del archivo XBEL no fue exitosa");
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Error desconocido al recargar el archivo XBEL";
      error.value = errorMessage;
      console.error("Error al recargar XBEL:", err);
      return false;
    } finally {
      isReloading.value = false;
    }
  };

  return {
    isReloading,
    error,
    reloadXbel
  };
});
