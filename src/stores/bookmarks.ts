import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from 'axios';
import { useAuthStore } from './auth';
import type { BookmarkItem } from '../types/bookmarks';

/**
 * Store que gestiona los marcadores del usuario.
 * Proporciona funcionalidades para obtener y ordenar los marcadores,
 * manteniendo una caché local de los datos del servidor.
 */
export const useBookmarksStore = defineStore('bookmarks', () => {
  const items = ref<BookmarkItem[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  /**
   * Obtiene los marcadores desde la caché del servidor.
   * Esta función no refresca los datos desde el archivo XBEL,
   * solo obtiene los datos almacenados en la caché del servidor.
   *
   * @throws Error si hay problemas al obtener los marcadores
   */
  const fetchBookmarks = async () => {
    loading.value = true;
    error.value = null;

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/bookmarks`
      );

      console.log('Datos de bookmarks:', response.data.data.bookmarks);
      items.value = response.data.data.bookmarks;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Error desconocido al obtener los marcadores";
      console.error("Error al obtener los marcadores:", err);
      error.value = errorMessage;
      throw new Error(errorMessage);
    } finally {
      loading.value = false;
    }
  };

  /**
   * Devuelve los marcadores ordenados, con las carpetas primero
   * seguidas de los marcadores individuales.
   * @returns Array ordenado de BookmarkItems
   */
  const sortedBookmarks = computed(() => {
    return [
      ...items.value.filter(item => item.type === 'folder'),
      ...items.value.filter(item => item.type === 'bookmark')
    ];
  });

  return {
    items,
    loading,
    error,
    fetchBookmarks,
    sortedBookmarks
  };
});
