import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { BookmarkItem } from '../types/bookmarks';
import axios from 'axios';

/**
 * Store que gestiona los marcadores favoritos del usuario.
 * Proporciona funcionalidades para obtener, añadir y eliminar favoritos,
 * así como verificar si un marcador está en la lista de favoritos.
 */
export const useFavoritesStore = defineStore('favorites', () => {
  const items = ref<BookmarkItem[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  /**
   * Obtiene la lista de favoritos desde el servidor.
   * Actualiza el estado del store con los resultados.
   */
  const fetchFavorites = async () => {
    loading.value = true;
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/favorites`);
      items.value = response.data.data.favorites;
      error.value = null;
    } catch (err: any) {
      console.error('Error al cargar favoritos:', err);
      error.value = err.response?.data?.message || 'Error al cargar favoritos';
    } finally {
      loading.value = false;
    }
  };

  /**
   * Añade un marcador a la lista de favoritos.
   * @param bookmark - El marcador a añadir a favoritos
   */
  const addFavorite = async (bookmark: BookmarkItem) => {
    loading.value = true;
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/favorites`, {
        url: bookmark.url,
        title: bookmark.title,
        faviconUrl: bookmark.faviconUrl
      });
      items.value.push(bookmark);
      error.value = null;
    } catch (err: any) {
      console.error('Error al añadir favorito:', err);
      error.value = err.response?.data?.message || 'Error al añadir favorito';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Elimina un marcador de la lista de favoritos.
   * @param bookmark - El marcador a eliminar de favoritos
   */
  const removeFavorite = async (bookmark: BookmarkItem) => {
    loading.value = true;
    try {
      const encodedUrl = encodeURIComponent(bookmark.url || '');
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/favorites/${encodedUrl}`);
      items.value = items.value.filter(item => item.url !== bookmark.url);
      error.value = null;
    } catch (err: any) {
      console.error('Error al eliminar favorito:', err);
      error.value = err.response?.data?.message || 'Error al eliminar favorito';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Verifica si una URL está en la lista de favoritos.
   * @param url - URL a verificar
   * @returns true si la URL está en favoritos, false en caso contrario
   */
  const isFavorite = computed(() => {
    return (url: string) => items.value.some(item => item.url === url);
  });

  return {
    items,
    loading,
    error,
    fetchFavorites,
    addFavorite,
    removeFavorite,
    isFavorite
  };
});
