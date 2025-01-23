import { defineStore } from 'pinia';
import type { BookmarkItem } from '../types/bookmarks';
import axios from 'axios';

interface FavoritesState {
  items: BookmarkItem[];
  loading: boolean;
  error: string | null;
}

export const useFavoritesStore = defineStore('favorites', {
  state: (): FavoritesState => ({
    items: [],
    loading: false,
    error: null
  }),

  actions: {
    async fetchFavorites() {
      this.loading = true;
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/favorites`);
        this.items = response.data.data.favorites;
      } catch (error) {
        this.error = 'Error al cargar favoritos';
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    async addFavorite(bookmark: BookmarkItem) {
      this.loading = true;
      try {
        await axios.post(`${import.meta.env.VITE_API_BASE_URL}/favorites`, {
          url: bookmark.url,
          title: bookmark.title,
          faviconUrl: bookmark.faviconUrl
        });
        this.items.push(bookmark);
      } catch (error) {
        this.error = 'Error al añadir favorito';
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    async removeFavorite(bookmark: BookmarkItem) {
      this.loading = true;
      try {
        const encodedUrl = encodeURIComponent(bookmark.url || '');
        await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/favorites/${encodedUrl}`);
        this.items = this.items.filter(item => item.url !== bookmark.url);
      } catch (error) {
        this.error = 'Error al eliminar favorito';
        console.error(error);
      } finally {
        this.loading = false;
      }
    }
  },

  getters: {
    isFavorite: (state) => (url: string) => {
      return state.items.some(item => item.url === url);
    }
  }
});
