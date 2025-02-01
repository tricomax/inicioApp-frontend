<script setup lang="ts">
import { onMounted, onUnmounted, inject } from "vue";
import { useFavoritesStore } from '../stores/favorites';
import type { AxiosInstance } from "axios";
import BookmarkComponent from "./BookmarkComponent.vue";

const api = inject<AxiosInstance>("api")!;
const favoritesStore = useFavoritesStore();

const loadFavorites = async () => {
  try {
    await favoritesStore.fetchFavorites();
  } catch (error) {
    console.error("Error fetching favorites:", error);
  }
};

// Manejador para el evento de actualización
const handleBookmarksUpdated = () => {
  loadFavorites();
};

onMounted(async () => {
  // Cargar favoritos inicialmente
  await loadFavorites();
  // Agregar listener para actualizaciones
  window.addEventListener('bookmarks-updated', handleBookmarksUpdated);
});

onUnmounted(() => {
  // Limpiar el listener cuando el componente se destruye
  window.removeEventListener('bookmarks-updated', handleBookmarksUpdated);
});
</script>

<template>
  <div class="fav-container">
    <div v-if="favoritesStore.items.length > 0" class="favorites-grid">
      <BookmarkComponent
        v-for="item in favoritesStore.items"
        :key="item.url"
        :item="item"
        class="bookmark-item"
      />
    </div>
    <div v-else class="empty-favorites">
      <p>No tienes favoritos aún</p>
    </div>
  </div>
</template>

<style scoped>
.fav-container {
  padding: 1rem 1rem 0;
}

.favorites-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  padding: 16px;
  background: #1a1a1a;
  min-height: 100px;
  border: 2px solid #7b7265;
  border-radius: 12px;
}

.empty-favorites {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  background: #1a1a1a;
  border: 2px solid #7b7265;
  border-radius: 12px;
  color: #666;
}


.bookmark-item {
  width: 90px !important;  /* Ligeramente más pequeño que las carpetas */
  height: 90px !important;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
