import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { BookmarkItem } from '../types/bookmarks';

export const useObsoleteBookmarksStore = defineStore('obsoleteBookmarks', () => {
  const obsoleteBookmarks = ref<BookmarkItem[]>([]);
  const error = ref<string | null>(null);
  const loading = ref(false);

  const fetchObsoleteBookmarks = async (api: any, token: string) => {
    loading.value = true;
    try {
      const response = await api.get("/obsolete-bookmarks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      obsoleteBookmarks.value = response.data.data.obsoleteBookmarks;
      error.value = null;
    } catch (err: any) {
      console.error("Error al obtener los marcadores obsoletos:", err);
      error.value = err.response?.data?.message || "Error al obtener los marcadores obsoletos";
      obsoleteBookmarks.value = [];
    } finally {
      loading.value = false;
    }
  };

  return {
    obsoleteBookmarks,
    error,
    loading,
    fetchObsoleteBookmarks,
  };
});
